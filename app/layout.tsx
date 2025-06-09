import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@xyflow/react/dist/style.css";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "FryChic",
  description: "An AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased overflow-hidden`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
