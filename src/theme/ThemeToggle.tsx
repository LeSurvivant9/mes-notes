"use client"
import {useTheme} from 'next-themes'
import React from 'react';
import {Button} from "@/components/ui/button";
import {LuMoon, LuSunMedium} from "react-icons/lu";

export const ThemeToggle = () => {
    const {theme, setTheme} = useTheme()
    return (
        <Button variant={"ghost"} size={"icon"} className={"mr-6"} aria-label={"Toggle Theme"} onClick={() => {
            setTheme(theme === "light" ? "dark" : "light")
        }}>
            <LuSunMedium className={"h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}/>
            <LuMoon className={"absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}/>
            <span className={"sr-only"}>Toggle Theme</span>
        </Button>
    );
};