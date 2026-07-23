
"use client"
import { useState, useRef, useEffect } from "react";
import ItemBar from "./ItemBar";
import PersonRow from "./Person";


export default function ManualInputPage({ pageSwap, changeResults, total, setTotal, tax, setTax, tip, setTip, items, setItem, people, setPeople, colors }) {

    // Toggler and track player
    const [personToggle, setPersonToggle] = useState(
        {
            selectedid: -1,
            clicked: false,
        }
    )

    // Consisitent count of items even after deleted

    // Adding items/people
    const addItem = () => {
        const newItem = {
            id: Math.max(...items.map(i=>i.id), 0) + 1,
            name: "",
            price: 0
        };
        setItem([...items, newItem])
    }

    const removeItem = (id) => {
        setItem(items.filter((item) => item.id !== id))
        setPeople(people.map((person) => ({
            ...person,
            items: person.items.filter((itemId) => itemId !== id)
        })))
    }

    const removePerson = (id) => {
        setPeople(people.filter((person) => person.id !== id))
    }

    const addPerson = () => {
        const newPerson =
        {
            id: people.length + 1, // Gives them a unique ID for # of peop;le
            name: `Person ${people.length + 1}`, // ${} is to input int into string
            color: colors[people.length],
            items: []
        };
        setPeople([...people, newPerson]);
    }

    // Update information on website
    const updateItem = (id, field, newValue) => {
        setItem(items.map((item) => {
            if (item.id === id) {
                return { ...item, [field]: newValue }; // Copying the item then replacing the needed one
            }
            return item; // Currently itterating through and will return the new updated item
        }));
    }
    const updatePerson = (id, field, newValue) => {
        setPeople(people.map((person) => {
            if (person.id === id) {
                return { ...person, [field]: newValue }; // Copying the item then replacing the needed one
            }
            return person; // Currently itterating through and will return the new updated item
        }));
    }

    const personSelect = (clickedid) => {
        //UnSelect
        if (personToggle.clicked == true && personToggle.selectedid == clickedid) {
            setPersonToggle({ ...personToggle, selectedid: -1, clicked: false })
        }
        //select
        else {
            setPersonToggle({ ...personToggle, selectedid: clickedid, clicked: true })
        }

    }


    // OnClick of an Item, Check for selected person and give the person the item.
    const toggleselect = (itemid) => {
        setPeople(people.map((person) => {
            // If player currently selected and person id is the same as selected
            if (personToggle.clicked && person.id === personToggle.selectedid) {
                // If Already inside
                if (person.items.includes(itemid)) {
                    return { ...person, items: person.items.filter((id) => id !== itemid) }
                    console.log("clicked item")
                }
                //if not inside
                else {
                    return { ...person, items: [...person.items, itemid] }
                }
            }
            else {
                return person
            }
        }))
    }

    // Conditional to turn the item gray
    const itemGreyselect = (itemid) => {
        if (personToggle.clicked) {
            const holder = people.find((person) => person.id === personToggle.selectedid)
            if (holder && holder.items.includes(itemid)) {
                return true
            }
        }
        return false
    }


    // Calculate the SubTotal for single person
    const calculateSubtotal = (person) => {
        //Check each id for this person
        return person.items.reduce((total, id) => {
            const tempItem = items.find((i) => i.id == id)
            if (!tempItem) return total
            //Filter checking each person if they have the id, doing the incude to 
            //only include the person with id. Length of array is whats left
            const splitCount = people.filter((p) => p.items.includes(id)).length
            return total + (tempItem.price / splitCount)
        }, 0)
    }

    // Calculate the Total price - chosen items
    const calculateUnassignedTotal = () => {
        const totalItems = items.reduce((sum, item) => sum + item.price, 0)
        const assignedTotal = people.reduce((sum, person) => {
            return sum + calculateSubtotal(person)
        }, 0)
        return totalItems - assignedTotal
    }

    // Calculate the tax percentage and what each person should pay in tax
    const calculatePersonTaxTip = (person, subtotal, taxamount, tipamount) => {
        const taxpercent = taxamount / subtotal
        const tippercent = tipamount / subtotal
        const personSubTotal = calculateSubtotal(person)
        let personTipShare = personSubTotal * tippercent
        if (isNaN(personTipShare)) personTipShare = 0
        let personTaxShare = personSubTotal * taxpercent
        if (isNaN(personTaxShare)) personTaxShare = 0
        return {
            total: personSubTotal,
            tax: personTaxShare,
            tip: personTipShare,
            grandtotal: personSubTotal + personTaxShare + personTipShare
        }
    }

    // Checks that each Item has at least one person connected to it
    const allItemsAssigned = items.every((item) => people.some((p) => p.items.includes(item.id)))
    // Checks to see that all items added equals the toal and 0.05 for error
    const totalsMatch = Math.abs(items.reduce((sum, item) => sum + item.price, 0) - (parseFloat(total) || 0)) < 0.01


    // Auto cursor to the Item
    const newItemref = useRef(null)

    useEffect(() => {
        if (newItemref.current) {
            newItemref.current.focus()
        }

    }, [items.length])



    return (
        <div className="flex flex-col m-10 h-lvl bg-gray-500">
            <button
                className="fixed top-4 left-4"
                onClick={() => { pageSwap("Title Page") }}
            >
                &lt; Back
            </button>
            {/* This is the Item List */}
            <button
                onClick={addItem}
                className="w-55 cursor-pointer self-end mb-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
                + Add Food Item
            </button>
            <div className="flex flex-col gap-2 h-screen items-center overflow-y-auto ">
                {items.map((item, index) => {

                    return <ItemBar
                        key={item.id}
                        item={item}
                        newItemref={index === items.length - 1 ? newItemref : null}
                        updateItem={updateItem}
                        toggleselect={toggleselect}
                        assignedPeople={people.filter((person) => person.items.includes(item.id))}
                        itemGreyselect={itemGreyselect}
                        removeItem={removeItem}
                    />

                })
                }
                <div className="flex flex-col bg-white border rounded-lg p-3">
                    <label className="block text-xs text-gray-500 mb-1">Subtotal (no tax)</label>
                    <input
                        type="number"
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        className=" border bg-gray-300 border-gray-300 mb-3 rounded-lg p-2 text-sm text-blue-600"
                    >
                    </input>
                    <p> `${calculateUnassignedTotal()}`</p>
                    <label className="block text-xs text-gray-500 mb-1">Tax</label>
                    <input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        className=" border bg-gray-300 mb-3 border-gray-300 rounded-lg p-2 text-sm text-blue-600"
                    >
                    </input>
                    <label className="block text-xs text-gray-500 mb-1">Tip</label>
                    <input
                        type="number"
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                        className=" border bg-gray-300 mb-3 border-gray-300 rounded-lg p-2 text-sm text-blue-600"
                    >
                    </input>
                </div>
                {/* Add Input that takes the subtotal and tax */}
                <button
                    className="border rounded-lg p-3 px-7 bg-black text-white"
                    onClick={() => {
                        if (!allItemsAssigned || !totalsMatch) {
                            alert("Please assign all items and make sure totals match!")
                            return
                        }
                        changeResults(people.map((person) => {
                            const personStats = calculatePersonTaxTip(person, parseFloat(total) || 0, parseFloat(tax) || 0, parseFloat(tip) || 0)
                            return {
                                // ...personStats works also
                                name: person.name,
                                total: personStats.total,
                                tax: personStats.tax,
                                tip: personStats.tip,
                                grandtotal: personStats.grandtotal,

                                items: person.items.map((itemId) => {
                                    const foundItem = items.find((item) => item.id === itemId)
                                    const splitCount = people.filter((p) => p.items.includes(itemId)).length
                                    const splitPrice = foundItem.price / splitCount

                                    return {
                                        name: foundItem.name || `Item ${foundItem.id}`,
                                        price: splitPrice,

                                    }
                                })
                            }
                        }))
                        pageSwap("Results Page")
                    }}
                >
                    Calculate!?!
                </button>

            </div>
            {/* This is the People Bar */}
            <div className="fixed bottom-7 left-0 w-full md:w-34/35 p-4 flex flex-row justify-around mx-5 ">
                <div className="flex flex-row gap-3">
                    {people.map((person) => {
                        return <PersonRow
                            key={person.id}
                            person={person}
                            personSelect={personSelect}
                            personToggle={personToggle}
                            calculateSubtotal={calculateSubtotal}
                            updatePerson={updatePerson}
                        />

                    })}

                    <button
                        onClick={addPerson}
                        className="cursor-pointer bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition shadow-sm"
                    >
                        + Add Person
                    </button>
                    <button
                        onClick={() => removePerson(people.length)}
                        className="cursor-pointer bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition shadow-sm"
                    >
                        - Remove Person
                    </button>
                </div>
            </div>

        </div>
    )
}