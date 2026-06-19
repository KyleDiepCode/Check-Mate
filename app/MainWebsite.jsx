

import { useState } from "react";
import Splitter from "./Components/PersonItemSplit";
import TitleAndButtons from "./Components/FrontPage"
import ManualInputPage from "./Components/Manual"

/*
 to do list:

1. Get a color set for each person // can do later
2. set up a flex-wrap inside item box so when selected the color shows
3. Add color to each person
4. Have a way for the person to choose a color
5. when click on the item add the color

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