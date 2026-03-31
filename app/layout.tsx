import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Camping Slap Af",
  description: "Campingplads i Sejerslev, Mors — Camping Slap Af",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="min-h-svh antialiased">{children}</body>
    </html>
  );
}
