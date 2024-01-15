"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaUser} from "react-icons/fa";
import {LogoutButton} from "@/components/auth/logout-button";
import {ImExit} from "react-icons/im";
import Link from "next/link";
import {CgProfile} from "react-icons/cg";

const ProfileButton = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={"https://github.com/shadcn.png"}/>
                    <AvatarFallback><FaUser/></AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className={"cursor-pointer"} asChild>
                    <Link href={"/profile"}>
                        <CgProfile className={"h-4 w-4 mr-2"}/>Profil
                    </Link>
                </DropdownMenuItem>
                <LogoutButton>
                    <DropdownMenuItem className={"cursor-pointer"}>
                        <ImExit className={"h-4 w-4 mr-2"}/>Déconnexion
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default ProfileButton;