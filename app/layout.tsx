import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "../styles/globals.scss";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Casper Juel",
  url: "https://casperjuel.dk",
  jobTitle: "Creative Developer",
  description: "Creative Developer with 13+ years of experience crafting digital experiences. Specializing in React, Next.js, motion design, and creative coding.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Copenhagen",
    addressCountry: "Denmark",
  },
  sameAs: [
    "https://github.com/casperjuel",
    "https://www.linkedin.com/in/casperjuel",
    "https://www.instagram.com/casper.juel",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Frontend Development",
    "Motion Design",
    "Creative Coding",
    "Web Development",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://casperjuel.dk"),
  title: {
    default: "Casper Juel – Creative Developer",
    template: "%s | Casper Juel",
  },
  description:
    "Creative Developer with 13+ years of experience crafting digital experiences that feel alive. Specializing in React, Next.js, motion design, and creative coding. Based in Copenhagen.",
  keywords: [
    "Creative Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js",
    "Copenhagen",
    "Motion Design",
    "Creative Coding",
    "Web Developer",
  ],
  authors: [{ name: "Casper Juel", url: "https://casperjuel.dk" }],
  creator: "Casper Juel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://casperjuel.dk",
    siteName: "Casper Juel",
    title: "Casper Juel – Creative Developer",
    description:
      "Creative Developer crafting digital experiences that feel alive. Frontend, creative coding, and motion design.",
  },
  twitter: {
    card: "summary",
    title: "Casper Juel – Creative Developer",
    description:
      "Creative Developer crafting digital experiences that feel alive. Frontend, creative coding, and motion design.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
      <GoogleTagManager gtmId="GTM-PDXMB9C" />
    </html>
  );
}
