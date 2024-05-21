import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AI } from "./api/action";
import { BackButton } from "@/components/back-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <AI>
            <div className="mb-4">
              <BackButton />
            </div>
            <div>{children}</div>
          </AI>
        </div>
      </body>
    </html>
  );
}
