'use client'
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "../components/ui/toaster";
import { BrowserRouter } from "react-router-dom";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    // <BrowserRouter>

    <ClerkProvider>

      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
      
          {children}
          <Toaster />

        </body>
      </html>
    </ClerkProvider>
    // </BrowserRouter>

  );
}
