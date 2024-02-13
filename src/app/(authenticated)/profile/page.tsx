"use client";
import React, { FormEventHandler } from "react";
import Container from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import SubmitButton from "@/components/submit-button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAvatar, uploadAvatar } from "@/actions/upload.actions";
import { useUserStore } from "@/store/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuTrash2 } from "react-icons/lu";
import { FaRegPaperPlane } from "react-icons/fa";
import { toast } from "sonner";
import { updateUser } from "@/actions/auth/user.actions";

const ProfilePage = () => {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const formSchema = z.object({
    file: z.any(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleDeleteAvatar = async () => {
    if (!user) return;

    await deleteAvatar(user.id, user.image as string);
    await updateUser(user.id, { image: null });
    setUser({ ...user, image: null });
    toast.success("Supprimé", {
      description: "Avatar supprimé avec succès.",
    });
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;

    // Taille maximale en octets (exemple : 10Mo)
    const maxSize = 10 * 1024 * 1024;

    if (file && file.size > maxSize) {
      toast.warning("Poids invalide", {
        description: "La taille du fichier doit être inférieure à 10 Mo.",
      });
      return;
    }
    if (user.image) {
      await deleteAvatar(user.id, user.image);
    }
    const url = await uploadAvatar(formData);
    await updateUser(user.id, { image: url });
    setUser({ ...user, image: url });
    toast.success("Modifié", {
      description: "Avatar modifié avec succès.",
    });
  };

  return (
    <Container>
      <div className={"space-y-10 pb-10"}>
        <Card
          className={
            "p-4 sm:p-6 lg:p-8 rounded-lg overflow-hidden border-none shadow-none"
          }
        >
          <CardHeader className={"p-0"}>Profil</CardHeader>
          <CardContent>
            <span>Nom {user?.name}</span>
          </CardContent>
          <CardContent>
            <span>{JSON.stringify(user)}</span>
          </CardContent>
        </Card>
        <h1>Téléverse ton avatar</h1>
        <div className={"flex flex-row items-center space-x-4"}>
          <form
            onSubmit={handleSubmit}
            className={"flex flex-row items-center space-x-4 flex-grow"}
          >
            <div className="flex-grow">
              <Input type={"file"} name={"file"} className={"w-full"} />
            </div>
            <SubmitButton childrenProps={"gap-x-2"}>
              <FaRegPaperPlane />
              Envoyer
            </SubmitButton>
          </form>
          <Button
            className={"gap-x-2"}
            variant={"destructive"}
            onClick={handleDeleteAvatar}
          >
            <LuTrash2 />
            Avatar actuel
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
