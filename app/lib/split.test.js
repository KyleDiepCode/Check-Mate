import { describe, it, expect } from "vitest"
import { toCents, allocate, computeSplit, formatMoney } from "./split"
import { receiptReducer, createInitialState } from "./receiptReducer"

const sum = (arr) => arr.reduce((a, b) => a + b, 0)

describe("toCents", () => {
    it("handles strings, numbers and junk", () => {
        expect(toCents("12.5")).toBe(1250)
        expect(toCents(0.1 + 0.2)).toBe(30)
        expect(toCents("")).toBe(0)
        expect(toCents("abc")).toBe(0)
        expect(toCents("-3.99")).toBe(-399)
    })
})

describe("formatMoney", () => {
    it("formats cents as dollars", () => {
        expect(formatMoney(1250)).toBe("$12.50")
        expect(formatMoney(-399)).toBe("-$3.99")
    })
})

describe("allocate", () => {
    it("always adds up exactly", () => {
        expect(sum(allocate(1000, [1, 1, 1]))).toBe(1000)
        expect(allocate(1000, [1, 1, 1]).sort()).toEqual([333, 333, 334])
        expect(sum(allocate(-1000, [1, 1, 1]))).toBe(-1000)
        expect(sum(allocate(777, [123, 456, 1]))).toBe(777)
    })

    it("splits evenly when every weight is zero", () => {
        expect(allocate(300, [0, 0, 0])).toEqual([100, 100, 100])
    })

    it("gives nothing to a zero weight when others have weight", () => {
        expect(allocate(500, [0, 10])).toEqual([0, 500])
    })
})

describe("computeSplit", () => {
    const items = [
        { id: 1, name: "Pizza", price: "10.00" },
        { id: 2, name: "", price: "5" },
    ]

    it("splits shared items and tax/tip so totals match the bill to the penny", () => {
        const people = [
            { id: 1, name: "A", color: "#000", items: [1, 2] },
            { id: 2, name: "B", color: "#000", items: [1] },
            { id: 3, name: "C", color: "#000", items: [1] },
        ]
        const { results, itemsCents, allAssigned } = computeSplit({ items, people, tax: "1.33", tip: "2.01" })

        expect(allAssigned).toBe(true)
        expect(itemsCents).toBe(1500)
        expect(sum(results.map((r) => r.subtotalCents))).toBe(1500)
        expect(sum(results.map((r) => r.taxCents))).toBe(133)
        expect(sum(results.map((r) => r.tipCents))).toBe(201)
        expect(sum(results.map((r) => r.totalCents))).toBe(1500 + 133 + 201)

        // Each card adds up on its own
        for (const r of results) {
            expect(r.subtotalCents + r.taxCents + r.tipCents).toBe(r.totalCents)
            expect(sum(r.items.map((i) => i.priceCents))).toBe(r.subtotalCents)
        }
    })

    it("names unnamed items by their position", () => {
        const people = [{ id: 1, name: "A", color: "#000", items: [2] }]
        const { results } = computeSplit({ items, people, tax: "", tip: "" })
        expect(results[0].items[0].name).toBe("Item 2")
    })

    it("reports unassigned items", () => {
        const people = [{ id: 1, name: "A", color: "#000", items: [1] }]
        const split = computeSplit({ items, people, tax: "", tip: "" })
        expect(split.allAssigned).toBe(false)
        expect(split.unassignedCents).toBe(500)
    })

    it("ignores blank rows but not a $0 item with a name", () => {
        const people = [{ id: 1, name: "A", color: "#000", items: [1, 2] }]
        const withBlank = [...items, { id: 3, name: "", price: "" }]
        expect(computeSplit({ items: withBlank, people, tax: "", tip: "" }).allAssigned).toBe(true)
        const withFreeItem = [...items, { id: 3, name: "Water", price: "" }]
        expect(computeSplit({ items: withFreeItem, people, tax: "", tip: "" }).allAssigned).toBe(false)
    })

    it("can't calculate with no items at all", () => {
        const people = [{ id: 1, name: "A", color: "#000", items: [] }]
        const blankOnly = [{ id: 1, name: "", price: "" }]
        expect(computeSplit({ items: blankOnly, people, tax: "", tip: "" }).allAssigned).toBe(false)
    })

    it("someone who ordered nothing pays no tax or tip", () => {
        const people = [
            { id: 1, name: "A", color: "#000", items: [1, 2] },
            { id: 2, name: "B", color: "#000", items: [] },
        ]
        const { results } = computeSplit({ items, people, tax: "1", tip: "3" })
        expect(results[1].totalCents).toBe(0)
        expect(results[0].totalCents).toBe(1900)
    })
})

describe("receiptReducer", () => {
    it("removing an item also removes it from every person", () => {
        let state = createInitialState()
        state = receiptReducer(state, { type: "TOGGLE_ASSIGN", personId: 1, itemId: 1 })
        state = receiptReducer(state, { type: "REMOVE_ITEM", id: 1 })
        expect(state.people[0].items).toEqual([])
    })

    it("never reuses a deleted item's id", () => {
        let state = createInitialState()
        state = receiptReducer(state, { type: "ADD_ITEM" })
        const lastId = state.items.at(-1).id
        state = receiptReducer(state, { type: "REMOVE_ITEM", id: lastId })
        state = receiptReducer(state, { type: "ADD_ITEM" })
        expect(state.items.at(-1).id).not.toBe(lastId)
    })

    it("clear all wipes items, assignments and totals but keeps people", () => {
        let state = createInitialState()
        state = receiptReducer(state, { type: "TOGGLE_ASSIGN", personId: 1, itemId: 1 })
        state = receiptReducer(state, { type: "SET_FIELD", field: "tax", value: "4.86" })
        state = receiptReducer(state, { type: "SET_FIELD", field: "tip", value: "9" })
        state = receiptReducer(state, { type: "SET_FIELD", field: "subtotal", value: "54" })
        state = receiptReducer(state, { type: "CLEAR_ITEMS" })
        expect(state.items).toHaveLength(1)
        expect(state.items[0]).toMatchObject({ name: "", price: "" })
        expect(state.people[0].items).toEqual([])
        expect(state.people[0].name).toBe("Person 1")
        expect([state.subtotal, state.tax, state.tip]).toEqual(["", "", ""])
    })

    it("keeps at least one person", () => {
        const state = receiptReducer(createInitialState(), { type: "REMOVE_PERSON", id: 1 })
        expect(state.people).toHaveLength(1)
    })

    it("loading a scan clears old assignments", () => {
        let state = createInitialState()
        state = receiptReducer(state, { type: "TOGGLE_ASSIGN", personId: 1, itemId: 1 })
        state = receiptReducer(state, {
            type: "LOAD_SCAN",
            items: [{ name: "Soup", price: 4.5 }],
            subtotal: 4.5,
            tax: 0.4,
            tip: 0,
        })
        expect(state.people[0].items).toEqual([])
        expect(state.items[0]).toMatchObject({ name: "Soup", price: "4.5" })
        expect(state.tax).toBe("0.4")
    })

    it("gives new people different colors", () => {
        let state = createInitialState()
        for (let i = 0; i < 12; i++) state = receiptReducer(state, { type: "ADD_PERSON" })
        const colors = state.people.map((p) => p.color)
        expect(new Set(colors).size).toBe(colors.length)
    })
})
