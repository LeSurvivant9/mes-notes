"use client"
import React, {useState, useTransition} from 'react';
import {CardWrapper} from "@/components/auth/card-wrapper";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {NewPasswordSchema} from "@/schemas";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {newPassword} from "@/actions/new-password";
import {useSearchParams} from "next/navigation";

export const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");

        console.log(values);

        startTransition(() => {
            newPassword(values, token)
                .then((data) => {
                    setError(data?.error)
                    setSuccess(data?.success)
                });
        });
    }

    return (
        <CardWrapper headerLabel={"Entrez un nouveau mot de passe"}
                     backButtonLabel={"Back to login"}
                     backButtonHref={"/auth/login"}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={"space-y-6"}>
                    <div className={"space-y-4"}>
                        <FormField
                            control={form.control}
                            name={"password"}
                            render={({field}) => (<FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder={"******"}
                                           type={"password"}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} type={"submit"} className={"w-full"}>
                        Réinitialiser mot de passe
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};