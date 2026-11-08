"use client"
import { formatMoney } from "../lib/split"
import { textColorFor } from "../lib/colors"

// A person card in the bottom bar.
// First tap selects the person. Once selected, tapping the name lets you rename them.
// (Otherwise, on a phone, most taps would land in the name box instead of selecting.)
export default function PersonCard({ person, isSelected, subtotalCents, canRemove, onSelect, onRename, onRemove }) {
    const textColor = isSelected ? textColorFor(person.color) : "#374151"

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    onSelect()
                }
            }}
            className={`relative shrink-0 pl-4 pr-9 py-3 rounded-xl flex flex-col items-start gap-0.5 cursor-pointer select-none transition-all ${
                isSelected ? "-translate-y-1 shadow-md" : "active:scale-95"
            }`}
            style={{
                boxShadow: `0 0 0 3px ${person.color}`,
                backgroundColor: isSelected ? person.color : "#ffffff",
                color: textColor,
            }}
        >
            <input
                aria-label="Person name"
                title={isSelected ? "Tap to rename" : undefined}
                // `size` makes the box fit the name on every browser (iPhone Safari ignores fieldSizing)
                size={Math.max(person.name.length, 4)}
                className={`font-semibold text-base bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-black/20 ${
                    isSelected ? "underline decoration-dotted underline-offset-4" : "pointer-events-none"
                }`}
                style={{ fieldSizing: "content", color: textColor }}
                tabIndex={isSelected ? 0 : -1}
                value={person.name}
                onChange={(e) => onRename(e.target.value)}
                onClick={(e) => {
                    e.stopPropagation()
                    e.target.select()
                }}
                onKeyDown={(e) => e.stopPropagation()}
            />
            <span className="text-xs font-medium tabular-nums opacity-80">{formatMoney(subtotalCents)}</span>
            {canRemove && (
                <button
                    type="button"
                    aria-label={`Remove ${person.name}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="absolute top-0.5 right-0.5 w-8 h-8 flex items-center justify-center rounded-full text-base opacity-60 hover:opacity-100 hover:bg-black/10 cursor-pointer"
                >
                    ×
                </button>
            )}
        </div>
    )
}
