import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";
import Script from "next/script";

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
      <head />
      <body className={`${inter.className} ${inter.variable} ${sans.variable} font-inter`}>
        <AppHeader />
        {children}
        <AppFooter />
        <Script id="matomo-tracking" strategy="afterInteractive">
          {`
             var _paq = window._paq = window._paq || [];
             /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
             _paq.push(['trackPageView']);
             _paq.push(['enableLinkTracking']);
             (function() {
               var u="https://psedev.matomo.cloud/";
               _paq.push(['setTrackerUrl', u+'matomo.php']);
               _paq.push(['setSiteId', '16']);
               var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
               g.async=true; g.src='//cdn.matomo.cloud/psedev.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
             })();
          `}
        </Script>
      </body>
    </html>
  );
}
