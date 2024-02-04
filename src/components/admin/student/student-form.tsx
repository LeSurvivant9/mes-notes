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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useDepartmentStore } from "@/store/use-department";
import Papa from "papaparse";
import { z } from "zod";
import { createManyStudents } from "@/actions/admin/student.actions";
import { fetchStudents } from "@/data/get-all-datas";
import StudentPreviewModal from "@/components/admin/student/student-preview-modal";
import { StudentSchema } from "@/schemas";

const StudentForm = ({
  mod,
  studentNumber,
}: {
  mod: "create" | "update";
  studentNumber?: string;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isPreview, setIsPreview] = useState(false);
  const [students, setStudents] = useState<z.infer<typeof StudentSchema>[]>([]);
  const departments = useDepartmentStore((state) => state.departments);

  const formSchema = z.object({
    level: z.number().int().positive(),
    departmentId: z
      .string()
      .min(1, { message: "Veuillez sélectionner un département" }),
    files: z.instanceof(FileList).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: 1,
      departmentId: "",
    },
  });
  const { register } = form;

  type ResultDataType = {
    Code: string;
    Nom: string;
    Prenom: string;
  };

  const uploadStudents = (students: z.infer<typeof StudentSchema>[]) => {
    startTransition(async () => {
      const response = await createManyStudents(students);
      setSuccess(response.success);
      setError(response.error);
      await fetchStudents();
    });
  };
  const upload = (values: z.infer<typeof formSchema>) => {
    setSuccess("");
    setError("");
    const { files } = values;

    if (!files || files.length === 0) {
      setError("Aucun fichier sélectionné");
      return;
    }

    if (files[0].type !== "text/csv") {
      setError("Le fichier doit être au format CSV");
      return;
    }
    startTransition(() => {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (result) {
          const resultData: ResultDataType[] = result.data as ResultDataType[];
          const data = resultData.map((student) => {
            return {
              studentNumber: student.Code,
              lastName: student.Nom,
              firstName: student.Prenom,
              departmentId: values.departmentId,
              level: values.level,
            };
          });
          setStudents(data);
          setIsPreview(true);
        },
        error: function (error) {
          console.error(error);
          setError("Erreur lors du chargement du fichier");
        },
      });
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(upload)} className={"space-y-6"}>
          <div className={"space-y-4"}>
            <FormField
              control={form.control}
              name={"departmentId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département rattaché</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange}>
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
            <FormField
              control={form.control}
              name={"level"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'étude</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder={"Niveau d'étude"}
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
              name={"files"}
              render={() => (
                <FormItem>
                  <FormLabel>Fichier CSV</FormLabel>
                  <FormControl>
                    <Input
                      {...register("files")}
                      disabled={isPending}
                      type={"file"}
                      accept={".csv"}
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
      </Form>
      <StudentPreviewModal
        isOpen={isPreview}
        students={students}
        onSuccess={() => uploadStudents(students)}
        onClose={() => setIsPreview(false)}
      />
    </>
  );
};

export default StudentForm;
