import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"

// ~4 MB of base64 text. Images are compressed in the browser first, so real
// uploads should be far smaller than this.
const MAX_IMAGE_CHARS = 4_000_000
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]

// Very small per-IP rate limit. It lives in memory, so on Vercel each server
// instance keeps its own count. Good enough to stop casual abuse of the API key;
// use something like Upstash/Vercel KV if you need a real limit.
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 10
const requestLog = new Map()

function isRateLimited(ip) {
    const now = Date.now()
    const recent = (requestLog.get(ip) || []).filter((t) => now - t < WINDOW_MS)
    recent.push(now)
    requestLog.set(ip, recent)
    return recent.length > MAX_REQUESTS_PER_WINDOW
}

// Gemini must answer in exactly this shape
const receiptSchema = {
    type: SchemaType.OBJECT,
    properties: {
        items: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    name: { type: SchemaType.STRING },
                    price: { type: SchemaType.NUMBER },
                },
                required: ["name", "price"],
            },
        },
        subtotal: { type: SchemaType.NUMBER },
        tax: { type: SchemaType.NUMBER },
        tip: { type: SchemaType.NUMBER },
    },
    required: ["items"],
}

const PROMPT = `Read this receipt. List every purchased line item with its name and total line price in dollars.
Do not list subtotal, tax, tip, gratuity, or total lines as items.
Discounts should be items with a negative price.
Also return the subtotal before tax, the tax, and the tip/gratuity if they are printed (use 0 if missing).`

function toNumber(value) {
    const n = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""))
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0
}

function errorResponse(message, status) {
    return Response.json({ error: message }, { status })
}

export async function POST(request) {
    if (!process.env.GEMINI_API_KEY) {
        return errorResponse("Receipt scanning isn't set up on this server (missing API key).", 500)
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
    if (isRateLimited(ip)) {
        return errorResponse("Too many scans — wait a minute and try again.", 429)
    }

    let body
    try {
        body = await request.json()
    } catch {
        return errorResponse("Request body must be JSON.", 400)
    }

    const { imageBase64, mimeType } = body || {}
    if (typeof imageBase64 !== "string" || imageBase64.length === 0) {
        return errorResponse("No image was sent.", 400)
    }
    if (imageBase64.length > MAX_IMAGE_CHARS) {
        return errorResponse("That image is too large.", 413)
    }
    if (!ALLOWED_TYPES.includes(mimeType)) {
        return errorResponse("Unsupported image type.", 415)
    }

    try {
        const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAi.getGenerativeModel({
            model: "gemini-3.1-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: receiptSchema,
            },
        })

        const result = await model.generateContent([
            { inlineData: { data: imageBase64, mimeType } },
            PROMPT,
        ])
        const parsed = JSON.parse(result.response.text())

        // Don't trust the AI blindly: clean up every field
        const items = (Array.isArray(parsed.items) ? parsed.items : [])
            .map((item) => ({ name: String(item.name ?? "").trim(), price: toNumber(item.price) }))
            .filter((item) => item.name || item.price)

        return Response.json({
            items,
            subtotal: toNumber(parsed.subtotal ?? 0),
            tax: toNumber(parsed.tax ?? 0),
            tip: toNumber(parsed.tip ?? 0),
        })
    } catch (err) {
        console.error("parse-receipt failed:", err)
        return errorResponse("Couldn't read the receipt — try a clearer photo.", 502)
    }
}
