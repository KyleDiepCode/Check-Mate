// Pure money math for splitting a receipt.
// Everything is done in integer cents so rounding never loses or invents pennies.

// "12.5" -> 1250, "" -> 0, "abc" -> 0
export function toCents(value) {
    const n = typeof value === "number" ? value : parseFloat(value)
    if (!Number.isFinite(n)) return 0
    return Math.round(n * 100)
}

const moneyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

// 1250 -> "$12.50"
export function formatMoney(cents) {
    return moneyFormat.format(cents / 100)
}

// Split `totalCents` into whole-cent pieces proportional to `weights`.
// Uses the "largest remainder" method, so the pieces always add up exactly to totalCents.
// If every weight is 0, the total is split evenly.
export function allocate(totalCents, weights) {
    if (weights.length === 0) return []
    let safeWeights = weights.map((w) => Math.max(0, w))
    let weightSum = safeWeights.reduce((a, b) => a + b, 0)
    if (weightSum === 0) {
        safeWeights = weights.map(() => 1)
        weightSum = weights.length
    }

    const sign = totalCents < 0 ? -1 : 1
    const absTotal = Math.abs(totalCents)
    const exact = safeWeights.map((w) => (absTotal * w) / weightSum)
    const shares = exact.map(Math.floor)
    let leftover = absTotal - shares.reduce((a, b) => a + b, 0)

    // Hand out the leftover pennies to whoever had the biggest fractional part
    const order = exact
        .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
        .sort((a, b) => b.fraction - a.fraction)
    for (let i = 0; leftover > 0; i++, leftover--) {
        shares[order[i % order.length].index] += 1
    }
    return shares.map((s) => s * sign)
}

// Who has each item? { itemId: [personId, ...] } in people order
function ownersByItem(people) {
    const owners = {}
    for (const person of people) {
        for (const itemId of person.items) {
            if (!owners[itemId]) owners[itemId] = []
            owners[itemId].push(person.id)
        }
    }
    return owners
}

// Main calculation.
// items:  [{ id, name, price }]   (price can be a string like "4.50")
// people: [{ id, name, color, items: [itemId] }]
// tax / tip: strings or numbers in dollars
export function computeSplit({ items, people, tax, tip }) {
    const owners = ownersByItem(people)
    const perPerson = new Map(people.map((p) => [p.id, { lines: [], subtotalCents: 0 }]))

    let itemsCents = 0
    let assignedCents = 0

    // A row with no name and no price (e.g. just added) is ignored, so it can't block Calculate
    const isBlank = (item) => !item.name.trim() && toCents(item.price) === 0
    const realItems = items.filter((item) => !isBlank(item))

    items.forEach((item, index) => {
        if (isBlank(item)) return
        const priceCents = toCents(item.price)
        itemsCents += priceCents
        const itemOwners = owners[item.id] || []
        if (itemOwners.length === 0) return

        assignedCents += priceCents
        const shares = allocate(priceCents, itemOwners.map(() => 1))
        itemOwners.forEach((personId, i) => {
            const entry = perPerson.get(personId)
            entry.lines.push({
                name: item.name.trim() || `Item ${index + 1}`,
                priceCents: shares[i],
                sharedWith: itemOwners.length,
            })
            entry.subtotalCents += shares[i]
        })
    })

    // Tax and tip are shared in proportion to what each person ordered
    const subtotals = people.map((p) => perPerson.get(p.id).subtotalCents)
    const taxShares = allocate(toCents(tax), subtotals)
    const tipShares = allocate(toCents(tip), subtotals)

    const results = people.map((person, i) => {
        const entry = perPerson.get(person.id)
        return {
            id: person.id,
            name: person.name,
            color: person.color,
            items: entry.lines,
            subtotalCents: entry.subtotalCents,
            taxCents: taxShares[i],
            tipCents: tipShares[i],
            totalCents: entry.subtotalCents + taxShares[i] + tipShares[i],
        }
    })

    return {
        results,
        itemsCents,
        assignedCents,
        unassignedCents: itemsCents - assignedCents,
        hasItems: realItems.length > 0,
        allAssigned: realItems.length > 0 && realItems.every((item) => (owners[item.id] || []).length > 0),
    }
}
