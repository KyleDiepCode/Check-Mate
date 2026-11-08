"use client"
import { useRef } from "react"

// One row on the Manual page: item name, price, who has it, and a delete button.
// Clicking the row (not the inputs) gives/takes the item from the selected person.
export default function ItemBar({ item, index, inputRef, assignedPeople, selectedPerson, onToggle, onUpdate, onRemove }) {
    const priceRef = useRef(null)
    const isAssignedToSelected = !!selectedPerson && assignedPeople.some((p) => p.id === selectedPerson.id)
    const nameId = `item-name-${item.id}`
    const priceId = `item-price-${item.id}`

    // Stops a click/keypress on a child (inputs, delete button) from also toggling the row
    const stop = (e) => e.stopPropagation()

    let border = "border-gray-200"
    if (selectedPerson) border = isAssignedToSelected ? "border-transparent" : "border-dashed border-gray-300"

    return (
        <div
            role={selectedPerson ? "button" : undefined}
            tabIndex={selectedPerson ? 0 : undefined}
            aria-pressed={selectedPerson ? isAssignedToSelected : undefined}
            onClick={onToggle}
            onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    onToggle()
                }
            }}
            className={`flex flex-col gap-2 p-2.5 sm:p-3 w-full rounded-xl border-2 transition-colors ${border} ${
                selectedPerson ? "cursor-pointer active:scale-[0.99]" : ""
            }`}
            style={{
                backgroundColor: isAssignedToSelected ? `${selectedPerson.color}55` : "#ffffff",
                borderColor: isAssignedToSelected ? selectedPerson.color : undefined,
            }}
        >
            <div className="flex items-end gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                    {/* Labels are hidden on phones to save space (screen readers still read them) */}
                    <label htmlFor={nameId} className="field-label sr-only sm:not-sr-only">
                        Item {index + 1}
                    </label>
                    <input
                        id={nameId}
                        ref={inputRef}
                        type="text"
                        value={item.name}
                        placeholder={`Item ${index + 1}`}
                        enterKeyHint="next"
                        onChange={(e) => onUpdate("name", e.target.value)}
                        onClick={stop}
                        onKeyDown={(e) => {
                            stop(e)
                            if (e.key === "Enter") priceRef.current.focus()
                        }}
                        className="field"
                    />
                </div>
                <div className="w-24 sm:w-28 shrink-0">
                    <label htmlFor={priceId} className="field-label sr-only sm:not-sr-only">
                        Price
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
                        <input
                            id={priceId}
                            ref={priceRef}
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            value={item.price}
                            placeholder="0.00"
                            onChange={(e) => onUpdate("price", e.target.value)}
                            onClick={stop}
                            onKeyDown={stop}
                            className="field pl-6 tabular-nums"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    aria-label={`Delete ${item.name || `item ${index + 1}`}`}
                    onClick={(e) => {
                        stop(e)
                        onRemove()
                    }}
                    onKeyDown={stop}
                    className="shrink-0 w-10 h-10 sm:h-9.5 -mr-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:bg-red-50 transition text-xl cursor-pointer"
                >
                    ×
                </button>
            </div>

            {/* Who has this item */}
            <div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-gray-600"
                aria-label={
                    assignedPeople.length
                        ? `Assigned to ${assignedPeople.map((p) => p.name).join(", ")}`
                        : "Not assigned"
                }
            >
                {assignedPeople.length === 0 && <span className="text-gray-400">Not assigned yet</span>}
                {assignedPeople.map((person) => (
                    <span key={person.id} className="inline-flex items-center gap-1.5">
                        <span
                            className="w-3 h-3 rounded-full ring-1 ring-black/10"
                            style={{ backgroundColor: person.color }}
                        />
                        {person.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
