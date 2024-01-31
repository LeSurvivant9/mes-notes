"use client";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      <div>Bonjour</div>
      <h1>Contenu à venir</h1>
    </ThemeProvider>
  );
}
