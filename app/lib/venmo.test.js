import { describe, it, expect } from "vitest"
import { buildVenmoLink, buildNote, buildShareMessage, cleanUsername, isValidUsername } from "./venmo"
import { receiptReducer, createInitialState } from "./receiptReducer"

describe("usernames", () => {
    it("strips @ and spaces", () => {
        expect(cleanUsername("  @Kyle-Diep ")).toBe("Kyle-Diep")
    })

    it("accepts real-looking usernames only", () => {
        expect(isValidUsername("@kyle-diep")).toBe(true)
        expect(isValidUsername("kyle_d24")).toBe(true)
        expect(isValidUsername("kd")).toBe(false) // too short
        expect(isValidUsername("kyle diep")).toBe(false) // space
        expect(isValidUsername("kyle/../evil")).toBe(false)
        expect(isValidUsername("")).toBe(false)
    })
})

describe("buildNote", () => {
    it("lists item names", () => {
        expect(buildNote(["Pho Tai", "Spring Rolls"])).toBe("Check-Mate: Pho Tai, Spring Rolls")
    })
    it("falls back when there are no items", () => {
        expect(buildNote([])).toBe("Check-Mate")
    })
    it("stays short", () => {
        const note = buildNote(["A very long item name", "Another very long item name", "And one more"])
        expect(note.length).toBeLessThanOrEqual(60)
        expect(note.endsWith("…")).toBe(true)
    })
})

describe("buildVenmoLink", () => {
    it("builds a pay link with amount and an encoded note", () => {
        const link = buildVenmoLink({ username: "@kyle-diep", amountCents: 1842, note: "Pho & rolls" })
        const url = new URL(link)
        expect(url.origin + url.pathname).toBe("https://venmo.com/kyle-diep")
        expect(url.searchParams.get("txn")).toBe("pay")
        expect(url.searchParams.get("amount")).toBe("18.42")
        expect(url.searchParams.get("note")).toBe("Pho & rolls")
    })

    it("formats amounts with two decimals", () => {
        const link = buildVenmoLink({ username: "kyle-diep", amountCents: 30, note: "x" })
        expect(new URL(link).searchParams.get("amount")).toBe("0.30")
    })

    it("returns null when nothing is owed or the username is bad", () => {
        expect(buildVenmoLink({ username: "kyle-diep", amountCents: 0, note: "x" })).toBeNull()
        expect(buildVenmoLink({ username: "kyle-diep", amountCents: -500, note: "x" })).toBeNull()
        expect(buildVenmoLink({ username: "no", amountCents: 500, note: "x" })).toBeNull()
    })
})

describe("buildShareMessage", () => {
    it("writes a friendly text with the amount, items and link", () => {
        const msg = buildShareMessage({
            name: "Alex",
            payerName: "Kyle",
            amountCents: 1539,
            itemNames: ["Spring Rolls", "Bun Bo Hue"],
            link: "https://venmo.com/kyle-diep?txn=pay",
        })
        expect(msg).toBe(
            "Hey Alex! Your share of the bill is $15.39 (Spring Rolls, Bun Bo Hue). Pay Kyle on Venmo: https://venmo.com/kyle-diep?txn=pay"
        )
    })
})

describe("payer state", () => {
    it("tracks who paid and who has paid back", () => {
        let state = receiptReducer(createInitialState(), { type: "ADD_PERSON" })
        state = receiptReducer(state, { type: "SET_PAYER", id: 1 })
        state = receiptReducer(state, { type: "TOGGLE_PAID", id: 2 })
        expect(state.payerId).toBe(1)
        expect(state.paidIds).toEqual([2])
        state = receiptReducer(state, { type: "TOGGLE_PAID", id: 2 })
        expect(state.paidIds).toEqual([])
    })

    it("removing the payer clears them", () => {
        let state = receiptReducer(createInitialState(), { type: "ADD_PERSON" })
        state = receiptReducer(state, { type: "SET_PAYER", id: 2 })
        state = receiptReducer(state, { type: "REMOVE_PERSON", id: 2 })
        expect(state.payerId).toBeNull()
    })

    it("a new receipt resets paid checkmarks but keeps the username", () => {
        let state = createInitialState()
        state = receiptReducer(state, { type: "SET_VENMO_USERNAME", value: "kyle-diep" })
        state = receiptReducer(state, { type: "TOGGLE_PAID", id: 1 })
        state = receiptReducer(state, { type: "CLEAR_ITEMS" })
        expect(state.paidIds).toEqual([])
        expect(state.venmoUsername).toBe("kyle-diep")
    })
})
