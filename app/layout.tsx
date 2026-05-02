import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/providers";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrewRostering | Realtime Operations Intelligence",
  description: "Coordinate live operations with fast, reliable, AI-assisted interaction workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
