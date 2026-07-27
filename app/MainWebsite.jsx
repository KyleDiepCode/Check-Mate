

import { useState, useRef } from "react";
import TitleAndButtons from "./Components/FrontPage"
import ManualInputPage from "./Components/Manual"
import Results from "./Components/ResultPage.jsx"
import ScanPage from "./Components/ScanRecieptPage"



/*

Finished:
* Color set for each person ✔
* Flex-wrap inside item box so when selected the color shows ✔
* Add color to each person ✔
* When click on the item add the color ✔
* When you create an item it focuses the text box ✔
* Calculate button sends to results page ✔
* Page navigation works ✔
* Sending name and value to result page ✔
* Calculate tax and tip per person ✔
* Total / tax / tip input section ✔
* Verify all items assigned before calculating ✔
* Back buttons on Manual and Results pages ✔
* State lifted to MainWebsite so nav back keeps data ✔
* Remove item (cleans up person assignments too) ✔
* Remove person ✔
* Editable person names (click to edit, auto-selects text) ✔
* Receipt scanning via Gemini API ✔
* Pre-populate Manual page from scanned receipt ✔
* ID counter fix using Math.max so no duplicate keys after delete ✔

Current Task:
* Fix rounding — convert all prices to cents (integers) internally,
  divide by 100 only at display time (option 3)
* Penny adjustment for last person so totals always add up exactly (option 2)

Up Next:
* HTML/CSS polish — receipt-style PersonResultCube, mobile layout
* Show unassigned total on Manual page so user knows whats left to assign
* Handle edge case: what if Gemini misreads a price

Big Tasks (later):
* Mobile styling polish
* Deploy to Vercel

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
            {CurrentPage == "Title Page" && <TitleAndButtons pageSwap = {pageSwap} setItem={setItem} setTotal={setTotal} setTax={setTax} setTip={setTip} />}

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
            {CurrentPage == "Results Page" && <Results pageSwap = {pageSwap} results = {results}/>}
        </div>
    )


}