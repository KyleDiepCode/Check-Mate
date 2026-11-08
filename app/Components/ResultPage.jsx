"use client"
import { useState } from "react"
import Header from "./Header"
import ResultCube from "./PersonResultCube"
import { computeSplit, formatMoney } from "../lib/split"
import { buildNote, buildShareMessage, buildVenmoLink, cleanUsername, isValidUsername } from "../lib/venmo"

// Plain-text version for pasting into a group chat
function buildSummary(results, totalCents, payer, links) {
    const header = `Check-Mate split (${formatMoney(totalCents)} total)${payer ? ` — pay ${payer.name}` : ""}`
    const lines = results
        .filter((r) => !payer || r.id !== payer.id)
        .map((r) => {
            const link = links.get(r.id)
            return `${r.name}: ${formatMoney(r.totalCents)}${link ? `\n${link}` : ""}`
        })
    return [header, ...lines].join("\n")
}

export default function ResultsPage({ setPage, receipt, dispatch }) {
    const [copied, setCopied] = useState(false)
    // Worked out from the current receipt, so it's never out of date
    const { results } = computeSplit(receipt)
    const totalCents = results.reduce((sum, r) => sum + r.totalCents, 0)

    const payer = results.find((r) => r.id === receipt.payerId)
    const username = cleanUsername(receipt.venmoUsername)
    const usernameOk = isValidUsername(username)
    const showUsernameError = receipt.venmoUsername.trim() !== "" && !usernameOk

    // One Venmo link per person who owes the payer something
    const links = new Map()
    if (payer && usernameOk) {
        for (const r of results) {
            if (r.id === payer.id) continue
            const link = buildVenmoLink({
                username,
                amountCents: r.totalCents,
                note: buildNote(r.items.map((i) => i.name)),
            })
            if (link) links.set(r.id, link)
        }
    }

    const owers = results.filter((r) => payer && r.id !== payer.id && r.totalCents > 0)
    const paidCount = owers.filter((r) => receipt.paidIds.includes(r.id)).length

    const copySummary = async () => {
        try {
            await navigator.clipboard.writeText(buildSummary(results, totalCents, payer, links))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            window.alert("Couldn't copy — your browser blocked clipboard access.")
        }
    }

    return (
        <div className="min-h-dvh flex flex-col">
            <Header onBack={() => setPage("manual")}>
                <button type="button" onClick={copySummary} className="btn-primary">
                    {copied ? "Copied!" : "Copy"}
                </button>
            </Header>

            <main className="flex-1 px-4 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">Bill total</p>
                    <p className="text-3xl font-bold text-forest tabular-nums">{formatMoney(totalCents)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        split between {results.length} {results.length === 1 ? "person" : "people"}
                        {owers.length > 0 && links.size > 0 && (
                            <>
                                {" · "}
                                <span className={paidCount === owers.length ? "text-forest font-semibold" : ""}>
                                    {paidCount} of {owers.length} paid
                                </span>
                            </>
                        )}
                    </p>
                </div>

                {/* Who paid + their Venmo */}
                {results.length > 1 && (
                    <section className="card mx-auto w-full max-w-sm sm:max-w-2xl p-4 mb-8 flex flex-col gap-3">
                        <h2 className="font-semibold text-gray-800">Get paid back on Venmo</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="payer" className="field-label">
                                    Who paid the bill?
                                </label>
                                <select
                                    id="payer"
                                    className="field"
                                    value={receipt.payerId ?? ""}
                                    onChange={(e) =>
                                        dispatch({ type: "SET_PAYER", id: e.target.value ? Number(e.target.value) : null })
                                    }
                                >
                                    <option value="">Choose…</option>
                                    {results.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name || "Unnamed"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="venmo-username" className="field-label">
                                    {payer ? `${payer.name}'s` : "Their"} Venmo username
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        @
                                    </span>
                                    <input
                                        id="venmo-username"
                                        className="field pl-7"
                                        placeholder="your-username"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        spellCheck={false}
                                        value={receipt.venmoUsername}
                                        onChange={(e) => dispatch({ type: "SET_VENMO_USERNAME", value: e.target.value })}
                                        aria-invalid={showUsernameError}
                                        aria-describedby="venmo-help"
                                    />
                                </div>
                            </div>
                        </div>
                        <p id="venmo-help" className={`text-xs ${showUsernameError ? "text-red-600" : "text-gray-500"}`}>
                            {showUsernameError
                                ? "Venmo usernames are 5–30 letters, numbers, - or _."
                                : links.size > 0
                                  ? "Tap Send on a receipt to text that person their link, or Copy for the group chat."
                                  : "Each person gets a link that opens Venmo with their amount filled in."}
                        </p>
                    </section>
                )}

                <div className="flex flex-wrap justify-center gap-6">
                    {results.map((result) => (
                        <ResultCube
                            key={result.id}
                            result={result}
                            isPayer={payer?.id === result.id}
                            payerName={payer?.name}
                            shareMessage={
                                links.has(result.id)
                                    ? buildShareMessage({
                                          name: result.name,
                                          payerName: payer.name,
                                          amountCents: result.totalCents,
                                          itemNames: result.items.map((i) => i.name),
                                          link: links.get(result.id),
                                      })
                                    : null
                            }
                            isPaid={receipt.paidIds.includes(result.id)}
                            onTogglePaid={() => dispatch({ type: "TOGGLE_PAID", id: result.id })}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
