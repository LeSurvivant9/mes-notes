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
import { useGradeStore } from "@/store/use-grade";
import { useAssessmentStore } from "@/store/use-assessment";
import { useSubjectStore } from "@/store/use-subject";
import { fetchGrades } from "@/data/get-all-datas";
import { deleteGrade } from "@/actions/admin/grade.actions";
import GradeForm from "@/components/admin/grade/grade-form";

const GradeComponent = () => {
  const grades = useGradeStore((state) => state.grades);
  const assessments = useAssessmentStore((state) => state.assessments);
  const subjects = useSubjectStore((state) => state.subjects);

  const getAttachedAssessment = (assessmentId: string) => {
    return assessments.find((element) => element.id === assessmentId);
  };

  const getAttachedSubject = (assessmentId: string) => {
    const attachedAssessment = getAttachedAssessment(assessmentId);
    return subjects.find(
      (element) => element.id === attachedAssessment?.subjectId,
    );
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={"w-full"}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <GradeForm mod={"create"} />
        </DialogContent>
      </Dialog>
      {/*<Table>*/}
      {/*  <TableHeader>*/}
      {/*    <TableRow>*/}
      {/*      <TableHead className={"text-center w-full"}>*/}
      {/*        Numéro étudiant*/}
      {/*      </TableHead>*/}
      {/*      <TableHead className="">Note</TableHead>*/}
      {/*      <TableHead className="">Coefficient</TableHead>*/}
      {/*      <TableHead className="">Évaluation rattachée</TableHead>*/}
      {/*      <TableHead className="">Matière rattachée</TableHead>*/}
      {/*      <TableHead colSpan={2} className={"text-center w-full"}>*/}
      {/*        Options*/}
      {/*      </TableHead>*/}
      {/*    </TableRow>*/}
      {/*  </TableHeader>*/}
      {/*  <TableBody>*/}
      {/*    {grades?.map((grade) => (*/}
      {/*      <TableRow key={grade.id}>*/}
      {/*        <TableCell>{grade.studentNumber}</TableCell>*/}
      {/*        <TableCell>{grade.value}</TableCell>*/}
      {/*        <TableCell>*/}
      {/*          {getAttachedAssessment(grade.assessmentId)?.coefficient}*/}
      {/*        </TableCell>*/}
      {/*        <TableCell>*/}
      {/*          {getAttachedAssessment(grade.assessmentId)?.fileName}*/}
      {/*        </TableCell>*/}
      {/*        <TableCell>*/}
      {/*          {getAttachedSubject(grade.assessmentId)?.name}*/}
      {/*        </TableCell>*/}
      {/*        <TableCell className={"text-right"}>*/}
      {/*          <Dialog>*/}
      {/*            <DialogTrigger asChild>*/}
      {/*              <Button>Modifier</Button>*/}
      {/*            </DialogTrigger>*/}
      {/*            <DialogContent>*/}
      {/*              <GradeForm mod={"update"} gradeId={grade.id} />*/}
      {/*            </DialogContent>*/}
      {/*          </Dialog>*/}
      {/*        </TableCell>*/}
      {/*        <TableCell className={"text-right"}>*/}
      {/*          <Button*/}
      {/*            onClick={async () => {*/}
      {/*              await deleteGrade(grade.id as string);*/}
      {/*              await fetchGrades();*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            Supprimer*/}
      {/*          </Button>*/}
      {/*        </TableCell>*/}
      {/*      </TableRow>*/}
      {/*    ))}*/}
      {/*  </TableBody>*/}
      {/*  <TableFooter>*/}
      {/*    <TableRow>*/}
      {/*      <TableCell colSpan={6}>Total</TableCell>*/}
      {/*      <TableCell className="text-right">{grades?.length}</TableCell>*/}
      {/*    </TableRow>*/}
      {/*  </TableFooter>*/}
      {/*</Table>*/}
    </>
  );
};

export default GradeComponent;
