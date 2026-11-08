"use client"

import dynamic from "next/dynamic"

// The app saves its data in localStorage, which only exists in the browser,
// so we skip server rendering and load it straight in the browser.
const MainWebsite = dynamic(() => import("./MainWebsite"), { ssr: false })

// Run locally with: npm run dev
export default function Home() {
  return <MainWebsite />
}
