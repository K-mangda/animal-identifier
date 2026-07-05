import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Species Identifier — AI Analysis",
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
    title: "Species Identifier — AI Analysis",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
