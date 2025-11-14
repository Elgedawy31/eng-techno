import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CoreProviders } from "./providers";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://autopower.sa/"),
  title: "أوتو باور | موزع معتمد لأفضل العلامات التجارية للسيارات في السعودية",
  description:
    "أوتو باور موزع معتمد لأفضل وأشهر العلامات التجارية للسيارات في المملكة العربية السعودية. نقدم تجربة استثنائية وخدمات مميزة لما بعد البيع لتحقيق رضا العملاء وبناء الثقة في كل تعامل.",
  keywords: [
    "أوتو باور",
    "موزع معتمد",
    "قطع غيار سيارات",
    "العلامات التجارية للسيارات",
    "خدمات ما بعد البيع",
    "سيارات السعودية",
    "قطع أصلية",
  ],
  authors: [{ name: "أوتو باور", url: "https://autopower.sa" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://autopower.sa/",
    languages: {
      "ar-SA": "https://autopower.sa/",
    },
  },
  openGraph: {
    title: "أوتو باور | موزع معتمد لأفضل العلامات التجارية للسيارات",
    description:
      "أوتو باور موزع معتمد يقدم خدمات متميزة وتجربة فريدة لعشاق السيارات في المملكة العربية السعودية.",
    url: "https://autopower.sa/",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "شعار أوتو باور",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أوتو باور | موزع معتمد للسيارات في السعودية",
    description:
      "أفضل تجربة لشراء قطع الغيار وخدمات ما بعد البيع داخل المملكة.",
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
    <html lang="ar" suppressHydrationWarning dir="rtl">
      <body
        className={`${cairo.variable} font-sans antialiased`}
      >
        <CoreProviders>{children}</CoreProviders>
      </body>
    </html>
  );
}
