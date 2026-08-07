import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/Providers";

export const metadata: Metadata = {
  title: "PowerDillo — IT Construction, Subcontracting & Equipment Rental",
  description: "PowerDillo delivers integrated solutions across IT construction, subcontracting, and equipment rental.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
