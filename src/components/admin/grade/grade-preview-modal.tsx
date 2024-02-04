import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { GradeSchema } from "@/schemas";
import React from "react";

type GradePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  grades: z.infer<typeof GradeSchema>[];
};

const GradePreviewModal: React.FC<GradePreviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  grades,
}) => {
  const upload = async () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className={"h-full max-w-screen-md"}>
        <DialogHeader>
          <DialogTitle>Prévisualisation des notes</DialogTitle>
        </DialogHeader>
        <Table onClick={onClose} className={"w-full h-full max-w-screen-sm"}>
          <TableHeader>
            <TableRow>
              <TableHead className={"text-center"}>Numéro étudiant</TableHead>
              <TableHead className={"text-center"}>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.studentNumber}>
                <TableCell className="text-center">
                  {grade.studentNumber}
                </TableCell>
                <TableCell className="text-center">{grade.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="sm:justify-start">
          <Button onClick={upload} className={"w-full"}>
            Upload les étudiants
          </Button>
          <Button
            onClick={onClose}
            variant={"destructive"}
            className={"w-full"}
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GradePreviewModal;
