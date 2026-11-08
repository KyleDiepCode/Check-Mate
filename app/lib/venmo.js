// Builds Venmo "pay me" links. Tapping one opens Venmo (app on phones, website on
// computers) with the recipient, amount and note already filled in.
// Docs: https://venmo.com/paymentlinks
//
// If Venmo ever changes the format (some newer guides use venmo.com/u/USERNAME),
// this is the only line that needs to change.
const VENMO_BASE = "https://venmo.com/"

const MAX_NOTE_LENGTH = 60

// "@Kyle-Diep " -> "Kyle-Diep"
export function cleanUsername(raw) {
    return String(raw ?? "").trim().replace(/^@+/, "")
}

// Venmo usernames are 5–30 letters, numbers, hyphens or underscores
export function isValidUsername(raw) {
    return /^[A-Za-z0-9_-]{5,30}$/.test(cleanUsername(raw))
}

// "Check-Mate: Pho Tai, Spring Rolls" (shortened if it gets long)
export function buildNote(itemNames) {
    const base = "Check-Mate"
    const names = itemNames.filter(Boolean)
    if (names.length === 0) return base
    let note = `${base}: ${names.join(", ")}`
    if (note.length > MAX_NOTE_LENGTH) note = note.slice(0, MAX_NOTE_LENGTH - 1).trimEnd() + "…"
    return note
}

// The text message the payer sends to one friend
// "Hey Alex! Your share of dinner is $15.39 (Spring Rolls, Bun Bo Hue). Pay Kyle on Venmo: https://..."
export function buildShareMessage({ name, payerName, amountCents, itemNames, link }) {
    const amount = (amountCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
    const items = itemNames.filter(Boolean)
    const greeting = name ? `Hey ${name}! ` : ""
    const what = items.length ? ` (${items.join(", ")})` : ""
    return `${greeting}Your share of the bill is ${amount}${what}. Pay ${payerName} on Venmo: ${link}`
}

// Returns null when a link doesn't make sense (bad username or nothing owed)
export function buildVenmoLink({ username, amountCents, note }) {
    const name = cleanUsername(username)
    if (!isValidUsername(name) || !(amountCents > 0)) return null
    const params = new URLSearchParams({
        txn: "pay",
        amount: (amountCents / 100).toFixed(2),
        note: note || "Check-Mate",
    })
    return `${VENMO_BASE}${encodeURIComponent(name)}?${params}`
}
