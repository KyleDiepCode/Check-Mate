


export default function ScanPage({ pageSwap, changeResults, total, setTotal, tax, setTax, tip, setTip, items, setItem, people, setPeople, colors }) {
    return (
        <div 
        className="flex flex-col gap-4 bg-gray-200 min-h-screen items-center"
        >
            <label
            className="cursor-pointer w-40 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition shadow-sm"
            >
                Upload Receipt
                <input type="file" accept="image/*" className="hidden"></input>
            </label>
        </div>
    )
}