import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/nav/Navbar";

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
        <Navbar />
        <main className="container mx-auto px-5 pt-10">{children}</main>
      </body>
    </html>
  );
}
