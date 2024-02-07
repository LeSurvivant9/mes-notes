"use client";
import {getAllGradesWithInformation} from "@/actions/admin/grade.actions";
import {
  AssessmentType, GradesWithInformationType, organizeGradesIntoSemesters, SemesterType, SubjectType, TeachingUnitType,
} from "@/data/organize-grades";
import {useEffect, useState} from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";

const TeachingUnitComponent = ({
                                 teachingUnit,
                               }: {
  teachingUnit: TeachingUnitType;
}) => {
  return (<div>
    <h2>
      {teachingUnit.name} | Moyenne : {teachingUnit.average.toFixed(2)}
    </h2>
    {Object.values(teachingUnit.subjects).map((subject) => (<>
      <Separator key={subject.id}/>
      <SubjectComponent key={subject.id} subject={subject}/>
      <Separator key={subject.id}/>
    </>))}
  </div>);
};

const SubjectComponent = ({subject}: { subject: SubjectType }) => {
  return (<div className="ml-4 my-4">
    <h3>
      ✧ {subject.name} | Coefficient : {subject.coefficient} | Moyenne :{" "}
      {subject.average.toFixed(2)}
    </h3>
    {subject.assessments.map((assessment) => (<ul key={assessment.id}>
      <li key={assessment.id}>
        <AssessmentComponent key={assessment.id} assessment={assessment}/>
      </li>
    </ul>))}
  </div>);
};

const AssessmentComponent = ({
                               assessment,
                             }: {
  assessment: AssessmentType;
}) => {
  const filename = assessment.fileName.split("/").pop();
  return (<div className="ml-4 my-2">
    •{" "}
    <Link
      href={assessment.fileName}
      target={"_blank"}
      rel={"noonpener noreferrer"}
      className={"hover:underline"}
    >
      {filename?.substring(0, 30)}.pdf
    </Link>{" "}
    | {assessment.type} | Note : {assessment.grade} |{" "}
    {new Date(assessment.date).toLocaleDateString()} | Période :{" "}
    {assessment.period}{" "}
  </div>);
};

const SemesterComponent = ({
                             semester, semesterNumber,
                           }: {
  semester: SemesterType; semesterNumber: number;
}) => {
  return (<div className="semester">
    <h2 className={"w-full text-center my-2"}>
      Semestre {semesterNumber} | Moyenne : {semester.average.toFixed(2)}
    </h2>
    {Object.values(semester.teachingUnits).map((teachingUnit) => (<TeachingUnitComponent
      key={teachingUnit.id}
      teachingUnit={teachingUnit}
    />))}
  </div>);
};

export const GradesComponent = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [studentGrades, setStudentGrades] = useState<GradesWithInformationType[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      const grades = await getAllGradesWithInformation(studentNumber);
      setStudentGrades(grades);
    };
    fetchGrades();
  }, [studentNumber]);

  const organizedGrades = organizeGradesIntoSemesters(studentGrades);
  const searchStudent = ({studentNumber}: { studentNumber: string }) => setStudentNumber(studentNumber);

  const formSchema = z.object({
    studentNumber: z.string().min(1, {
      message: "Le numéro étudiant est obligatoire",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), defaultValues: {studentNumber: ""},
  });
  return (<>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(searchStudent)}
        className="flex items-end"
      >
        <div className="flex flex-col flex-grow mr-4">
          <FormLabel>Numéro étudiant</FormLabel>
          <FormField
            control={form.control}
            name={"studentNumber"}
            render={({field}) => (<FormItem>
              <FormControl>
                <Input
                  {...field}
                  type={"text"}
                  name={"studentNumber"}
                  value={field.value}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage className="h-0"/>
            </FormItem>)}
          />
        </div>
        <Button type={"submit"} className="flex-shrink-0">
          Chercher étudiant
        </Button>
      </form>
    </Form>
    <section className={"py-6"}>
      {organizedGrades.length !== 0 ? (Object.values(organizedGrades).map((semester, index) => (<SemesterComponent
        key={index}
        semester={semester}
        semesterNumber={index + 1}
      />))) : (<h1>Pas de notes pour cet étudiant</h1>)}
    </section>
  </>);
};
