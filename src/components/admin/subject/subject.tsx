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
import { subjectStore } from "@/store/subject-store";
import { Subject, TeachingUnit } from "@prisma/client";
import SubjectForm from "./subject-form";

const SubjectComponent = () => {
  const subjects = subjectStore<Subject[]>((state: any) => state.subjects);
  const teachingUnits = subjectStore<TeachingUnit[]>(
    (state: any) => state.teachingUnits
  );

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
          <SubjectForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Id</TableHead>
            <TableHead className="">Nom</TableHead>
            <TableHead className="">Coefficient</TableHead>
            <TableHead className="">UE rattachée</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects?.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.id}</TableCell>
              <TableCell className="">{subject.subjectName}</TableCell>
              <TableCell className="">{subject.subjectCoefficient}</TableCell>
              <TableCell className="">
                {
                  teachingUnits.filter(
                    (teachingUnit) => teachingUnit.id === subject.teachingUnitId
                  )[0].teachingUnitName
                }
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleEdit(subject.id)}>Modifier</Button>
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleDelete(subject.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">{subjects?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default SubjectComponent;
