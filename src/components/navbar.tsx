"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuMenu } from "react-icons/lu";
import ProfileButton from "@/components/ui/profile-button";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    href: "/grades",
    label: "Notes",
  },
];

export const Navbar = () => {
  return (
    <header className="fixed left-0 top-0 w-full py-3 px-4 border-b z-50 bg-background">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
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
          <Link href={"/"} className={"ml-4 lg:ml-0 md:hidden"}>
            <h1>Mes Notes</h1>
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1 justify-start">
          <Link href="/" className="flex items-center">
            <h1>Mes Notes</h1>
          </Link>
        </div>
        <div className="flex-1 justify-center hidden md:flex">
          {routes.map((route, i) => (
            <Button key={i} variant="ghost" asChild>
              <Link
                href={route.href}
                className="text-sm font-medium transition-colors mx-2"
              >
                {route.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex-1 justify-end hidden md:flex">
          <ThemeToggle />
          <ProfileButton />
        </div>

        <div className="flex items-center md:hidden ml-auto">
          <ThemeToggle />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};
