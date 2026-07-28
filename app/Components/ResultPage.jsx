
import ResultCube from "./PersonResultCube"




export default function Results({pageSwap, results}){
    return(
        <div className="min-h-screen bg-gray-100 px-6 pt-20 pb-10">
            <button
                className="fixed top-4 left-4 z-10 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 shadow-sm transition"
                onClick={() => { pageSwap("Manual Page") }}
            >
                ← Back
            </button>
            <div className="flex flex-wrap justify-center gap-6">
                {results.map((cube, i) => (
                    <ResultCube key={i} cube={cube} />
                ))}
            </div>
        </div>
    );
}