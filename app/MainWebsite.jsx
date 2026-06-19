

import { useState } from "react";
import Splitter from "./Components/PersonItemSplit";
import TitleAndButtons from "./Components/FrontPage"
import ManualInputPage from "./Components/Manual"



/*

Finished:
* Get a color set for each person // can do later. ✔
* set up a flex-wrap inside item box so when selected the color shows✔
* Add color to each person ✔
* when click on the item add the color ✔
* Getting to when you create an item it sets it into the text box✔



Big Task list:
* Calculate Button will send to a seperate page
* Each Person with the item under them and the breakdown tip etc
* Style it so mobile doesnt look atrotious
* do the parsing part for the reciept

Current Task:  Calculate Button will send to a seperate page
    sub task:
    *


Maybe:
* Have a way for the person to choose a color // maybe come back to this 
* Keep in mind mobile will raise up the keyboard so might take out focus for mobile
* Mobile styling is kind of wrack
*/



export default function WebPage() {
    const [CurrentPage, Swaping] = useState("Manual Input")
    const renderPage = () => {
        switch(CurrentPage){
            case "Title Page":
                return <TitleAndButtons/>
            case "Scanning Receipt":
                return 
            case "Manual Input":
                return <ManualInputPage/>
            case "Result":
                return
            default:
                return <TitleAndButtons/>
        }
    }
    return(
        <div>
            {renderPage()}
        </div>
    )


}