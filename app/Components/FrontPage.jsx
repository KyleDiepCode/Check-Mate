"use client"
import { useState } from "react"
import { compressImage } from "../lib/image"

// Turns a File into base64. Used if the browser can't compress it (e.g. HEIC on Chrome).
function readAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(",")[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

async function scanOne(file) {
    let payload
    try {
        payload = await compressImage(file)
    } catch {
        payload = { base64: await readAsBase64(file), mimeType: file.type }
    }

    const response = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: payload.base64, mimeType: payload.mimeType }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new Error(data.error || "Couldn't read the receipt — try a clearer photo.")
    }
    return data
}

const STEPS = ["Scan or type your receipt", "Tap who had what", "See what everyone owes"]

export default function FrontPage({ setPage, dispatch }) {
    const [scanning, setScanning] = useState(false)
    const [scanError, setScanError] = useState(null)

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files)
        e.target.value = "" // lets you pick the same file again after an error
        if (!files.length) return

        setScanning(true)
        setScanError(null)
        try {
            const scans = await Promise.all(files.map(scanOne))

            // Several photos = one long receipt, so add everything together
            const merged = { items: [], subtotal: 0, tax: 0, tip: 0 }
            for (const scan of scans) {
                merged.items.push(...scan.items)
                merged.subtotal += scan.subtotal
                merged.tax += scan.tax
                merged.tip += scan.tip
            }
            const round = (n) => Math.round(n * 100) / 100

            dispatch({
                type: "LOAD_SCAN",
                items: merged.items,
                subtotal: round(merged.subtotal),
                tax: round(merged.tax),
                tip: round(merged.tip),
            })
            setPage("manual")
        } catch (err) {
            setScanError(err.message)
        } finally {
            setScanning(false)
        }
    }

    const tile =
        "flex-1 flex flex-col items-center gap-1 p-6 rounded-xl border-2 border-sage bg-white hover:border-forest/50 hover:bg-background transition cursor-pointer text-center"

    return (
        <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 py-10">
            <div className="w-full max-w-md bg-sage rounded-2xl px-8 py-10 text-center">
                <h1 className="font-concert text-5xl text-forest">Check-Mate</h1>
                <p className="font-concert text-sm text-forest/80 mt-1">Hangouts made easy!!!</p>
            </div>

            <div className="card w-full max-w-md p-6 sm:p-8 flex flex-col gap-5">
                <p className="text-center text-gray-600 font-medium">How do you want to start?</p>

                {scanError && (
                    <p role="alert" className="text-red-600 text-sm text-center bg-red-50 rounded-lg px-3 py-2">
                        {scanError}
                    </p>
                )}

                <div className="flex gap-3">
                    <label className={`${tile} ${scanning ? "opacity-60 pointer-events-none" : ""}`}>
                        <span aria-hidden="true" className="text-3xl">
                            📷
                        </span>
                        <span className="font-semibold text-gray-800">{scanning ? "Scanning…" : "Scan Receipt"}</span>
                        <span className="text-xs text-gray-500">1 or more photos</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={handleFiles}
                            disabled={scanning}
                        />
                    </label>

                    <button type="button" onClick={() => setPage("manual")} className={tile}>
                        <span aria-hidden="true" className="text-3xl">
                            ✏️
                        </span>
                        <span className="font-semibold text-gray-800">Enter Manually</span>
                        <span className="text-xs text-gray-500">Type items in</span>
                    </button>
                </div>

                <ol className="flex flex-col gap-2 border-t border-gray-100 pt-5">
                    {STEPS.map((step, i) => (
                        <li key={step} className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="w-6 h-6 shrink-0 rounded-full bg-sage text-forest text-xs font-bold flex items-center justify-center">
                                {i + 1}
                            </span>
                            {step}
                        </li>
                    ))}
                </ol>
            </div>
        </main>
    )
}
