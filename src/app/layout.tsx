import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { clsx } from "clsx";
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import React from "react";
import "./globals.css";
import Providers from "@/lib/providers";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["600"] });

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
    <SessionProvider session={session}>
      <html lang="fr" className={"h-full"}>
        <body className={clsx(rubik.className, "w-full h-full")}>
          <Toaster />
          <SpeedInsights />
          <Analytics />
          <Providers>{children}</Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
