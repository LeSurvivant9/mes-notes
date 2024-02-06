import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { clsx } from "clsx";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";
import Providers from "@/lib/query-provider";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

export const metadata: Metadata = {
  title: "Mes Notes",
  description:
    "Application créé par Alexandre, gestionnaire de notes pour les étudiants de l'INSA Hauts-de-France.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={clsx(poppins.className, "w-full h-full break-words")}>
        <Suspense fallback={<h1>Chargement...</h1>}>
          <Providers>{children}</Providers>
        </Suspense>
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
