import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import RootShell from "@/components/nav/root-shell";
import InnerSideNavServer from "@/components/nav/inner-side-nav-server";
import InnerBottomNavServer from "@/components/nav/inner-bottom-nav-server";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Elad Lublinski - Product Designer",
  description:
    "AI-informed product designer with 12+ years crafting scalable systems for the creator economy, gaming, and fintech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen">
        <RootShell innerNav={<InnerSideNavServer />} innerBottomNav={<InnerBottomNavServer />}>{children}</RootShell>
        <Analytics />
      </body>
    </html>
  );
}
