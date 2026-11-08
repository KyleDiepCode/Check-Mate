import type { Metadata, Viewport } from "next";
import { Geist, Concert_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const concertOne = Concert_One({
  variable: "--font-concert-one",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Check-Mate — Split the bill",
  description: "Scan a receipt, tap who had what, and see exactly what everyone owes — tax and tip included.",
};

// Lets the bottom bar sit clear of the iPhone home indicator, and tints the browser bar sage
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#D9E6C6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${concertOne.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
