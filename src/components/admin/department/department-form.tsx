import { addDepartment } from "@/actions/add-admin-function";
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
const DepartmentForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DepartmentSchema>>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      departmentName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof DepartmentSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      addDepartment(values).then((data) => {
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
            name={"department_name"}
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
