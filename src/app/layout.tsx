import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aztec Number System",
  description: "A web-based tool that converts decimal numbers into Aztec numerals using images, providing a visual representation and allowing users to copy the converted text as HTML.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
