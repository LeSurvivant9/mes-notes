"use client";
import { addTeachingUnit } from "@/actions/add-admin-function";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeachingUnitSchema } from "@/schemas";
import { departmentStore } from "@/store/admin-store";
import { teachingUnitStore } from "@/store/use-teaching-unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const TeachingUnitForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const departments = departmentStore<Department[]>(
    (state: any) => state.departments,
  );
  const fetchTeachingUnits = teachingUnitStore(
    (state: any) => state.fetchTeachingUnits,
  );

  const form = useForm<z.infer<typeof TeachingUnitSchema>>({
    resolver: zodResolver(TeachingUnitSchema),
    defaultValues: {
      teaching_unit_name: "",
      semester: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof TeachingUnitSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      addTeachingUnit(values).then((data) => {
        fetchTeachingUnits().then();
        setError(data?.error);
        setSuccess(data?.success);
        form.reset();
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
        <div className={"space-y-4"}>
          <FormField
            control={form.control}
            name={"teaching_unit_name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l&apos;unité d&apos;enseignement</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"Mathématiques"}
                    type={"text"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"semester"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semestre</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"1"}
                    type={"number"}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"department_id"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Département rattaché</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(val) => field.onChange(parseInt(val, 10))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={`${department.id}`}
                      >
                        {department.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <SubmitButton isPending={isPending}>
          Ajouter une unité d&apos;enseignement
        </SubmitButton>
      </form>
    </Form>
  );
};
export default TeachingUnitForm;
