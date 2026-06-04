"use client"

import { useState } from "react";
import MainWebsite from "./MainWebsite"


/* main Page
To run the page 
\. "$HOME/.nvm/nvm.sh"
pnpm dev
*/


function PriceDivision ( { people, total, tax, tip }){
  const priceSplit = total / people.length
  const buttonStyles = "relative inline-flex items-center justify-center p-2 px-4 text-sm font-medium bg-white rounded-xl border-2 outline outline-black hover:bg-gray-200 ring-4 ring-blue-600/50 text-blue-600 ";
  return (
    <div className="p-10 flex flex-col rounded-xl bg-gray-50 items-center">
      {/* Plug the variable in using curly braces! */}
      <button className={buttonStyles}>
        The Split Among People ${priceSplit.toFixed(2)}
      </button>
    </div>

  );
} 


export default function Home() {
  //MEMEORRY area
  // An array of two values
  // Use State will update the screen if values changes
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);

  const [people, setPeople] = useState([
    { 
      id: 1, // A Id to distinquish each person
      name: "Person 1", 
      items: [],
      subtotal: 0, 
      tax: 0, 
      tip: 0 
    }
  ]);

  // Function
  const addPerson = () => {
    const newPerson = {
      id: people.length + 1, // Gives them a unique ID for # of peop;le
      name: `Person ${people.length + 1}`, // ${} is to input int into string
      subtotal: 0,
      items: [],
      tax: 0,
      tip: 0
    };
    // ... spread operator to keep the old people and add the new person
    setPeople([...people, newPerson]); 
  };
  /*
  EX.
  const morningChores = ["Dishes", "Trash"];
  const eveningChores = ["Laundry"];
  const allChores = [...morningChores, "Groceries", ...eveningChores];
  // Result: ["Dishes", "Trash", "Groceries", "Laundry"]

  {} = means go back into java script when doing JSX
  */


  return (
    <MainWebsite></MainWebsite>
  );
}
