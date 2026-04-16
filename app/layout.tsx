import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Navbar from "@/components/ui/Navbar";
import { NuqsAdapter } from "nuqs/adapters/next";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceX Explorer",
  description:
    "Browse and explore all SpaceX missions. Filter, search, and bookmark your favorite launches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100 antialiased">
        <NuqsAdapter>
          <QueryProvider>
            <FavoritesProvider>
              <Navbar />
              {children}
            </FavoritesProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
