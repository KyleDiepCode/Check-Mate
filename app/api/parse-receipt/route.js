import {GoogleGenerativeAI} from "@google/generative-ai";



export async function POST(request){

    const { imageBase64, mimeType } = await request.json()
    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAi.getGenerativeModel({model: "gemini-3.1-flash-lite"})

    const result = await model.generateContent([
        {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType
            }
        },
        "Parse this receipt and return ONLY a JSON array of items with this exact format, no other text (id is just the amount of items in list): [{\"id\": 1 \"name\": \"item name\", \"price\": 0.00}, {\"totalBeforeTax\": 0.00, \"tax\": 0.00, \"tip\": 0.00}]"
    ])
    const text = result.response.text()
    const cleaned = text.replace(/```json|```/g, "").trim()
    const items = JSON.parse(cleaned)
    return Response.json({items})
}