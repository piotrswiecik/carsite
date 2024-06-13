import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/nav/Navbar";
import ToastProvider from "@/app/providers/ToastProvider";
import SignalRProvider from "@/app/providers/SignalRProvider";

export const metadata: Metadata = {
  title: "CarSite",
  description: "Microservices FTW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <Navbar />
        <main className="container mx-auto px-5 pt-10">
          <SignalRProvider>
            {children}
          </SignalRProvider>
        </main>
      </body>
    </html>
  );
}
