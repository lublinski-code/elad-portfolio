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

const TITLE = "Elad Lublinski - Product Design Lead / Fractional Head of Product Design";
// Trimmed to ~155 chars so the positioning survives Google's snippet truncation.
const DESCRIPTION =
  "Fractional Head of Product Design. I build the design systems and AI-fluent workflows startups need, from zero-stage teams to teams scaling past ad hoc decisions.";

export const metadata: Metadata = {
  // Without this, Next resolves the OG/Twitter image against VERCEL_URL, so
  // share cards point at the .vercel.app deployment rather than the real domain.
  metadataBase: new URL("https://eladlublinski.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Elad Lublinski",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
