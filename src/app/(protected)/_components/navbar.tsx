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
        <nav className={"absolute top-2 bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-md"}>
            <div className={"flex gap-x-2"}>
                <Button variant={pathname === "/client" ? "default" : "outline"} asChild>
                    <Link href={"/grades"}>
                        <VscGraph/>Notes
                    </Link>
                </Button>
                <Button variant={pathname === "/server" ? "default" : "outline"} asChild>
                    <Link href={"/server"}>
                        <CgProfile/>Server
                    </Link>
                </Button>
                <Button variant={pathname === "/admin" ? "default" : "outline"} asChild>
                    <Link href={"/admin"}>
                        <CgProfile/>Admin
                    </Link>
                </Button>
                <Button variant={pathname === "/settings" ? "default" : "outline"} asChild>
                    <Link href={"/settings"}>
                        <MdOutlineAdminPanelSettings/>Settings
                    </Link>
                </Button>
            </div>
            <UserButton/>
        </nav>
    )
}