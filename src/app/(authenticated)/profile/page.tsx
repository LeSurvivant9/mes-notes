import React from "react";
import ProfileComponent from "@/components/profile/profile-component";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  return <ProfileComponent session={session} />;
}
