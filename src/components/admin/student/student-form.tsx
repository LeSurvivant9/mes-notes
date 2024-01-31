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
import { departmentStore } from "@/store/admin-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department } from "@prisma/client";
import Papa from "papaparse";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StudentPreviewModal from "./student-preview-modal";

const StudentForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewStudents, setPreviewStudents] = useState<unknown[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const departments = departmentStore<Department[]>(
    (state: any) => state.departments
  );

  const formSchema = z.object({
    file: z.any(),
    department_id: z.string(),
    level: z.number(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: 0,
    },
  });

  const updateIsPending = (value: boolean) => {
    setIsPending(value);
  };

  const upload = (event: any) => {
    const { file, department_id, level } = event;

    if (!file) {
      return null;
    }

    setIsPending(true);

    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      complete: function (result) {
        setSelectedLevel(level);
        setSelectedDepartment(department_id);
        setPreviewStudents(result.data);
        setIsPreviewDialogOpen(true);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(upload)} className={"space-y-6"}>
        <div className={"space-y-4"}>
          <FormField
            control={form.control}
            name={"department_id"}
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
                        {department.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"level"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau d&apos;étude</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"1"}
                    type={"number"}
                    value={field.value}
                    defaultValue={field.value}
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
            name={"file"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semestre</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    accept=".csv"
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <SubmitButton childrenProps={"w-full"} isPending={isPending}>
          Prévisualiser pour upload
        </SubmitButton>
      </form>
      <StudentPreviewModal
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
        onError={(error) => setError(error)}
        onSuccess={(success) => setSuccess(success)}
        setIsPending={updateIsPending}
        students={previewStudents}
        level={Number(selectedLevel)}
        departmentId={Number(selectedDepartment)}
      />
    </Form>
  );
};

export default StudentForm;
