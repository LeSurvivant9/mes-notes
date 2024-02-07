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
import React from "react";
import { useUserStore } from "@/store/use-user";

const ProfileButton = () => {
  const { user } = useUserStore();

  const diceBearAvatarUrl = `https://api.dicebear.com/7.x/big-smile/svg?seed=${user?.email}`;

  const finalImage = user?.image ?? diceBearAvatarUrl;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className={"flex flex-row items-center gap-x-2"}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
