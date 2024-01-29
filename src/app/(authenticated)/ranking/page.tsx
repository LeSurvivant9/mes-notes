"use client"
import React from 'react';
import {UserInfo} from "@/components/user-info";
import {useCurrentUser} from "@/hooks/use-current-user";

const RankingPage = () => {
    const user = useCurrentUser()
    return (
        <UserInfo label={"Client component"} user={user}/>
    );
};

export default RankingPage;