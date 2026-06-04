


export default function Total(){

    return (
        <div>
        
        {/* The Main White Card */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Receipt Splitter</h1>

            {/* --- GLOBAL INPUTS (The whole receipt) --- */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Total Receipt Details</h2>
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Global Total Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total ($)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-blue-600"
                            placeholder="0.00"
                            onChange={(e) => setTotal(Number(e.target.value))}
                        />
                    </div>

                    {/* Global Tax Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ">Tax ($)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-blue-600 "
                            placeholder="0.00"
                            onChange={(e) => setTax(Number(e.target.value))}
                        />
                    </div>

                    {/* Global Tip Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tip ($)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-blue-600 "
                            placeholder="0.00"
                            onChange={(e) => setTip(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}