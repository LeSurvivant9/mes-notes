import {ThemeProvider} from "@/theme/ThemeProvider";
import {Navbar} from "@/app/(connected)/_components/navbar";

export default function Home() {
    return (
        <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
            <Navbar/>
            <div>
                Contenu à venir
            </div>
        </ThemeProvider>
    )
}
