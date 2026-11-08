# Check-Mate

A receipt-splitting web app that takes the math out of group dining. Scan a receipt with AI or enter items manually, assign food to people, and get a clean breakdown of what everyone owes — including proportional tax and tip.

<!-- Add your Vercel URL here once deployed: **[Live Site](https://your-app.vercel.app)** -->

---

## Features

- **AI Receipt Scanning** — photograph one or more receipt pages and Google Gemini parses them into items and prices (photos are compressed in the browser first)
- **Manual Entry** — add and remove items by hand with auto-focus on new fields
- **People Management** — unique color per person, rename inline, remove anyone with the × on their card
- **Click-to-Assign** — select a person and tap items to toggle assignment; shared items split evenly
- **Tax & Tip Splitting** — each person's tax and tip share scales with what they ordered; quick 15/18/20% tip buttons
- **Penny-Perfect Math** — everything is calculated in whole cents, so everyone's totals add up exactly to the bill
- **Receipt-Style Results** — a card per person, plus a "Copy" button for pasting the split into a group chat
- **Venmo Pay Links** — pick who paid and enter their Venmo username; everyone else gets a "Pay on Venmo" button (and a link in the copied summary) with their amount filled in, plus a "Mark as paid" checkbox
- **Remembers Your Work** — saved in your browser, so a refresh doesn't lose anything
- **Mobile Friendly** — scrollable people bar, dynamic viewport height, keyboard and screen-reader support

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 |
| UI | React 19, Tailwind CSS 4 |
| AI | Google Gemini (`gemini-3.1-flash-lite`) |
| Tests | Vitest |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/)

### Installation

```bash
git clone https://github.com/KyleDiepCode/Receipt-Splitter.git
cd Receipt-Splitter
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and add your key:

```
GEMINI_API_KEY=your_api_key_here
```

### Commands

```bash
npm run dev     # start the dev server at http://localhost:3000
npm test        # run the unit tests
npm run lint    # check code style
npm run build   # production build
```

---

## How It Works

1. **Scan or enter** your receipt items
2. **Add people** to the bill
3. **Select a person** and tap items to assign them — shared items split automatically
4. **Enter the tax and tip** (the receipt subtotal is optional and only used to catch misread prices)
5. **Hit Calculate** to see each person's itemized breakdown

---

## Project Structure

```
app/
├── api/
│   └── parse-receipt/
│       └── route.js          # Server-side Gemini call (validation, rate limit, JSON schema)
├── Components/
│   ├── FrontPage.jsx         # Landing page + receipt scanning
│   ├── Header.jsx            # Top bar with Back button
│   ├── Manual.jsx            # Main split page
│   ├── ItemBar.jsx           # One item row
│   ├── Person.jsx            # Person card in the bottom bar
│   ├── ResultPage.jsx        # Results layout + copy summary
│   └── PersonResultCube.jsx  # Per-person receipt card
├── lib/
│   ├── split.js              # All money math (in cents)
│   ├── split.test.js         # Tests for the math and reducer
│   ├── receiptReducer.js     # Every change to the receipt data
│   ├── venmo.js              # Venmo pay links (+ venmo.test.js)
│   ├── colors.js             # Person colors + readable text color
│   └── image.js              # Shrinks photos before upload
└── MainWebsite.jsx           # Holds state, saves it, switches pages
```

---

## Security

The Gemini API key is stored as a server-side environment variable and only used inside the API route — it is never sent to the browser. The route checks image size and type and has a simple per-IP rate limit (in-memory, so on Vercel each server instance counts separately; use Upstash or Vercel KV for a strict limit).
