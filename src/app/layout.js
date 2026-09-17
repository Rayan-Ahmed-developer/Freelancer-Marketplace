import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Workly - Freelance Marketplace",
  description: "Find freelance talent and build great things.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#090D16] text-white selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
        
        {/* Background Dot Grid Effect matching the image */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

        {/* Static Global Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-grow relative z-10">
          {children}
        </main>

        {/* Static Global Footer */}
        <Footer />
        
      </body>
    </html>
  );
}