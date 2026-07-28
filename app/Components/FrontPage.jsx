


"use client"
import { useState } from "react"

export default function TitleAndButtons( {pageSwap, setItem, itemNum, setTotal, setTax, setTip} ){
	const [scanning, setScanning] = useState(false)
	const [scanError, setScanError] = useState(null)

	const handleFiles = async (e) => {
		const files = Array.from(e.target.files)
		if (!files.length) return
		setScanning(true)
		setScanError(null)
		try {
			const allResults = await Promise.all(files.map(async (file) => {
				const base64 = await new Promise((res, rej) => {
					const reader = new FileReader()
					reader.onload = () => res(reader.result.split(",")[1])
					reader.onerror = rej
					reader.readAsDataURL(file)
				})
				const response = await fetch("/api/parse-receipt", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
				})
				return response.json()
			}))

			let mergedItems = []
			let mergedTotal = 0, mergedTax = 0, mergedTip = 0
			let counter = 1

			allResults.forEach(({ items }) => {
				const last = items[items.length - 1]
				mergedTotal += last.totalBeforeTax || 0
				mergedTax += last.tax || 0
				mergedTip += last.tip || 0
				items.slice(0, -1).forEach(item => {
					mergedItems.push({ id: counter++, name: item.name, price: item.price })
				})
			})

			setItem(mergedItems)
			setTotal(String(Math.round(mergedTotal * 100) / 100))
			setTax(String(Math.round(mergedTax * 100) / 100))
			setTip(String(Math.round(mergedTip * 100) / 100))
			pageSwap("Manual Page")
		} catch (err) {
			setScanError("Couldn't read the receipt — try a clearer photo.")
		} finally {
			setScanning(false)
		}
	}



	return(
	<div className="min-h-screen flex flex-col items-center justify-center gap-4">

		{/* Title outside the card */}
		<div className="w-2/5 bg-[#D9E6C6] rounded-xl p-4 text-center m-10 p-12">
			<h1 className="font-concert text-4xl text-[#3a5c2a] font-bold">
			Check-Mate
			</h1>
			<p className="font-concert text-xs text-[#3a5c2a]">
				Hangouts made easy!!!
			</p>
		</div>

		{/* White card */}
		<div className="flex flex-col items-center gap-4 border border-gray-200 rounded-2xl p-10 bg-white">

			<p className="text-gray-500">How do you want to start?</p>
			{scanError && <p className="text-red-500 text-sm">{scanError}</p>}

			<div className="flex gap-4">
				{/*
				<button
					onClick={() => pageSwap("Scan Page")}
					className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
				>
					📷
					<span className="font-medium">Scan Receipt</span>
					<span className="text-xs text-gray-400">Upload a photo</span>
				</button>
				 */}

				<label
					className={`flex flex-col items-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer ${scanning ? "opacity-50 pointer-events-none" : ""}`}
				>
					📷
					<span className="font-medium">{scanning ? "Scanning…" : "Scan Receipt"}</span>
					<span className="text-xs text-gray-400">1 or more images</span>
					<input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
				</label>

				<button
					onClick={() => pageSwap("Manual Page")}
					className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
				>
					✏️
					<span className="font-medium">Enter Manually</span>
					<span className="text-xs text-gray-400">Type items in</span>
				</button>
			</div>

		</div>
    </div>
    )
}