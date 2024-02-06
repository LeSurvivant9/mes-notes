"use client";
import {
  createDepartment,
  updateDepartment,
} from "@/actions/admin/department.actions";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import SubmitButton from "@/components/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DepartmentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fetchDepartments } from "@/data/get-all-datas";
import { useDepartmentStore } from "@/store/use-department";
import { v4 as uuidv4 } from "uuid";

const DepartmentForm = ({
  mod,
  departmentId,
}: {
  mod: "create" | "update";
  departmentId?: string;
}) => {
  const { setDepartments } = useDepartmentStore((state) => state);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DepartmentSchema>>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof DepartmentSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      if (mod === "create") {
        createDepartment(values).then(async (data) => {
          setSuccess(data.success);
          setError(data.error);
          await fetchDepartments();
          form.reset();
        });
      } else {
        updateDepartment(departmentId as string, values).then(async (data) => {
          setSuccess(data.success);
          setError(data.error);
          await fetchDepartments();
          form.reset();
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
        <div className={"space-y-4"}>
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du département</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={"Sciences Humaines pour l'Ingénieur"}
                    type={"text"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <SubmitButton isPending={isPending}>
          Ajouter un département
        </SubmitButton>
      </form>
    </Form>
  );
};

export default DepartmentForm;
