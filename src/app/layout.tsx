import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.relta.xyz";

export const metadata: Metadata = {
  title: "Relta — Onchain Pay Links on BASE",
  description: "Get paid onchain with a link. Create shareable payment links that accept USDC on BASE. Tip jars, pay links, and digital downloads — non-custodial.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Relta — Get paid onchain with a link",
    description: "Create shareable payment links that accept USDC on BASE. Tip jars, pay links, and digital downloads.",
    url: siteUrl,
    siteName: "Relta",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Relta — Get paid onchain with a link",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relta — Get paid onchain with a link",
    description: "Create shareable payment links that accept USDC on BASE. Tip jars, pay links, and digital downloads.",
    images: ["/og.png"],
  },
  other: {
    "base:app_id": "69d6ccf7adb751d63e3ce617",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Relta",
              url: "https://www.relta.xyz",
              description:
                "Create shareable payment links that accept USDC on BASE. Tip jars, pay links, and digital downloads.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free to create links. 1.5% platform fee on transactions.",
              },
            }),
          }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
