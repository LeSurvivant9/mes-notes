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
import { Department } from "@prisma/client";
import DepartmentForm from "./department-form";

const DepartmentComponent = () => {
  const departments = departmentStore<Department[]>(
    (state: any) => state.departments
  );

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
          <DepartmentForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Id</TableHead>
            <TableHead className="text-right">Nom</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments?.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.id}</TableCell>
              <TableCell className="text-right">
                {department.departmentName}
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleEdit(department.id)}>
                  Modifier
                </Button>
              </TableCell>
              <TableCell className={"p-0 m-0 gap-x-0"}>
                <Button onClick={() => handleDelete(department.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{departments?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DepartmentComponent;
