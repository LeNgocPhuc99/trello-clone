import Model from "@/components/Modal";
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Trello Clone",
  description: "Trello Clone with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-[#F5F6F8]" suppressHydrationWarning={true}>
        {children}
        <Model />
      </body>
    </html>
  );
}
