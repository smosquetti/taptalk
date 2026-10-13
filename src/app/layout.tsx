import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundContext";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TapTalk — AAC English vocabulary",
  description:
    "An Augmentative and Alternative Communication (AAC) board: tap a picture to see and hear the English word.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#FDF8EF] text-[#35302A]">
        <SoundProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
            {children}
          </main>
          <footer className="pb-6 text-center text-sm text-[#8a7f6f]">
            Tap a picture to hear its word · Built on AAC principles
          </footer>
        </SoundProvider>
      </body>
    </html>
  );
}
