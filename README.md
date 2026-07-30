# Check-Mate

A receipt-splitting web app that takes the math out of group dining. Scan a receipt with AI or enter items manually, assign food to people, and get a clean breakdown of what everyone owes — including proportional tax and tip.

**[Live Site](https://your-url.vercel.app)**

---

## Features

- **AI Receipt Scanning** — photograph a receipt and Google Gemini automatically parses it into a list of items and prices
- **Manual Entry** — add and remove items by hand with auto-focus on new fields
- **People Management** — add people with unique color coding, rename them inline, and remove them at any time
- **Click-to-Assign** — select a person and tap items to toggle assignment; items shared between multiple people are split proportionally
- **Tax & Tip Splitting** — each person's tax and tip share scales with their portion of the subtotal
- **Receipt-Style Results** — each person gets a card showing their items, subtotal, tax, tip, and grand total
- **Mobile Friendly** — scrollable people bar, dynamic viewport height, and a persistent selection banner for small screens

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 |
| UI | React 19, Tailwind CSS 4 |
| AI | Google Gemini (`gemini-3.1-flash-lite`) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/)

### Installation

```bash
git clone https://github.com/your-username/receiptsplit.git
cd receiptsplit
npm install
```

### Environment Variables

Create a `.env.local` file in the root of the project:

```
GEMINI_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. **Scan or enter** your receipt items
2. **Add people** to the bill
3. **Select a person** and tap items to assign them — shared items split automatically
4. **Enter the subtotal, tax, and tip**
5. **Hit Calculate** to see each person's itemized breakdown

---

## Project Structure

```
app/
├── api/
│   └── parse-receipt/
│       └── route.js          # Server-side Gemini API call
├── Components/
│   ├── FrontPage.jsx         # Landing / entry point
│   ├── Manual.jsx            # Main split page
│   ├── Person.jsx            # Person card in bottom bar
│   ├── ItemBar.jsx           # Individual item row
│   ├── ResultPage.jsx        # Results layout
│   └── PersonResultCube.jsx  # Per-person receipt card
└── MainWebsite.jsx           # Root with shared state and routing
```

---

## Security

The Gemini API key is stored as a server-side environment variable and accessed only inside a Next.js API route. It is never bundled into the client or exposed in the browser.
