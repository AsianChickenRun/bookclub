import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reading Momentum",
  description: "Social reading accountability for friends reading at their own pace."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
