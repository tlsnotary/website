import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";
import { cn } from "../shared/utils";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={cn(inter.className)}>
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
