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
import React from "react";
import { StudentSchema } from "@/schemas";
import { z } from "zod";

type StudentPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: z.infer<typeof StudentSchema>[];
};

const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  students,
}) => {
  const upload = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className={"h-full max-w-screen-md"}>
        <DialogHeader>
          <DialogTitle>Prévisualisation des étudiants</DialogTitle>
        </DialogHeader>
        <Table onClick={onClose} className={"w-full h-full max-w-screen-sm"}>
          <TableHeader>
            <TableRow>
              <TableHead className={"text-center"}>Numéro étudiant</TableHead>
              <TableHead className={"text-center"}>Nom</TableHead>
              <TableHead className={"text-center"}>Prénom</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.studentNumber}>
                <TableCell className="text-center">
                  {student.studentNumber}
                </TableCell>
                <TableCell className="text-center">
                  {student.lastName}
                </TableCell>
                <TableCell className="text-center">
                  {student.firstName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="sm:justify-start">
          <Button onClick={upload} className={"w-full"}>
            Upload les étudiants
          </Button>
          <Button onClick={onClose} className={"w-full"}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentPreviewModal;
