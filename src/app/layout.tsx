import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Street Food Finder & Rater",
  description:
    "Hyper-local campus street food discovery platform. Find the best vada pav near college, rated 4.8 ⭐",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
