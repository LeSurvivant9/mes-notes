"use client";
import { addSubject } from "@/actions/add-admin-function";
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
import { SubjectSchema } from "@/schemas";
import { departmentStore } from "@/store/admin-store";
import { subjectStore } from "@/store/subject-store";
import { teachingUnitStore } from "@/store/teaching-unit-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, Subject, TeachingUnit } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const SubjectForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [semester, setSemester] = useState("0");
  const [departmentId, setDepartmentId] = useState("0");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTeachingUnit, setSelectedTeachingUnit] = useState("");
  const [filteredTeachingUnits, setFilteredTeachingUnits] =
    useState<TeachingUnit[]>();
  const [isPending, startTransition] = useTransition();
  const departments = departmentStore<Department[]>(
    (state: any) => state.departments
  );
  const teachingUnits = teachingUnitStore<TeachingUnit[]>(
    (state: any) => state.teachingUnits
  );
  const fetchSubjects = subjectStore((state: any) => state.fetchSubjects);

  const form = useForm<Subject>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      subjectName: "",
    },
  });

  const sortedTeachingUnits = (
    subjectSemester: string,
    departmentId: string
  ) => {
    setSemester(subjectSemester);
    setDepartmentId(departmentId);
    const filteredTeachingUnits = teachingUnits.filter(
      (teachingUnit) =>
        teachingUnit.semester === Number(subjectSemester) &&
        teachingUnit.departmentId === Number(departmentId)
    );
    setFilteredTeachingUnits(filteredTeachingUnits);
  };

  const onSubmit = (values: Subject) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      addSubject(values).then((data) => {
        if (data?.success) {
          // setSelectedDepartment("");
          setSelectedTeachingUnit("");
          setSuccess(data?.success);
          form.reset();
          fetchSubjects();
        } else {
          setError(data?.error);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
        <div className={"space-y-4"}>
          <FormField
            control={form.control}
            name={"subjectName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la matière</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"Analyse"}
                    type={"text"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"subjectCoefficient"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coefficient</FormLabel>
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
            name={"department_id"}
            render={() => (
              <FormItem>
                <FormLabel>Département rattaché</FormLabel>
                <Select
                  value={selectedDepartment}
                  disabled={isPending}
                  onValueChange={(val) => {
                    sortedTeachingUnits(semester, val);
                    setSelectedDepartment(val);
                  }}
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
            name={"semester"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semestre</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"1"}
                    type={"text"}
                    value={field.value}
                    onChange={(e) =>
                      sortedTeachingUnits(e.target.value, departmentId)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"teachingUnitId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unité d&apos;enseignement rattachée</FormLabel>
                <Select
                  value={selectedTeachingUnit}
                  disabled={isPending}
                  onValueChange={(val) => {
                    field.onChange(parseInt(val, 10));
                    setSelectedTeachingUnit(val);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredTeachingUnits?.map((teachingUnit) => (
                      <SelectItem
                        key={teachingUnit.id}
                        value={`${teachingUnit.id}`}
                      >
                        {teachingUnit.teachingUnitName}
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
        <SubmitButton isPending={isPending}>Ajouter une matière</SubmitButton>
      </form>
    </Form>
  );
};

export default SubjectForm;
