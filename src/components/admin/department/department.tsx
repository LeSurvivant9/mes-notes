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
import { deleteDepartment } from "@/actions/admin/department.actions";
import { fetchAllData } from "@/data/get-all-datas";
import DepartmentForm from "@/components/admin/department/department-form";

const DepartmentComponent = () => {
  const departments = useDepartmentStore((state) => state.departments);

  return (
    <div className={"text-center"}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <DepartmentForm mod={"create"} />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow className={"w-full"}>
            <TableHead className={"text-center w-full"}>Nom</TableHead>
            <TableHead colSpan={2} className={"text-center"}>
              Options
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"w-full"}>
          {departments?.map((department) => (
            <TableRow key={department.id}>
              <TableCell className={"text-center"}>{department.name}</TableCell>
              <TableCell className={"text-right"}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DepartmentForm
                      mod={"update"}
                      departmentId={department.id}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className={"text-right"}>
                <Button
                  onClick={async () => {
                    await deleteDepartment(department.id as string);
                    await fetchAllData();
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
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{departments?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DepartmentComponent;
