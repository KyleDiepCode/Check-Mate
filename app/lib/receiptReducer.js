import { nextColor, FIRST_COLOR } from "./colors"

// All of the receipt data lives in one object, and every change goes through
// `receiptReducer`. Because the reducer always gets the *latest* state, two
// updates in the same click can't overwrite each other.

export function createInitialState() {
    return {
        items: [{ id: 1, name: "", price: "" }],
        people: [{ id: 1, name: "Person 1", items: [], color: FIRST_COLOR }],
        subtotal: "",
        tax: "",
        tip: "",
        // Counters only ever go up, so a deleted item's id is never reused
        nextItemId: 2,
        nextPersonId: 2,
        // Venmo: who covered the bill, their username, and who has paid them back
        payerId: null,
        venmoUsername: "",
        paidIds: [],
    }
}

const MONEY_FIELDS = ["subtotal", "tax", "tip"]

export function receiptReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM":
            return {
                ...state,
                items: [...state.items, { id: state.nextItemId, name: "", price: "" }],
                nextItemId: state.nextItemId + 1,
            }

        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.id ? { ...item, [action.field]: action.value } : item
                ),
            }

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.id),
                people: state.people.map((person) => ({
                    ...person,
                    items: person.items.filter((itemId) => itemId !== action.id),
                })),
            }

        case "CLEAR_ITEMS":
            // Fresh receipt: no items, assignments, totals or paid checkmarks.
            // People and the Venmo username stay, since it's often the same group.
            return {
                ...state,
                items: [{ id: state.nextItemId, name: "", price: "" }],
                people: state.people.map((person) => ({ ...person, items: [] })),
                subtotal: "",
                tax: "",
                tip: "",
                paidIds: [],
                nextItemId: state.nextItemId + 1,
            }

        case "ADD_PERSON": {
            const id = state.nextPersonId
            const color = nextColor(state.people.map((p) => p.color))
            return {
                ...state,
                people: [...state.people, { id, name: `Person ${id}`, items: [], color }],
                nextPersonId: id + 1,
            }
        }

        case "UPDATE_PERSON":
            return {
                ...state,
                people: state.people.map((person) =>
                    person.id === action.id ? { ...person, [action.field]: action.value } : person
                ),
            }

        case "REMOVE_PERSON":
            // Always keep at least one person
            if (state.people.length <= 1) return state
            return {
                ...state,
                people: state.people.filter((person) => person.id !== action.id),
                payerId: state.payerId === action.id ? null : state.payerId,
                paidIds: state.paidIds.filter((id) => id !== action.id),
            }

        case "TOGGLE_ASSIGN":
            return {
                ...state,
                people: state.people.map((person) => {
                    if (person.id !== action.personId) return person
                    const has = person.items.includes(action.itemId)
                    return {
                        ...person,
                        items: has
                            ? person.items.filter((id) => id !== action.itemId)
                            : [...person.items, action.itemId],
                    }
                }),
            }

        case "TOGGLE_ALL": {
            const allIds = state.items.map((i) => i.id)
            return {
                ...state,
                people: state.people.map((person) => {
                    if (person.id !== action.personId) return person
                    const hasAll = allIds.every((id) => person.items.includes(id))
                    return { ...person, items: hasAll ? [] : allIds }
                }),
            }
        }

        case "SET_FIELD":
            if (!MONEY_FIELDS.includes(action.field)) return state
            return { ...state, [action.field]: action.value }

        case "LOAD_SCAN": {
            // New receipt: fresh item ids, and wipe old assignments
            const items = action.items.map((item, i) => ({
                id: state.nextItemId + i,
                name: item.name,
                price: String(item.price),
            }))
            return {
                ...state,
                items: items.length ? items : [{ id: state.nextItemId, name: "", price: "" }],
                people: state.people.map((person) => ({ ...person, items: [] })),
                paidIds: [],
                subtotal: action.subtotal ? String(action.subtotal) : "",
                tax: action.tax ? String(action.tax) : "",
                tip: action.tip ? String(action.tip) : "",
                nextItemId: state.nextItemId + Math.max(items.length, 1),
            }
        }

        case "SET_PAYER":
            return {
                ...state,
                payerId: action.id,
                // The payer doesn't pay themselves back
                paidIds: state.paidIds.filter((id) => id !== action.id),
            }

        case "SET_VENMO_USERNAME":
            return { ...state, venmoUsername: action.value }

        case "TOGGLE_PAID":
            return {
                ...state,
                paidIds: state.paidIds.includes(action.id)
                    ? state.paidIds.filter((id) => id !== action.id)
                    : [...state.paidIds, action.id],
            }

        case "RESTORE":
            return action.state

        default:
            return state
    }
}
