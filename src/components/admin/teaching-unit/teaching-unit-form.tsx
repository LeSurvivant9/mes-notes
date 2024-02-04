"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDepartmentStore } from "@/store/use-department";
import { fetchTeachingUnits } from "@/data/get-all-datas";
import {
  createTeachingUnit,
  updateTeachingUnit,
} from "@/actions/admin/teaching-unit.actions";
import { v4 as uuidv4 } from "uuid";

const TeachingUnitForm = ({
  mod,
  teachingUnitId,
}: {
  mod: "create" | "update";
  teachingUnitId?: string;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const departments = useDepartmentStore((state) => state.departments);

  const form = useForm<z.infer<typeof TeachingUnitSchema>>({
    resolver: zodResolver(TeachingUnitSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
      semester: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof TeachingUnitSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      if (mod === "create") {
        createTeachingUnit(values).then((data) => {
          fetchTeachingUnits();
          setError(data.error);
          setSuccess(data.success);
          form.reset();
        });
      } else {
        updateTeachingUnit(teachingUnitId as string, values).then((data) => {
          fetchTeachingUnits();
          setError(data.error);
          setSuccess(data.success);
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
                <FormLabel>Nom de l'unité d'enseignement</FormLabel>
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
                    placeholder={"Semestre"}
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
            name={"departmentId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Département rattaché</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                        {department.name}
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
          Ajouter une unité d'enseignement
        </SubmitButton>
      </form>
    </Form>
  );
};
export default TeachingUnitForm;
