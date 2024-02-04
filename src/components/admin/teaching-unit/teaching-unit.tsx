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
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { useDepartmentStore } from "@/store/use-department";
import { z } from "zod";
import { TeachingUnitSchema } from "@/schemas";
import TeachingUnitForm from "@/components/admin/teaching-unit/teaching-unit-form";
import { fetchTeachingUnits } from "@/data/get-all-datas";
import { deleteTeachingUnit } from "@/actions/admin/teaching-unit.actions";

const TeachingUnitComponent = () => {
  const teachingUnits = useTeachingUnitStore((state) => state.teachingUnits);
  const departments = useDepartmentStore((state) => state.departments);

  const getNameAttachedDepartment = (
    teachingUnit: z.infer<typeof TeachingUnitSchema>,
  ) => {
    return departments.find(
      (department) => department.id === teachingUnit.departmentId,
    )?.name;
  };

  return (
    <div className={"text-center"}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <TeachingUnitForm mod={"create"} />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"text-center w-full"}>Nom</TableHead>
            <TableHead className={"text-center w-full"}>Semestre</TableHead>
            <TableHead className={"text-center w-full"}>
              Département rattaché
            </TableHead>
            <TableHead colSpan={2} className={"text-center w-full"}>
              Options
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachingUnits?.map((teachingUnit) => (
            <TableRow key={teachingUnit.id}>
              <TableCell className={"text-center"}>
                {teachingUnit.name}
              </TableCell>
              <TableCell className={"text-center"}>
                {teachingUnit.semester}
              </TableCell>
              <TableCell className={"text-center"}>
                {getNameAttachedDepartment(teachingUnit)}
              </TableCell>
              <TableCell className={"text-right"}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <TeachingUnitForm
                      mod={"update"}
                      teachingUnitId={teachingUnit.id}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className={"text-right"}>
                <Button
                  onClick={async () => {
                    await deleteTeachingUnit(teachingUnit.id as string);
                    await fetchTeachingUnits();
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
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className={"text-right"}>
              {teachingUnits?.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TeachingUnitComponent;
