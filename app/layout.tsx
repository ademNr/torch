// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Torch - Profile Detection Tool",
  description: "Find people who are using Tinder or other dating apps",
  icons: [
    {
      url: "/faviconn.ico",

    },]

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={typeof window === 'undefined' ? 'server-class' : undefined} >
      <body
        className={`${inter.variable} font-inter antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}