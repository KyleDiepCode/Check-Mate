


export default function TitleAndButtons(){
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
			<button
				onClick={() => setPage("Scanning Receipt")}
				className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
			>
				📷
				<span className="font-medium">Scan Receipt</span>
				<span className="text-xs text-gray-400">Upload a photo</span>
			</button>

			<button
				onClick={() => setPage("calculator")}
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