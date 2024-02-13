"use client";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { login } from "@/actions/auth/login";
import { useSearchParams } from "next/navigation";
import { FormSuccess } from "@/components/form-success";
import Link from "next/link";
import { useUserStore } from "@/store/use-user";

export const LoginForm = () => {
  const { setUser } = useUserStore();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data.error) setError(data.error);
        if (data.success) setSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={"Bon retour :)"}
      backButtonLabel={"Pas encore de compte ?"}
      backButtonHref={"/auth/register"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
          <div className={"space-y-4"}>
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder={"jonh.doe@example.com"}
                      type={"email"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder={"********"}
                      type={"password"}
                    />
                  </FormControl>
                  <Button
                    size={"sm"}
                    variant={"link"}
                    className={"px-0 font-normal"}
                    asChild
                  >
                    <Link href={"/auth/reset"}>Mot de passe oublié ?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type={"submit"} className={"w-full"}>
            Connexion
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
