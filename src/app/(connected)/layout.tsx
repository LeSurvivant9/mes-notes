"use client";
import React from "react";
import {Navbar} from "@/app/(connected)/_components/navbar";
import {ThemeProvider} from "@/theme/ThemeProvider";

interface ConnectedLayoutProps {
    children: React.ReactNode;
}

const ConnectedLayout = ({children}: ConnectedLayoutProps) => {
    return (
        <div>
            <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
                <Navbar/>
                {children}
            </ThemeProvider>
        </div>
    )
}

export default ConnectedLayout;