"use client";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaUser} from "react-icons/fa";
import {useCurrentUser} from "@/hooks/use-current-user";
import {LogoutButton} from "@/components/auth/logout-button";
import {ImExit} from "react-icons/im";
import Link from "next/link";
import {CgProfile} from "react-icons/cg";

export const UserButton = () => {
    const user = useCurrentUser()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""}/>
                    <AvatarFallback className={"bg-sky-500"}>
                        <FaUser className={"text-white"}/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-40"} align={"end"}>
                <DropdownMenuItem asChild>
                    <Link href={"/profile"}>
                        <CgProfile className={"h-4 w-4 mr-2"}/>Profil
                    </Link>
                </DropdownMenuItem>
                <LogoutButton>
                    <DropdownMenuItem>
                        <ImExit className={"h-4 w-4 mr-2"}/>Déconnexion
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}