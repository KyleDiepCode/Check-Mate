


export default function TitleAndButtons( {pageSwap, setItem, itemNum, setTotal, setTax, setTip} ){


	const grabTotal = (data) => {
		const holder = data.items[data.items.length-1]
		setTotal(holder.totalBeforeTax)
		setTax(holder.tax)
		setTip(holder.tip)
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
					className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
				>
					📷
					<span className="font-medium">Scan Receipt</span>
					<span className="text-xs text-gray-400">Uplaod Image</span>
					<input type="file" accept="image/*" className="hidden" onChange={(e) => {
						const file = e.target.files[0]
						const reader = new FileReader()
						reader.readAsDataURL(file)
						// onload is to what to do with the data
						reader.onload = async (e) => {
							const base64 = e.target.result.split(",")[1]
							const response = await fetch("/api/parse-receipt", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
							})
							const data = await response.json()
							grabTotal(data)
							//everything except last in
							setItem(data.items.slice(0,-1))
							itemNum = data.items.length
							pageSwap("Manual Page")
						}}}>
						</input>
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