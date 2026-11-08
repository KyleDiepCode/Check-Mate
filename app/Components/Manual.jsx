"use client"
import { useEffect, useRef, useState } from "react"
import Header from "./Header"
import ItemBar from "./ItemBar"
import PersonCard from "./Person"
import { computeSplit, formatMoney, toCents } from "../lib/split"
import { textColorFor } from "../lib/colors"

const TIP_PERCENTS = [15, 18, 20]

function MoneyInput({ id, label, value, onChange }) {
    return (
        <div>
            <label htmlFor={id} className="field-label">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
                <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="field pl-6 tabular-nums"
                />
            </div>
        </div>
    )
}

export default function ManualInputPage({ setPage, receipt, dispatch }) {
    const { items, people, subtotal, tax, tip } = receipt
    const [selectedId, setSelectedId] = useState(null)

    // If the selected person gets removed, this simply becomes undefined
    const selectedPerson = people.find((p) => p.id === selectedId)

    const split = computeSplit({ items, people, tax, tip })
    const subtotalById = new Map(split.results.map((r) => [r.id, r.subtotalCents]))

    const receiptSubtotalCents = toCents(subtotal)
    const subtotalMismatch = subtotal !== "" && receiptSubtotalCents !== split.itemsCents
    const allSelected = !!selectedPerson && items.every((i) => selectedPerson.items.includes(i.id))
    const billTotalCents = split.itemsCents + toCents(tax) + toCents(tip)

    // Put the cursor in a newly added item (but not on first load)
    const lastItemRef = useRef(null)
    const prevItemCount = useRef(items.length)
    useEffect(() => {
        if (items.length > prevItemCount.current) lastItemRef.current?.focus()
        prevItemCount.current = items.length
    }, [items.length])

    const toggleItem = (itemId) => {
        if (!selectedPerson) return
        dispatch({ type: "TOGGLE_ASSIGN", personId: selectedPerson.id, itemId })
    }

    const setTipPercent = (percent) => {
        const baseCents = receiptSubtotalCents || split.itemsCents
        const tipCents = Math.round((baseCents * percent) / 100)
        dispatch({ type: "SET_FIELD", field: "tip", value: (tipCents / 100).toFixed(2) })
    }

    const clearAll = () => {
        if (window.confirm("Clear all items, assignments, tax and tip? Your people stay.")) {
            dispatch({ type: "CLEAR_ITEMS" })
        }
    }

    return (
        <div className="flex flex-col h-dvh overflow-hidden">
            <Header onBack={() => setPage("title")} />

            {/* Hint, or which person is selected */}
            {selectedPerson ? (
                <div
                    className="shrink-0 px-4 py-2 flex items-center justify-between gap-3"
                    style={{ backgroundColor: selectedPerson.color, color: textColorFor(selectedPerson.color) }}
                >
                    <span className="font-semibold text-sm truncate">
                        Tap what {selectedPerson.name || "they"} had
                    </span>
                    <div className="flex gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => dispatch({ type: "TOGGLE_ALL", personId: selectedPerson.id })}
                            className="text-sm font-medium bg-white/70 text-gray-800 px-3 py-1 rounded-lg cursor-pointer"
                        >
                            {allSelected ? "Deselect all" : "Select all"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedId(null)}
                            className="text-sm font-medium bg-white/70 text-gray-800 px-3 py-1 rounded-lg cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                </div>
            ) : (
                <p className="shrink-0 px-4 py-2 text-sm text-forest text-center bg-sage/50">
                    Pick a person below, then tap their items.
                </p>
            )}

            {/* Scrolling content */}
            <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-5">
                <div className="mx-auto w-full max-w-2xl flex flex-col gap-4 sm:gap-5">
                    {/* Items */}
                    <section className="card p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
                        <div className="flex items-baseline justify-between">
                            <h2 className="font-semibold text-gray-800">Items</h2>
                            <span className="text-sm text-gray-500 tabular-nums">
                                {formatMoney(split.itemsCents)}
                            </span>
                        </div>

                        {items.map((item, index) => (
                            <ItemBar
                                key={item.id}
                                item={item}
                                index={index}
                                inputRef={index === items.length - 1 ? lastItemRef : null}
                                assignedPeople={people.filter((p) => p.items.includes(item.id))}
                                selectedPerson={selectedPerson}
                                onToggle={() => toggleItem(item.id)}
                                onUpdate={(field, value) => dispatch({ type: "UPDATE_ITEM", id: item.id, field, value })}
                                onRemove={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                            />
                        ))}

                        <div className="flex items-center justify-between gap-3 pt-1">
                            <button type="button" onClick={() => dispatch({ type: "ADD_ITEM" })} className="btn-secondary">
                                + Add item
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="btn text-red-600 border border-red-200 bg-white hover:bg-red-50 active:bg-red-50"
                            >
                                Clear all
                            </button>
                        </div>
                    </section>

                    {/* Tax & tip */}
                    <section className="card p-4 sm:p-5 flex flex-col gap-4">
                        <h2 className="font-semibold text-gray-800">Tax &amp; tip</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <MoneyInput
                                id="receipt-subtotal"
                                label="Receipt subtotal (optional)"
                                value={subtotal}
                                onChange={(value) => dispatch({ type: "SET_FIELD", field: "subtotal", value })}
                            />
                            <MoneyInput
                                id="receipt-tax"
                                label="Tax"
                                value={tax}
                                onChange={(value) => dispatch({ type: "SET_FIELD", field: "tax", value })}
                            />
                            <div className="flex flex-col gap-2">
                                <MoneyInput
                                    id="receipt-tip"
                                    label="Tip"
                                    value={tip}
                                    onChange={(value) => dispatch({ type: "SET_FIELD", field: "tip", value })}
                                />
                                <div className="flex gap-1.5">
                                    {TIP_PERCENTS.map((percent) => (
                                        <button
                                            key={percent}
                                            type="button"
                                            onClick={() => setTipPercent(percent)}
                                            className="flex-1 text-sm font-medium rounded-lg py-2 bg-sage/60 text-forest hover:bg-sage transition cursor-pointer"
                                        >
                                            {percent}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {subtotalMismatch && (
                            <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                                Items add up to {formatMoney(split.itemsCents)}, but the receipt subtotal says{" "}
                                {formatMoney(receiptSubtotalCents)}. Check for a missing or misread price.
                            </p>
                        )}
                    </section>

                    {/* Calculate */}
                    <section className="flex flex-col items-center gap-2 pb-2">
                        {!split.allAssigned ? (
                            <p className="text-sm text-red-600">
                                {!split.hasItems
                                    ? "Add an item to get started."
                                    : split.unassignedCents !== 0
                                      ? `Give every item to someone first (${formatMoney(split.unassignedCents)} left).`
                                      : "Give every item to someone first."}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Bill total <span className="font-semibold tabular-nums">{formatMoney(billTotalCents)}</span>
                            </p>
                        )}
                        <button
                            type="button"
                            className="btn-primary w-full sm:w-64 py-3 text-base"
                            disabled={!split.allAssigned}
                            onClick={() => setPage("results")}
                        >
                            Calculate!?!
                        </button>
                    </section>
                </div>
            </main>

            {/* People bar (stays at the bottom) */}
            <div className="shrink-0 bg-white border-t border-gray-200">
                <div className="flex flex-row gap-4 overflow-x-auto px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-full md:justify-center">
                    {people.map((person) => (
                        <PersonCard
                            key={person.id}
                            person={person}
                            isSelected={person.id === selectedId}
                            subtotalCents={subtotalById.get(person.id) ?? 0}
                            canRemove={people.length > 1}
                            onSelect={() => setSelectedId(person.id === selectedId ? null : person.id)}
                            onRename={(value) => dispatch({ type: "UPDATE_PERSON", id: person.id, field: "name", value })}
                            onRemove={() => dispatch({ type: "REMOVE_PERSON", id: person.id })}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "ADD_PERSON" })}
                        className="shrink-0 rounded-xl border-2 border-dashed border-gray-300 px-5 text-sm font-medium text-gray-600 hover:border-forest hover:text-forest transition cursor-pointer"
                    >
                        + Add person
                    </button>
                </div>
            </div>
        </div>
    )
}
