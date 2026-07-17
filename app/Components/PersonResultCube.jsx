


export default function ResultCube({cube}){

    return(
        <div
        className="flex flex-col border p-5 rounded-xl w-65 h-40 md:w-80 md:h-55"
        >
            <h1 className="border-b-3">
                {`${cube.name}`}
            </h1>
            {cube.items.map( (item) => (
                <div key={item.name}>
                    {item.name}: ${item.price.toFixed(2)}
                </div>
            ))}
            <p>{`SubTotal = $${cube.total.toFixed(2)}`}</p>
            <p>{`Tax = $${cube.tax.toFixed(2)}`}</p>
            <p>{`Tip = $${cube.tip.toFixed(2)}`}</p>
            <p>{`Grand Total = $${cube.grandtotal.toFixed(2)}`}</p>

        </div>
    );
}