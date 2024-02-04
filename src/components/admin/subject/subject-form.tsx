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
import { SubjectSchema, TeachingUnitSchema } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDepartmentStore } from "@/store/use-department";
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { fetchSubjects } from "@/data/get-all-datas";
import { createSubject, updateSubject } from "@/actions/admin/subject.actions";
import { v4 as uuidv4 } from "uuid";

const SubjectForm = ({
  mod,
  subjectId,
}: {
  mod: "create" | "update";
  subjectId?: string;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [semester, setSemester] = useState(1);
  const [departmentId, setDepartmentId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredTeachingUnits, setFilteredTeachingUnits] =
    useState<z.infer<typeof TeachingUnitSchema>[]>();
  const [isPending, startTransition] = useTransition();
  const departments = useDepartmentStore((state) => state.departments);
  const teachingUnits = useTeachingUnitStore((state) => state.teachingUnits);

  const form = useForm<z.infer<typeof SubjectSchema>>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
      coefficient: 1,
      ccCoefficient: 0,
      tpCoefficient: 0,
      examCoefficient: 0,
    },
  });

  const sortedTeachingUnits = (
    subjectSemester: number,
    departmentId: string,
  ) => {
    setSemester(subjectSemester);
    setDepartmentId(departmentId);
    const filteredTeachingUnits = teachingUnits.filter(
      (teachingUnit) =>
        teachingUnit.semester === subjectSemester &&
        teachingUnit.departmentId === departmentId,
    );
    setFilteredTeachingUnits(filteredTeachingUnits);
  };

  const onSubmit = (values: any) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      values.ccCoefficient =
        values.ccCoefficient === 0 ? null : values.ccCoefficient;
      values.tpCoefficient =
        values.tpCoefficient === 0 ? null : values.tpCoefficient;
      values.examCoefficient =
        values.examCoefficient === 0 ? null : values.examCoefficient;

      if (mod === "create") {
        createSubject(values).then(async (data) => {
          setError(data.error);
          setSuccess(data.success);
          await fetchSubjects();
        });
      } else {
        updateSubject(subjectId as string, values).then(async (data) => {
          setSuccess(data.success);
          setError(data.error);
          await fetchSubjects();
        });
      }
      form.reset();
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
            name={"coefficient"}
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
            control={form.control}
            name={"ccCoefficient"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coefficient de contrôle continu</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"1"}
                    type={"number"}
                    value={field.value as number}
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
            name={"tpCoefficient"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coefficient de TP</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"1"}
                    type={"number"}
                    value={field.value as number}
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
            name={"examCoefficient"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coefficient de DS</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder={"1"}
                    type={"number"}
                    value={field.value as number}
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
            name={"departmentId"}
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
            name={"semester"}
            render={() => (
              <FormItem>
                <FormLabel>Semestre</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder={"1"}
                    type={"number"}
                    value={semester}
                    onChange={(e) =>
                      sortedTeachingUnits(
                        parseInt(e.target.value, 10),
                        departmentId,
                      )
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
                <FormLabel>Unité d'enseignement rattachée</FormLabel>
                <Select
                  value={field.value}
                  disabled={isPending}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une unité d'enseignement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredTeachingUnits?.map((teachingUnit) => (
                      <SelectItem
                        key={teachingUnit.id}
                        value={`${teachingUnit.id}`}
                      >
                        {teachingUnit.name}
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
