import React, {useState, useTransition} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {TeachingUnitSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import SubmitButton from "@/components/submit-button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {addTeachingUnit} from "@/actions/admin";

const TeachingUnitForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof TeachingUnitSchema>>({
        resolver: zodResolver(TeachingUnitSchema),
        defaultValues: {
            teaching_unit_name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof TeachingUnitSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            addTeachingUnit(values)
                .then((data) => {
                    setError(data?.error)
                    setSuccess(data?.success)
                    form.reset()
                });
        });
    }


    return (
        <Card className={"w-full bg-background border-none"}>
            <CardHeader>
                Ajouter un département
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={"space-y-6"}>
                        <div className={"space-y-4"}>
                            <FormField
                                control={form.control}
                                name={"teaching_unit_name"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nom de l&apos;unité d&apos;enseignement</FormLabel>
                                        <FormControl>
                                            <Input disabled={isPending} {...field}
                                                   placeholder={"Mathématiques"}
                                                   type={"text"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                            />
                            <FormField
                                control={form.control}
                                name={"department_id"}
                                render={({field}) => (
                                    <FormItem>
                                        < FormLabel>Département rattaché</FormLabel>
                                        <FormControl>
                                            <Input disabled={isPending} {...field}
                                                   placeholder={"Mathématiques"}
                                                   type={"text"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <SubmitButton isPending={isPending}>
                            Ajouter un département
                        </SubmitButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
        ;
};
export default TeachingUnitForm;
