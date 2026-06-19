
"use client"
import { useState, useRef, useEffect } from "react";
import ItemBar from "./ItemBar";
import PersonRow from "./Person";
import Total from "./MoneyTotals";



export default function ManualInputPage(){

    const colors = ["#8EB1C7", "#FFEB0A", "#EFAB57", "#5A5379", "#C51B29"]

    // Global total of all items
    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [tip, setTip] = useState(0);


    // Toggler and track player
    const [personToggle, setPersonToggle] = useState(
        {
            selectedid: -1,
            clicked: false,
        }
    )

    // # of Item List 
    const [items, setItem] = useState([
        {
        id : 1,
        name : "",
        price : 0,
    }
    ]);

    // # of people list
    const [people, setPeople] = useState([
        { 
        id: 1,
        name: "Person 1", 
        items: [],
        subtotal: 0, 
        color: colors[0],
        }
    ]);

    // Adding items/people
    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            name: "",
            price: 0
        };
    setItem([...items, newItem])
    }

    const addPerson = () => {
        const newPerson = 
        {
            id: people.length + 1, // Gives them a unique ID for # of peop;le
            name: `Person ${people.length + 1}`, // ${} is to input int into string
            subtotal: 0,
            color: colors[people.length],
            items: []
        };
        setPeople([...people, newPerson]); 
    }

    // Update information on website
    const updateItem = (id, field, newValue) => 
    {
        setItem(items.map((item) => {
        if (item.id === id) {
            return { ...item, [field]: newValue }; // Copying the item then replacing the needed one
        }
        return item; // Currently itterating through and will return the new updated item
        }));
    }

    const personSelect = (clickedid) => {
        //UnSelect
        if(personToggle.clicked == true && personToggle.selectedid == clickedid){
            setPersonToggle({...personToggle, selectedid: -1, clicked: false})
        }
        //select
        else{
            setPersonToggle({...personToggle, selectedid: clickedid, clicked: true})
        }

    }


// OnClick of an Item, Check for selected person and give the person the item.
    const toggleselect = (itemid) => 
    {
        setPeople(people.map( (person) => {
            // If player currently selected and person id is the same as selected
            if(personToggle.clicked && person.id === personToggle.selectedid){
                // If Already inside
                if(person.items.includes(itemid)){
                    return {...person, items: person.items.filter((id) => id !== itemid)}
                    console.log("clicked item")
                }
                //if not inside
                else{
                    return {...person, items: [...person.items, itemid]}
                }
            }
            else{
                return person
            }
        } ))
    }   

// Conditional to turn the item gray
    const itemGreyselect = (itemid) =>{
        if(personToggle.clicked){
            const holder = people.find((person) => person.id === personToggle.selectedid)
            if(holder && holder.items.includes(itemid)){
                return true
            }
        }
        return false
    }


// Calculate the SubTotal for single person
    const calculateSubtotal = (person) =>{
        //Check each id for this person
        return person.items.reduce((total,id) => {
            const tempItem = items.find((i) => i.id == id)
            if(!tempItem) return total
            //Filter checking each person if they have the id, doing the incude to 
            //only include the person with id. Length of array is whats left
            const splitCount = people.filter((p)=> p.items.includes(id)).length
            return total + (tempItem.price / splitCount)
        }, 0)
    }
// Auto cursor to the Item
    const newItemref = useRef(null)

    useEffect(() => {
        if(newItemref.current){
            newItemref.current.focus()
        }
    
    }, [items.length])



    return(
        <div className="flex flex-col m-10 h-lvl bg-gray-500">
            {/* This is the Item List */}
            <div className="flex flex-col gap-2 h-screen items-center overflow-y-auto ">
                <button 
                    onClick={addItem}
                    className="cursor-pointer self-end mb-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                    + Add Food Item
                </button>
                {items.map ( (item, index) => {
                    return <ItemBar 
                    key = {item.id}
                    item = {item} 
                    newItemref={index === items.length - 1 ? newItemref : null}
                    updateItem={updateItem} 
                    toggleselect={toggleselect} 
                    assignedPeople = {people.filter((person) => person.items.includes(item.id))}
                    itemGreyselect= {itemGreyselect}
                    />
                })
                }
                <button>
                    
                </button>

            </div>
            {/* This is the People Bar */}
            <div className="fixed bottom-7 left-0 w-full md:w-34/35 bg-white p-4 flex flex-row justify-around mx-5 ">
                <div className="flex flex-row gap-3">
                    {people.map( (person) => {
                        return <PersonRow 
                        key={person.id} 
                        person={person} 
                        personSelect={personSelect} 
                        personToggle = {personToggle} 
                        calculateSubtotal = {calculateSubtotal} 
                        />

                    })}

                    <button
                        onClick={addPerson}
                        className="cursor-pointer bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition shadow-sm"
                    >
                        + Add Person
                    </button>
                </div>
            </div>

        </div>
    )
}