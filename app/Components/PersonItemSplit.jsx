"use client"
import { useState } from "react";
import ItemBar from "./ItemBar";
import PersonRow from "./Person";
import Total from "./MoneyTotals";

export default function Splitter(){

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
        tax: 0, 
        tip: 0 
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
            items: [],
            tax: 0,
            tip: 0
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

// Calculate the SubTotal per person

    const calculateSubtotal = (person) =>{
        

    }




    return (
        <div
        className="w-full max-w-3xl"
        >
            <div className="flex justify-between mt-9 items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    People Splitting ({people.length})
                </h2>
                <button
                    onClick={addPerson}
                    className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition shadow-sm"
                >
                    + Add Person
                </button>
            </div>
            <div className="space-y-4">
                {/* The Magic of Props! */}
                {people.map((person) => 
                (
                    <PersonRow key={person.id} person={person} personSelect={personSelect} personToggle = {personToggle} />
                ))
                }
            </div> 

            <div className = "flex flex-col gap-4 p-5 bg-white rounded-lg shadow-sm mt-10 ">

                <button 
                    onClick={addItem}
                    className="self-end mb-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                    + Add Food Item
                </button>

                <div className="space-y-4"> {/* This adds the section based on how many items*/ }
                    {items.map((item) => (<ItemBar key = {item.id} item = {item} updateItem={updateItem} toggleselect={toggleselect} itemGreyselect= {itemGreyselect}/>))}
                </div>
            </div>
        </div>
    );

}