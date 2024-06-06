import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "TLSNotary",
  description: "Proof of data authenticity",
  openGraph: {
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 800,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${sans.variable} font-inter`}>
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
