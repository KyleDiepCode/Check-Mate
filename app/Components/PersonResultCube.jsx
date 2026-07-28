export default function ResultCube({ cube }) {
    return (
        <div style={{
            fontFamily: "'Courier New', Courier, monospace",
            backgroundColor: '#F9F8F4',
            borderLeft: `5px solid ${cube.color}`,
        }}
            className="flex flex-col w-72 rounded-sm shadow-md overflow-hidden"
        >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-dashed border-gray-600">
                <p className="text-xs tracking-widest text-gray-400 uppercase">Check-Mate</p>
                <h2 className="text-2xl font-bold mt-0.5 tracking-tight" style={{ color: cube.color }}>
                    {cube.name}
                </h2>
            </div>

            {/* Items */}
            <div className="px-5 py-3 flex flex-col gap-1">
                <div className="flex justify-between text-xs tracking-widest text-gray-600 uppercase mb-1">
                    <span>Item</span>
                    <span>Price</span>
                </div>
                {cube.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm gap-4">
                        <span className="truncate">{item.name}</span>
                        <span className="shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            ${item.price.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="px-5 pb-5 flex flex-col gap-1 border-t border-dashed border-gray-600 pt-3">
                <div className="flex justify-between text-xs text-gray-600 uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>${cube.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 uppercase tracking-wider">
                    <span>Tax</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>${cube.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 uppercase tracking-wider">
                    <span>Tip</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>${cube.tip.toFixed(2)}</span>
                </div>

                <div className="border-t border-dashed border-gray-600 my-2" />

                <div className="flex justify-between text-base font-bold tracking-wide">
                    <span>TOTAL</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>${cube.grandtotal.toFixed(2)}</span>
                </div>

                <p className="text-center text-gray-600 text-xs mt-3 tracking-widest">* * * * * * * * * * *</p>
            </div>
        </div>
    )
}
