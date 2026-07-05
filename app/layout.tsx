import type { Metadata, Viewport } from "next";
import { Inter, Prompt, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const prompt = Prompt({ weight: ["400", "500", "600", "700"], subsets: ["thai", "latin"], variable: "--font-prompt" });

export const metadata: Metadata = {
  title: "What is this animal?",
  description:
    "Identify any animal instantly using Google Gemini AI. Upload a photo to get species details, conservation status, habitat, and fascinating facts.",
  keywords: [
    "animal identifier",
    "AI animal recognition",
    "species identification",
    "wildlife",
    "Gemini AI",
  ],
  authors: [{ name: "Species Identifier" }],
  openGraph: {
    title: "What is this animal?",
    description:
      "Identify any animal instantly using Google Gemini AI. Upload a photo to get species details, conservation status, habitat, and fascinating facts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${prompt.variable}`}>
      <body>{children}</body>
    </html>
  );
}
