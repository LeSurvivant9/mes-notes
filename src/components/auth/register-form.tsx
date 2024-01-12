"use client"
import React, {useState, useTransition} from 'react';
import {CardWrapper} from "@/components/auth/card-wrapper";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {RegisterSchema} from "@/schemas";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {register} from "@/actions/register";

export const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            last_name: "",
            first_name: "",
            student_number: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                });
        });
    }

    return (
        <CardWrapper headerLabel={"Create an account"}
                     backButtonLabel={"Already have an account?"}
                     backButtonHref={"/auth/login"}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={"space-y-6"}>
                    <div className={"space-y-4"}>
                        <FormField
                            control={form.control}
                            name={"last_name"}
                            render={({field}) => (<FormItem>
                                <FormLabel>Nom de famille</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder={"Doe"}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name={"first_name"}
                            render={({field}) => (<FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder={"John"}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name={"student_number"}
                            render={({field}) => (<FormItem>
                                <FormLabel>Numéro étudiant</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder={"12345678"}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name={"email"}
                            render={({field}) => (<FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder={"jonh.doe@example.com"}
                                           type={"email"}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name={"password"}
                            render={({field}) => (<FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} {...field} placeholder={"********"} type={"password"}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} type={"submit"} className={"w-full"}>
                        Inscription
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};