"use client";

import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {VscGraph} from "react-icons/vsc";
import {CgProfile} from "react-icons/cg";
import {MdOutlineAdminPanelSettings} from "react-icons/md";
import Link from "next/link";
import {UserButton} from "@/components/auth/user-button";

export const Navbar = () => {
    const pathname = usePathname();


    return (
        <nav className={"relative w-full bg-secondary flex justify-between items-center py-4 px-10 shadow-md"}>
            <div className={"flex gap-x-10"}>
                <Button variant={pathname === "/grades" ? "default" : "link"} asChild>
                    <Link href={"/grades"}>
                        <VscGraph className={"h-4 w-4 mr-2"}/>Notes
                    </Link>
                </Button>

                <Button variant={pathname === "/admin" ? "default" : "link"} asChild>
                    <Link href={"/admin"}>
                        <CgProfile className={"h-4 w-4 mr-2"}/>Admin
                    </Link>
                </Button>
                <Button variant={pathname === "/settings" ? "default" : "link"} asChild>
                    <Link href={"/settings"}>
                        <MdOutlineAdminPanelSettings className={"h-4 w-4 mr-2"}/>Settings
                    </Link>
                </Button>
            </div>
            <UserButton/>
        </nav>
    )
}