"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import Container from "@/components/ui/container";
import { ThemeProvider } from "@/theme/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      <Container>
        <main className={"pt-17"}>
          <h1 className={"pt-4 text-center"}>
            Bonjour à toi INSAïen INSAïenne :)
          </h1>
          <br />
          <p>
            Ce site à pour seul but de regrouper toutes tes notes dans un seul
            et même endroit, il te permet aussi de calculer automatiquement tes
            moyennes grâce aux différents coefficients du syllabus.
          </p>
          <br />
          <p>
            Ce site est toujours en construction, je taffe dessus depuis déjà 2
            mois pour vous sortir quelque chose de qualitatif, aujourd'hui c'est
            la release v1.4, et j'ai déjà prévu une v5.0, le site est et sera en
            constante évolution. De plus, si tu as des idées d'améliorations,
            n'hésites surtout pas à venir me voir en pv Insta, je suis ouvert à
            la discussion.
          </p>
          <br />
          <p>
            L'ajout des notes n'est pas encore automatisé, donc si tu vois qu'il
            manque certaines notes, n'hésites pas à m'en faire part.
          </p>
        </main>
      </Container>
    </ThemeProvider>
  );
}
