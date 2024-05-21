import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AI } from "./api/action";
import { BackButton } from "@/components/back-button";
import icon from "@/../public/icon-fn.png"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FANDOM - Chatbot",
  description: "By KSRX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        <link rel="icon" href={icon.src} />

      </head>
      <body className={inter.className}>
        <div>
          <ClerkProvider>
            <AI>
              <div className="mb-4">
                <BackButton />
              </div>
              <div>{children}</div>
            </AI>
          </ClerkProvider>
        </div>
      </body>
    </html>
  );
}
