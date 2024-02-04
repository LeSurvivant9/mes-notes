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
import { useDepartmentStore } from "@/store/use-department";
import { useStudentStore } from "@/store/use-student";
import { z } from "zod";
import { StudentSchema } from "@/schemas";
import { fetchStudents } from "@/data/get-all-datas";
import { deleteStudent } from "@/actions/admin/student.actions";
import StudentForm from "@/components/admin/student/student-form";

const StudentComponent = () => {
  const { departments } = useDepartmentStore((state) => state);
  const { students, setStudents } = useStudentStore((state) => state);

  const getNameAttachedDepartment = (
    student: z.infer<typeof StudentSchema>,
  ) => {
    return departments.find(
      (department) => department.id === student.departmentId,
    )?.name;
  };

  return (
    <div className={"text-center"}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <StudentForm mod={"create"} />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Numéro étudiant</TableHead>
            <TableHead className="">Nom</TableHead>
            <TableHead className="">Prénom</TableHead>
            <TableHead className="">Niveau</TableHead>
            <TableHead className="">Département</TableHead>
            <TableHead colSpan={2} className={"text-center w-full"}>
              Options
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.studentNumber}>
              <TableCell>{student.studentNumber}</TableCell>
              <TableCell className="">{student.lastName}</TableCell>
              <TableCell className="">{student.firstName}</TableCell>
              <TableCell className="">{student.level}</TableCell>
              <TableCell className="">
                {getNameAttachedDepartment(student)}
              </TableCell>
              <TableCell className={"text-right"}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <StudentForm
                      mod={"update"}
                      studentNumber={student.studentNumber}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className={"text-right"}>
                <Button
                  onClick={async () => {
                    await deleteStudent(student.studentNumber as string);
                    await fetchStudents();
                  }}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">{students?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default StudentComponent;
