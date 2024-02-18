"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import React, { useEffect } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ImExit } from "react-icons/im";
import { useUserStore } from "@/store/use-user";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { UserSchema } from "@/schemas";

const ProfileButton = () => {
  const { data: session } = useSession();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as z.infer<typeof UserSchema>);
    }
  }, [user, session, setUser]);

  const diceBearAvatarUrl = `https://api.dicebear.com/7.x/big-smile/svg?seed=${user?.email}`;

  const finalImage = user?.image ?? diceBearAvatarUrl;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className={"flex flex-row items-center"}>
          <Avatar>
            <AvatarImage src={finalImage} />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
          {user?.name ?? ""}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={"cursor-pointer"} asChild>
          <Link href={"/profile"}>
            <CgProfile className={"h-4 w-4 mr-2"} />
            Profil
          </Link>
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className={"cursor-pointer"}>
            <ImExit className={"h-4 w-4 mr-2"} />
            Déconnexion
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
