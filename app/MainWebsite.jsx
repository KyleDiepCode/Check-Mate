

import { useState } from "react";
import TitleAndButtons from "./Components/FrontPage"
import ManualInputPage from "./Components/Manual"
import Results from "./Components/ResultPage.jsx"



/*

Finished:
* Get a color set for each person // can do later. ✔
* set up a flex-wrap inside item box so when selected the color shows✔
* Add color to each person ✔
* when click on the item add the color ✔
* Getting to when you create an item it sets it into the text box✔
* Calculate Button will send to a seperate page ✔
*  Getting page change to work ✔
*  Sending the Name and Value to the result page ✔  







Big Task list:
* Each Person with the item under them and the breakdown tip etc
* Style it so mobile doesnt look atrotious
* do the parsing part for the reciept

Current Task:  

    sub task:
    * Caluclate the tax and tip✔
    * Create a section in Manual for total, tax amount, tip amount✔
    * Apply the tax to each person via how much they spent ✔
    * Check if the added amount adds up to the subtotal 
    * Have a verification to check th emoney adds up
    * If it doesnt have an error or a pop up saying its not all asigned


Maybe:
* Have a way for the person to choose a color // maybe come back to this 
* Person can choose name
* Keep in mind mobile will raise up the keyboard so might take out focus for mobile
* Mobile styling is kind of wrack
*/



export default function WebPage() {
    const [CurrentPage, pageSwap] = useState("Title Page")
    const [results, changeResults] = useState([])
    const colors = ["#8EB1C7", "#FFEB0A", "#EFAB57", "#5A5379", "#C51B29"]

    const [total, setTotal] = useState(0)
    const [tax, setTax] = useState(0)
    const [tip, setTip] = useState(0)
    const [items, setItem] = useState([
        { id: 1, name: "Item 1", price: 0 }
    ])
    const [people, setPeople] = useState([
        { id: 1, name: "Person 1", items: [], color: colors[0] }
    ])
    
    return(
        <div>
            {CurrentPage == "Title Page" && <TitleAndButtons pageSwap = {pageSwap} />}
            {CurrentPage == "Manual Page" && 
            <ManualInputPage 
            pageSwap = {pageSwap} 
            changeResults={changeResults}
            total={total} setTotal={setTotal}
            tax={tax} setTax={setTax}
            tip={tip} setTip={setTip}
            items={items} setItem={setItem}
            people={people} setPeople={setPeople}
            colors={colors}/>
            }
            {CurrentPage == "Results Page" && <Results pageSwap = {pageSwap} results = {results}/>}
        </div>
    )


}