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
import SubjectForm from "./subject-form";
import { useSubjectStore } from "@/store/use-subject";
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { z } from "zod";
import { SubjectSchema } from "@/schemas";
import { deleteSubject } from "@/actions/admin/subject.actions";
import { fetchSubjects } from "@/data/get-all-datas";

const SubjectComponent = () => {
  const subjects = useSubjectStore((state) => state.subjects);
  const teachingUnits = useTeachingUnitStore((state) => state.teachingUnits);

  const getNameAttachedTeachingUnit = (
    subject: z.infer<typeof SubjectSchema>,
  ) => {
    return teachingUnits.find(
      (teachingUnit) => teachingUnit.id === subject.teachingUnitId,
    )?.name;
  };

  return (
    <div className={"text-center"}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <SubjectForm mod={"create"} />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"text-center w-full"}>Nom</TableHead>
            <TableHead className="">Coefficient</TableHead>
            <TableHead className="">CC Coefficient</TableHead>
            <TableHead className="">TP Coefficient</TableHead>
            <TableHead className="">EXAM Coefficient</TableHead>
            <TableHead className="">UE rattachée</TableHead>
            <TableHead colSpan={2} className={"text-center w-full"}>
              Options
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects?.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell className="">{subject.name}</TableCell>
              <TableCell className="">{subject.coefficient}</TableCell>
              <TableCell className="">{subject.ccCoefficient}</TableCell>
              <TableCell className="">{subject.tpCoefficient}</TableCell>
              <TableCell className="">{subject.examCoefficient}</TableCell>
              <TableCell className="">
                {getNameAttachedTeachingUnit(subject)}
              </TableCell>
              <TableCell className={"text-right"}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <SubjectForm mod={"update"} subjectId={subject.id} />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className={"text-right"}>
                <Button
                  onClick={async () => {
                    await deleteSubject(subject.id as string);
                    await fetchSubjects();
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
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">{subjects?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default SubjectComponent;
