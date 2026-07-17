
import ResultCube from "./PersonResultCube"




export default function Results({pageSwap, results}){
    return(
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl mx-auto">
            <button 
            className="fixed top-4 left-4"
            onClick={ () => {pageSwap("Manual Page")}}
            >
                &lt; Back
            </button>
            {results.map( (cube, i) =>{
                return <ResultCube key = {i} cube = {cube}/>
            })}
        </div>
    );
}