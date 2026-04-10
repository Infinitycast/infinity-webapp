import type { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { TokenRefresher } from "@/components/core/TokenRefresher";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Inter, Bebas_Neue } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Infinity Cast (Alpha)",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebas.variable} antialiased`}>
        <SidebarProvider>
          <TokenRefresher />
          <Toaster />
          <Sonner />
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
