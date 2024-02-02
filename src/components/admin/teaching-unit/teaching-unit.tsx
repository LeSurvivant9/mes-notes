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
import { departmentStore } from "@/store/admin-store";
import { teachingUnitStore } from "@/store/use-teaching-unit";
import { Department, TeachingUnit } from "@prisma/client";
import TeachingUnitForm from "./teaching-unit-form";

const TeachingUnitComponent = () => {
  const teachingUnits = teachingUnitStore<TeachingUnit[]>(
    (state: any) => state.teachingUnits,
  );
  const departments = departmentStore<Department[]>(
    (state: any) => state.departments,
  );

  const handleDelete = async (teachingUnitId: number | undefined) => {
    // Logique de suppression ici...
    console.log("Supprimer le département avec l'id:", teachingUnitId);
  };

  // Fonction pour gérer la modification
  const handleEdit = (teachingUnitId: number | undefined) => {
    // Logique de modification ici...
    console.log("Modifier le département avec l'id :", teachingUnitId);
  };

  return (
    <div className={"text-center"}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <TeachingUnitForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Id</TableHead>
            <TableHead className="">Nom</TableHead>
            <TableHead className="">Semestre</TableHead>
            <TableHead className="text-right">Département rattaché</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachingUnits?.map((teachingUnit) => (
            <TableRow key={teachingUnit.id}>
              <TableCell>{teachingUnit.id}</TableCell>
              <TableCell className="text-center">
                {teachingUnit.teachingUnitName}
              </TableCell>
              <TableCell className="text-center">
                {teachingUnit.semester}
              </TableCell>
              <TableCell className="text-right">
                {
                  departments.filter(
                    (department) => department.id === teachingUnit.departmentId,
                  )[0].departmentName
                }
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleEdit(teachingUnit.id)}>
                  Modifier
                </Button>
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleDelete(teachingUnit.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {teachingUnits?.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TeachingUnitComponent;
