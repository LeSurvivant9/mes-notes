import type {Metadata} from 'next'
import {Poppins} from 'next/font/google'
import './globals.css'
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import React from "react";
import {Toaster} from "@/components/ui/sonner";

const poppins = Poppins({subsets: ['latin'], weight: ["600"]})

export const metadata: Metadata = {
    title: 'Mes Notes',
    description: 'Generated by create next app',
}

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <html lang="fr">
            <body className={poppins.className}>
            <Toaster/>
            {children}
            </body>
            </html>
        </SessionProvider>
    )
}
