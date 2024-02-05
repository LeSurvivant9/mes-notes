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
import { GradeSchema, SubjectSchema } from "@/schemas";
import { useSubjectStore } from "@/store/use-subject";
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { uploadPdfFile } from "@/actions/upload.actions";
import { v4 as uuidv4 } from "uuid";
import { createAssessment } from "@/actions/admin/assessment.actions";
import { createManyGrades } from "@/actions/admin/grade.actions";
import { fetchGrades } from "@/data/get-all-datas";
import GradePreviewModal from "@/components/admin/grade/grade-preview-modal";
import { useStudentStore } from "@/store/use-student";

export type GradeDataType = {
  studentNumber: string;
  value: number;
};

const GradeForm = ({
  mod,
  gradeId,
}: {
  mod: "create" | "update";
  gradeId?: string;
}) => {
  const subjects = useSubjectStore((state) => state.subjects);
  const teachingUnits = useTeachingUnitStore((state) => state.teachingUnits);
  const students = useStudentStore((state) => state.students);
  const [grades, setGrades] = useState<z.infer<typeof GradeSchema>[]>([]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isPreview, setIsPreview] = useState(false);
  const [semester, setSemester] = useState(1);
  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState<"CC" | "TP" | "EXAM">("CC");
  const [period, setPeriod] = useState(1);
  const [fileUrl, setFileUrl] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState<
    z.infer<typeof SubjectSchema>[]
  >([]);

  function filterSubject(selectedSemester: number = 1) {
    setFilteredSubjects([]);
    const semesterTeachingUnits = teachingUnits
      .filter((teachingUnit) => teachingUnit.semester === selectedSemester)
      .map((teachingUnit) => teachingUnit.id);

    for (const subject of subjects) {
      if (semesterTeachingUnits.includes(subject.teachingUnitId)) {
        setFilteredSubjects((prevSubjects) => [...prevSubjects, subject]);
      }
    }
  }

  useEffect(() => {
    filterSubject(semester);
  }, [semester]);

  const formSchema = z.object({
    id: z.string(),
    subjectId: z
      .string()
      .min(1, { message: "Veuillez sélectionner une matière" }),
    type: z.enum(["CC", "TP", "EXAM"]),
    period: z.number().int().positive(),
    files: z.instanceof(FileList).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      period: 1,
    },
  });
  const { register } = form;

  const uploadGrades = async (grades: z.infer<typeof GradeSchema>[]) => {
    const validGrades = grades.filter((grade) =>
      students.some((student) => student.studentNumber === grade.studentNumber),
    );

    if (validGrades.length === 0) {
      setError("Aucun étudiant valide trouvé dans le fichier");
      return;
    }

    const attachedSubject = subjects.find(
      (subject) => subject.id === subjectId,
    );

    let newCoefficient: number;
    switch (type) {
      case "CC":
        newCoefficient = attachedSubject?.ccCoefficient as number;
        break;
      case "TP":
        newCoefficient = attachedSubject?.tpCoefficient as number;
        break;
      case "EXAM":
        newCoefficient = attachedSubject?.examCoefficient as number;
        break;
      default:
        newCoefficient = attachedSubject?.ccCoefficient as number;
    }

    const assessmentResponse = await createAssessment({
      id: uuidv4(),
      subjectId,
      type,
      period,
      coefficient: newCoefficient,
      fileName: fileUrl,
      date: new Date(),
    });

    if (assessmentResponse.error || !assessmentResponse.assessment) {
      setError(assessmentResponse.error);
      return;
    }

    const data: z.infer<typeof GradeSchema>[] = validGrades.map((grade) => ({
      id: uuidv4(),
      studentNumber: grade.studentNumber,
      value: grade.value,
      assessmentId: assessmentResponse.assessment.id,
    }));

    startTransition(async () => {
      const response = await createManyGrades(data);
      setSuccess(response.success);
      setError(response.error);
      await fetchGrades();
    });
  };

  const upload = async (values: z.infer<typeof formSchema>) => {
    setSuccess("");
    setError("");
    setSubjectId(values.subjectId);
    setType(values.type);
    setPeriod(values.period);
    const files = values.files;
    if (!files || files.length === 0) {
      setError("Aucun fichier sélectionné");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);
    const response = await uploadPdfFile(formData);
    const grades: {
      studentNumber: string;
      value: number;
    }[] = JSON.parse(response.grades);

    if (grades.length === 0) {
      setError("Aucune note à uploader");
      return;
    }
    setGrades(grades as z.infer<typeof GradeSchema>[]);
    setFileUrl(response.url);
    setIsPreview(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(upload)} className={"space-y-6"}>
          <div className={"space-y-4"}>
            <FormField
              control={form.control}
              name={"files"}
              render={() => (
                <FormItem>
                  <FormLabel>Fichier</FormLabel>
                  <FormControl>
                    <Input
                      {...register("files")}
                      disabled={isPending}
                      accept={"application/pdf"}
                      type={"file"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"semester"}
              render={() => (
                <FormItem>
                  <FormLabel>Semestre</FormLabel>
                  <Input
                    type={"number"}
                    defaultValue={1}
                    disabled={isPending}
                    onChange={(e) => setSemester(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"subjectId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la matière</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={`${subject.id}`}>
                          {subject.name}
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
              name={"type"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'examen</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type d'évaluation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"CC"}>CC</SelectItem>
                      <SelectItem value={"TP"}>TP</SelectItem>
                      <SelectItem value={"EXAM"}>EXAM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"period"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder={"Période"}
                      type={"number"}
                      value={field.value}
                      onChange={(e) => {
                        const numberVal = parseInt(e.target.value, 10);
                        field.onChange(numberVal);
                      }}
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
      <GradePreviewModal
        isOpen={isPreview}
        grades={grades}
        onClose={() => setIsPreview(false)}
        onSuccess={async () => await uploadGrades(grades)}
      />
    </>
  );
};

export default GradeForm;
