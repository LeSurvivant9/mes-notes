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
import { departmentStore, studentStore } from "@/store/admin-store";
import { Department, Student } from "@prisma/client";
import StudentForm from "./student-form";

const StudentComponent = () => {
  const departments = departmentStore<Department[]>(
    (state: any) => state.departments
  );
  const students = studentStore<Student[]>((state: any) => state.students);

  const handleDelete = async (departmentId: number | undefined) => {
    // Logique de suppression ici...
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
          <StudentForm />
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.studentNumber}</TableCell>
              <TableCell className="">{student.lastName}</TableCell>
              <TableCell className="">{student.firstName}</TableCell>
              <TableCell className="">{student.level}</TableCell>
              <TableCell className="">
                {
                  departments.filter(
                    (department) => department.id === student.departmentId
                  )[0]?.departmentName
                }
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleEdit(student.id)}>Modifier</Button>
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleDelete(student.id)}>
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
