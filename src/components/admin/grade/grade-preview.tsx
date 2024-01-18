import React from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {GradeDataType} from "@/components/admin/grade-form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

type GradeDialogPreviewType = {
    isPreview: boolean,
    setIsPreview: (bool: boolean) => void,
    gradesData: GradeDataType[],
    confirmUpload: () => void,
}

const GradeDialogPreview = ({isPreview, setIsPreview, gradesData, confirmUpload}: GradeDialogPreviewType) => {
    return (
        <Dialog open={isPreview}>
            <DialogContent className={"h-full max-w-screen-md"}>
                <DialogHeader>
                    <DialogTitle>Prévisualisation des Notes</DialogTitle>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={"text-center"}>Numéro étudiant</TableHead>
                            <TableHead className={"text-center"}>Note</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gradesData.map((grade) => (
                            <TableRow key={grade.student_number} className={"items-center justify-center text-center"}>
                                <TableCell key={grade.student_number}>
                                    {grade.student_number}
                                </TableCell>
                                <TableCell>
                                    {grade.grade_value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DialogFooter className={"h-full"}>
                    <Button onClick={() => confirmUpload()}>Confirmer</Button>
                    <Button onClick={() => setIsPreview(false)}>Annuler</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GradeDialogPreview;
