import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/lib/query-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { clsx } from "clsx";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: "Mes Notes",
  description:
    "Application créé par Alexandre, gestionnaire de notes pour les étudiants de l'INSA Hauts-de-France.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="fr">
      <body className={clsx(poppins.className, "w-full h-full break-words")}>
        <SessionProvider session={session}>{children}</SessionProvider>
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
