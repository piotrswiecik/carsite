import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/nav/Navbar";
import ToastProvider from "@/app/providers/ToastProvider";
import SignalRProvider from "@/app/providers/SignalRProvider";
import {getCurrentUser} from "@/app/actions/authActions";

export const metadata: Metadata = {
  title: "CarSite",
  description: "Microservices FTW",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <Navbar />
        <main className="container mx-auto px-5 pt-10">
          <SignalRProvider user={user}>
            {children}
          </SignalRProvider>
        </main>
      </body>
    </html>
  );
}
