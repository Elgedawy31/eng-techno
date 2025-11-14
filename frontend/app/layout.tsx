import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google";
import "./globals.css";
import { CoreProviders } from "./providers";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eng-techno.vercel.app/"),
  title: "Techno International Group | Global Leaders in Defense & Security Solutions",
  description:
    "Techno International Group is a premier provider of defense and security solutions, dedicated to enhancing national security and operational readiness across the globe. Empowering nations with cutting-edge equipment, advanced technology, and trusted expertise.",
  keywords: [
    "Techno International Group",
    "Defense Solutions",
    "Security Solutions",
    "Military Equipment",
    "Defense Technology",
    "Armed Forces",
    "Law Enforcement",
    "Government Institutions",
    "National Security",
    "Operational Readiness",
    "Defense & Security",
    "Military Technology",
  ],
  authors: [{ name: "Techno International Group", url: "https://eng-techno.vercel.app/" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://eng-techno.vercel.app/",
    languages: {
      "en": "https://eng-techno.vercel.app/",
      "ar": "https://eng-techno.vercel.app/ar",
    },
  },
  openGraph: {
    title: "Techno International Group | Global Leaders in Defense & Security Solutions",
    description:
      "Empowering nations with cutting-edge equipment, advanced technology, and trusted expertise. Premier provider of defense and security solutions with decades of experience and a network of over 4,000 experts.",
    url: "https://eng-techno.vercel.app/",
    type: "website",
    siteName: "Techno International Group",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Techno International Group Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Techno International Group | Defense & Security Solutions",
    description:
      "Global leaders in defense and security solutions. Empowering nations with cutting-edge equipment and trusted expertise.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${oswald.variable} ${manrope.variable} font-sans antialiased`}
      >
        <CoreProviders>{children}</CoreProviders>
      </body>
    </html>
  );
}
