import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { clsx } from "clsx";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import React from "react";
import "./globals.css";
import { QueryClient } from "@tanstack/react-query";
import Providers from "@/app/provider";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: "Mes Notes",
  description:
    "Application créé par Alexandre, gestionnaire de notes pour les étudiants de l'INSA Hauts-de-France.",
};

const queryClient = new QueryClient();
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="fr">
        <body className={clsx(poppins.className, "w-full h-full break-words")}>
          <Toaster />
          {children}
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  );
}
