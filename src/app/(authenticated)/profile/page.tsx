"use client";
import React from 'react';
import Container from "@/components/ui/container";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {useCurrentUser} from "@/hooks/use-current-user";

const ProfilePage = () => {
    const user = useCurrentUser();

    return (
        <Container>
            <div className={"space-y-10 pb-10"}>
                <Card className={"p-4 sm:p-6 lg:p-8 rounded-lg overflow-hidden border-none shadow-none"}>
                    <CardHeader className={"p-0"}>Profil</CardHeader>
                    <CardContent>
                        <span>Nom {JSON.stringify(user)}</span>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
};

export default ProfilePage;