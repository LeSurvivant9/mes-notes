import GradeForm from "@/components/admin/grade-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studentStore } from "@/store/admin-store";
import { assessmentStore } from "@/store/assessment-store";
import { gradeStore } from "@/store/grade-store";
import { subjectStore } from "@/store/subject-store";
import { Assessment, Grade, Student, Subject } from "@prisma/client";

const GradeComponent = () => {
  const grades = gradeStore<Grade[]>((state: any) => state.grades);
  const assessments = assessmentStore<Assessment[]>(
    (state: any) => state.assessments
  );
  const students = studentStore<Student[]>((state: any) => state.students);
  const subjects = subjectStore<Subject[]>((state: any) => state.subjects);

  const firstGrade = grades[0];
  const fileName = assessments.filter(
    (assessment) => assessment.id === firstGrade.assessmentId
  )[0]?.fileName;
  const coefficient = assessments.filter(
    (assessment) => assessment.id === firstGrade.assessmentId
  )[0]?.coefficient;
  const subjectId = assessments.filter(
    (assessment) => assessment.id === firstGrade.assessmentId
  )[0]?.subjectId;
  const subjectName = subjects.filter((subject) => subject.id === subjectId)[0]
    ?.subjectName;

  const handleDelete = async (departmentId: number | undefined) => {
    // Logique de suppression ici
    console.log("Supprimer le département avec l'id:", departmentId);
  };

  // Fonction pour gérer la modification
  const handleEdit = (departmentId: number | undefined) => {
    // Logique de modification ici...
    console.log("Modifier le département avec l'id :", departmentId);
  };

  return (
    <div className={"text-center"}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <GradeForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Numéro étudiant</TableHead>
            <TableHead className="">Note</TableHead>
            <TableHead className="">Coefficient</TableHead>
            <TableHead className="">Évaluation rattachée</TableHead>
            <TableHead className="">Matière rattachée</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades?.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell>
                {
                  students.filter(
                    (student) => student.id === grade.studentId
                  )[0]?.studentNumber
                }
              </TableCell>
              <TableCell>{grade.gradeValue}</TableCell>
              <TableCell>{coefficient}</TableCell>
              <TableCell>{fileName}</TableCell>
              <TableCell>{subjectName}</TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleEdit(grade.id)}>Modifier</Button>
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleDelete(grade.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">{grades?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default GradeComponent;
