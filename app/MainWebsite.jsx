

import { useState, useRef } from "react";
import TitleAndButtons from "./Components/FrontPage"
import ManualInputPage from "./Components/Manual"
import Results from "./Components/ResultPage.jsx"
import ScanPage from "./Components/ScanRecieptPage"



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

    const [total, setTotal] = useState("")
    const [tax, setTax] = useState("")
    const [tip, setTip] = useState("")
    const [items, setItem] = useState([
        { id: 1, name: "", price: 0 }
    ])
    const [people, setPeople] = useState([
        { id: 1, name: "Person 1", items: [], color: colors[0] }
    ])
    
    return(
        <div>
            {CurrentPage == "Title Page" && 
            <TitleAndButtons 
            pageSwap = {pageSwap} 
            setItem={setItem} 
            setTotal={setTotal}
            setTax={setTax}
            setTip={setTip}
            />}

            {CurrentPage == "Manual Page" && 
            <ManualInputPage 
            pageSwap = {pageSwap} 
            changeResults={changeResults}
            total={total} setTotal={setTotal}
            tax={tax} setTax={setTax}
            tip={tip} setTip={setTip}
            items={items} setItem={setItem}
            people={people} setPeople={setPeople}
            colors={colors}
            />
            
            }
            {CurrentPage == "Scan Page" && 
            <ScanPage 
            pageSwap= {pageSwap}
            changeResults={changeResults}
            total={total} setTotal={setTotal}
            tax={tax} setTax={setTax}
            tip={tip} setTip={setTip}
            items={items} setItem={setItem}
            people={people} setPeople={setPeople}
            colors={colors}
            />
        }
            {CurrentPage == "Results Page" && 
            <Results 
            pageSwap = {pageSwap} 
            results = {results} 
            />}
        </div>
    )


}