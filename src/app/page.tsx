import {Button} from "@/components/ui/button";
import {LoginButton} from "@/components/auth/login-button";

export default function Home() {
    return (
        <main
            className={"flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800"}>
            <div className={"space-y-6 text-center"}>
                <h1 className={"text-6xl font-semibold text-white drop-shadow-md"}>
                    📊 Mes Notes
                </h1>
                <p className={"text-white text-lg"}>
                    THE gestionnaire de notes de l&apos;INSA Hauts-de-France
                </p>
                <div>
                    <LoginButton mode={"modal"} asChild>
                        <Button variant={"secondary"} size={"lg"}>
                            Identifie toi
                        </Button>
                    </LoginButton>
                </div>
            </div>
        </main>
    )
}
