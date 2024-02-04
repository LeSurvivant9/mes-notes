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
import { fetchAssessments, fetchGrades } from "@/data/get-all-datas";
import AssessmentForm from "@/components/admin/assessment/assessment-form";
import { useAssessmentStore } from "@/store/use-assessment";
import { deleteAssessment } from "@/actions/admin/assessment.actions";

const AssessmentComponent = () => {
  const assessments = useAssessmentStore((state) => state.assessments);

  return (
    <div className={"text-center"}>
      <Table>
        <TableHeader>
          <TableRow className={"w-full"}>
            <TableHead className={"text-center w-full"}>Nom</TableHead>
            <TableHead className={"text-center w-full"}>Type</TableHead>
            <TableHead className={"text-center w-full"}>Date</TableHead>
            <TableHead className={"text-center w-full"}>Coefficient</TableHead>
            <TableHead colSpan={2} className={"text-center"}>
              Options
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={"w-full"}>
          {assessments?.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className={"text-center"}>
                {assessment.fileName}
              </TableCell>
              <TableCell className={"text-center"}>{assessment.type}</TableCell>
              <TableCell className={"text-center"}>
                {assessment.date.toLocaleDateString()}
              </TableCell>
              <TableCell className={"text-center"}>
                {assessment.coefficient}
              </TableCell>
              <TableCell className={"text-right"}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Modifier</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <AssessmentForm
                      mod={"update"}
                      assessmentId={assessment.id}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className={"text-right"}>
                <Button
                  onClick={async () => {
                    await deleteAssessment(assessment.id as string);
                    await fetchAssessments();
                    await fetchGrades();
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
            <TableCell className="text-right">{assessments?.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default AssessmentComponent;
