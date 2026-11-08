"use client"

import { useEffect, useReducer, useState } from "react"
import FrontPage from "./Components/FrontPage"
import ManualInputPage from "./Components/Manual"
import ResultsPage from "./Components/ResultPage"
import { receiptReducer, createInitialState } from "./lib/receiptReducer"

const STORAGE_KEY = "checkmate-receipt-v1"
const PAGES = ["title", "manual", "results"]

// Reads saved data from a previous visit. Returns null if there's nothing usable.
function loadSaved() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (!saved || !Array.isArray(saved.receipt?.items) || !Array.isArray(saved.receipt?.people)) return null
        return saved
    } catch {
        return null
    }
}

export default function MainWebsite() {
    // Start from whatever was saved last visit (page.tsx makes sure this runs in the browser)
    const [saved] = useState(loadSaved)
    const [page, setPage] = useState(() => (PAGES.includes(saved?.page) ? saved.page : "title"))
    const [receipt, dispatch] = useReducer(receiptReducer, saved, (s) =>
        s ? { ...createInitialState(), ...s.receipt } : createInitialState()
    )

    // Save on every change, so a refresh doesn't lose anything
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ page, receipt }))
        } catch {
            // Private mode / storage full: the app still works, it just won't remember
        }
    }, [page, receipt])

    return (
        <div>
            {page === "title" && <FrontPage setPage={setPage} dispatch={dispatch} />}
            {page === "manual" && <ManualInputPage setPage={setPage} receipt={receipt} dispatch={dispatch} />}
            {page === "results" && <ResultsPage setPage={setPage} receipt={receipt} dispatch={dispatch} />}
        </div>
    )
}
