
import ResultCube from "./PersonResultCube"




export default function Results({pageSwap, results}){
    return(
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl mx-auto">
            <button
                className="fixed top-4 left-4 z-10 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 shadow-sm transition"
                onClick={() => { pageSwap("Manual Page") }}
            >
                ← Back
            </button>
            {results.map( (cube, i) =>{
                return <ResultCube key = {i} cube = {cube}/>
            })}
        </div>
    );
}