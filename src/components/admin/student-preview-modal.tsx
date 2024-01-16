import React, {FormEvent} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {addOrUpdateStudents} from "@/actions/add-admin-function";
import {Button} from "@/components/ui/button";

type StudentPreviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onError: (message?: string) => void;
    onSuccess: (message?: string) => void;
    setIsPending: (arg: boolean) => void;
    students: any[];
    departmentId: number;
    level: number;
};

const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     students,
                                                                     departmentId,
                                                                     level,
                                                                     onError,
                                                                     onSuccess,
                                                                     setIsPending,
                                                                 }) => {

    const upload = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        addOrUpdateStudents(students, departmentId, level)
            .then((data) => {
                onError(data?.error);
                onSuccess(data?.success);
                setIsPending(false);
            });
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className={"h-full max-w-screen-md"}>
                <DialogHeader>
                    <DialogTitle>
                        Prévisualisation des étudiants
                    </DialogTitle>
                </DialogHeader>
                <Table onClick={onClose} className={"w-full h-full max-w-screen-sm"}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={"text-center"}>Numéro étudiant</TableHead>
                            <TableHead className={"text-center"}>Nom</TableHead>
                            <TableHead className={"text-center"}>Prénom</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={""}>
                        {students.map((student) => (
                            <TableRow key={student.Code}>
                                <TableCell className="text-center">{student.Code}</TableCell>
                                <TableCell className="text-center">{student.Nom}</TableCell>
                                <TableCell className="text-center">{student.Prenom}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DialogFooter className="sm:justify-start">
                    <form onSubmit={upload} className={"w-full"}>
                        <Button type={"submit"} onClick={onClose} className={"w-full"}>
                            Upload les étudiants
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default StudentPreviewModal;
