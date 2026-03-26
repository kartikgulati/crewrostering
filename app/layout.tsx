import type { Metadata } from "next";

import { AppProviders } from "@/components/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Crew Launch Verification",
  description: "Manage product launch engagement and crew verification in quick-service restaurants.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
