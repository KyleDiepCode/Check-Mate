"use client"
import { useState } from "react"
import { formatMoney } from "../lib/split"

function Row({ label, cents }) {
    return (
        <div className="flex justify-between text-xs text-gray-600 uppercase tracking-wider">
            <span>{label}</span>
            <span className="tabular-nums">{formatMoney(cents)}</span>
        </div>
    )
}

// Opens the phone's share sheet (Messages, WhatsApp...). Falls back to copying.
// Returns "shared", "copied", "cancelled" or "failed".
async function shareOrCopy(text) {
    if (navigator.share) {
        try {
            await navigator.share({ text })
            return "shared"
        } catch (err) {
            if (err.name === "AbortError") return "cancelled" // they closed the share sheet
        }
    }
    try {
        await navigator.clipboard.writeText(text)
        return "copied"
    } catch {
        return "failed"
    }
}

// Bottom of the card: "Send link" button + "Paid" checkbox, or a note for the payer
function PaymentFooter({ result, isPayer, payerName, shareMessage, isPaid, onTogglePaid }) {
    const [status, setStatus] = useState(null)

    if (isPayer) {
        return (
            <div className="font-sans px-5 py-3 bg-sage/60 text-sm text-forest font-medium text-center">
                Paid the bill — gets paid back
            </div>
        )
    }
    if (!shareMessage) return null

    const send = async () => {
        const outcome = await shareOrCopy(shareMessage)
        if (outcome === "failed") {
            // Last resort: show the message so it can be copied by hand
            window.prompt("Copy this and send it:", shareMessage)
            return
        }
        setStatus(outcome)
        setTimeout(() => setStatus(null), 2500)
    }

    let label = `Send ${result.name || "them"} their link`
    if (status === "copied") label = "Copied! Paste it in a text"
    if (status === "shared") label = "Sent ✓"

    return (
        <div className="font-sans px-5 py-4 flex flex-col gap-3 border-t border-dashed border-gray-600">
            {isPaid ? (
                <p className="text-center text-forest font-semibold">✓ Paid {payerName}</p>
            ) : (
                <button type="button" onClick={send} className="btn-primary w-full py-3 text-base">
                    {label}
                </button>
            )}
            <label className="flex items-center justify-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={onTogglePaid}
                    className="w-5 h-5 accent-forest"
                />
                Mark as paid
            </label>
        </div>
    )
}

// Receipt-style card for one person
export default function ResultCube({ result, isPayer, payerName, shareMessage, isPaid, onTogglePaid }) {
    return (
        <div
            style={{
                fontFamily: "'Courier New', Courier, monospace",
                backgroundColor: "#F9F8F4",
                borderLeft: `5px solid ${result.color}`,
            }}
            className={`flex flex-col w-full max-w-sm sm:w-72 rounded-sm shadow-md overflow-hidden transition-opacity ${
                isPaid ? "opacity-70" : ""
            }`}
        >
            <div className="px-5 pt-5 pb-3 border-b border-dashed border-gray-600">
                <p className="text-xs tracking-widest text-gray-500 uppercase">Check-Mate</p>
                <h2 className="text-2xl font-bold mt-0.5 tracking-tight text-gray-800 break-words">{result.name}</h2>
            </div>

            <div className="px-5 py-3 flex flex-col gap-1">
                <div className="flex justify-between text-xs tracking-widest text-gray-600 uppercase mb-1">
                    <span>Item</span>
                    <span>Price</span>
                </div>
                {result.items.length === 0 && <p className="text-sm text-gray-500">Nothing ordered</p>}
                {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm gap-4">
                        <span className="min-w-0 break-words">
                            {item.name}
                            {item.sharedWith > 1 && <span className="text-gray-500"> (1/{item.sharedWith})</span>}
                        </span>
                        <span className="shrink-0 tabular-nums">{formatMoney(item.priceCents)}</span>
                    </div>
                ))}
            </div>

            <div className="px-5 pb-5 flex flex-col gap-1 border-t border-dashed border-gray-600 pt-3">
                <Row label="Subtotal" cents={result.subtotalCents} />
                <Row label="Tax" cents={result.taxCents} />
                <Row label="Tip" cents={result.tipCents} />

                <div className="border-t border-dashed border-gray-600 my-2" />

                <div className="flex justify-between text-base font-bold tracking-wide">
                    <span>TOTAL</span>
                    <span className="tabular-nums">{formatMoney(result.totalCents)}</span>
                </div>

                <p aria-hidden="true" className="text-center text-gray-600 text-xs mt-3 tracking-widest">
                    * * * * * * * * * * *
                </p>
            </div>

            <PaymentFooter
                result={result}
                isPayer={isPayer}
                payerName={payerName}
                shareMessage={shareMessage}
                isPaid={isPaid}
                onTogglePaid={onTogglePaid}
            />
        </div>
    )
}
