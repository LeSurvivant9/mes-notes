"use client";
import Link from "next/link";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LuMenu } from "react-icons/lu";
import ProfileButton from "@/components/ui/profile-button";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    href: "/",
    label: "Accueil",
  },
  {
    href: "/grades",
    label: "Notes",
  },
  {
    href: "/ranking",
    label: "Classement",
  },
  {
    href: "/admin",
    label: "Admin",
  },
];

export const Navbar = () => {
  return (
    <header className={"sm:flex sm:justify-between py-3 px-4 border-b"}>
      <Container>
        <div
          className={
            "relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full"
          }
        >
          <div className={"flex items-center"}>
            <Sheet>
              <SheetTrigger>
                <LuMenu className={"h-6 w-6 md:hidden"} />
              </SheetTrigger>
              <SheetContent side={"left"} className={"w-[200px]"}>
                <nav className={"flex flex-col gap-4"}>
                  {routes.map((route, i) => (
                    <Link
                      key={i}
                      href={route.href}
                      className={"text-sm font-medium transition-colors"}
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href={"/"} className={"ml-4 lg:ml-0"}>
              <h1>Mes Notes</h1>
            </Link>
          </div>
          <nav
            className={
              "mx-6 flex items-center space-x-6 lg:space-x-6 hidden md:block"
            }
          >
            {routes.map((route, i) => (
              <Button key={i} variant={"ghost"} asChild>
                <Link
                  key={i}
                  href={route.href}
                  className={"text-sm font-medium transition-colors"}
                >
                  {route.label}
                </Link>
              </Button>
            ))}
          </nav>
          <div className={"flex items-center"}>
            <ThemeToggle />
            <ProfileButton />
          </div>
        </div>
      </Container>
    </header>
  );
};
