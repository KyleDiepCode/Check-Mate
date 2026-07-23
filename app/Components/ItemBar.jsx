
"use client"
import { useEffect, useRef } from "react";







// Item bar is the Text Box for the food and price
export default function ItemBar({ item, updateItem, newItemref, toggleselect, assignedPeople, itemGreyselect, removeItem}) {
    const moveTotalref = useRef(null)

    const textBoxStyle = "block text-xs text-gray-500 mb-1"
    return (
        <div
            onClick={() => toggleselect(item.id)}
            className={`flex items-center gap-10 p-3 w-full md:w-132 rounded-lg shadow-m mb-3 ${itemGreyselect(item.id) ? 'bg-gray-200' : 'bg-gray-50'}`}>
            <div className="flex-1">
                <label className={textBoxStyle}> Item {item.id}</label>
                <input
                    ref={newItemref}
                    type="text"
                    value={item.name}
                    placeholder="Chicken"
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            moveTotalref.current.focus()
                        }
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-blue-600 "
                >
                </input>
            </div>
            <div className="w-32">
                <label className={textBoxStyle}> $ Price</label>
                <input
                    ref={moveTotalref}
                    type="number"
                    value={item.price || ""}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-blue-600 "
                    onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                >
                </input>
            </div>
            <div className="flex flex-wrap border-2 rounded-md p-2 mt-4">
                {assignedPeople
                    .map((person) => (
                        <div
                            key={person.id}
                            className={`flex flex-wrap w-5 h-5 rounded-full`}
                            style={{ backgroundColor: person.color }}
                        />
                    ))
                }
            </div>
            <button
                onClick={() => removeItem(item.id)}
                className="cursor-pointer self-end mb-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
                X
            </button>
        </div>
    );
}

