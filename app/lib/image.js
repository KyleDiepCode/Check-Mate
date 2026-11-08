// Shrinks a photo in the browser before uploading it.
// Phone photos are often 5-10 MB, and Vercel rejects request bodies over ~4.5 MB.
// 1600px on the long side is still plenty for reading a receipt.
export async function compressImage(file, maxSide = 1600, quality = 0.8) {
    const url = URL.createObjectURL(file)
    try {
        const img = await new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => resolve(image)
            image.onerror = () => reject(new Error("Could not open that image."))
            image.src = url
        })

        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL("image/jpeg", quality)
        return { base64: dataUrl.split(",")[1], mimeType: "image/jpeg" }
    } finally {
        URL.revokeObjectURL(url)
    }
}
