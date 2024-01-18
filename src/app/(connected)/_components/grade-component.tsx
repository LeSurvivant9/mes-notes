import React from 'react';
import {gradeStore, studentStore} from "@/store/admin-store"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {assessment, grade, student, subject} from "@prisma/client";
import GradeForm from "@/components/admin/grade-form";
import {assessmentStore} from "@/store/assessment-store";
import {subjectStore} from "@/store/subject-store";

const GradeComponent = () => {
    const grades = gradeStore<grade[]>((state: any) => state.grades);
    const assessments = assessmentStore<assessment[]>((state: any) => state.assessments);
    const students = studentStore<student[]>((state: any) => state.students);
    const subjects = subjectStore<subject[]>((state: any) => state.subjects);

    const firstGrade = grades[0];
    const fileName = assessments.filter(assessment => assessment.id === firstGrade.assessment_id)[0]?.file_name;
    const coefficient = assessments.filter(assessment => assessment.id === firstGrade.assessment_id)[0]?.coefficient;
    const subjectId = assessments.filter(assessment => assessment.id === firstGrade.assessment_id)[0]?.subject_id;
    const subjectName = subjects.filter(subject => subject.id === subjectId)[0]?.subject_name;

    const handleDelete = async (departmentId: number | undefined) => {
        // Logique de suppression ici
        console.log("Supprimer le département avec l'id:", departmentId);
    };

    // Fonction pour gérer la modification
    const handleEdit = (departmentId: number | undefined) => {
        // Logique de modification ici...
        console.log("Modifier le département avec l'id :", departmentId);
    };


    return (<div className={"text-center"}>
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"w-full"}>Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
                <GradeForm/>
            </DialogContent>
        </Dialog>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Numéro étudiant</TableHead>
                    <TableHead className="">Note</TableHead>
                    <TableHead className="">Coefficient</TableHead>
                    <TableHead className="">Évaluation rattachée</TableHead>
                    <TableHead className="">Matière rattachée</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {grades?.map(grade => (<TableRow key={grade.id}>
                    <TableCell>
                        {students.filter(student => student.id === grade.student_id)[0]?.student_number}
                    </TableCell>
                    <TableCell>{grade.grade_value}</TableCell>
                    <TableCell>{coefficient}</TableCell>
                    <TableCell>{fileName}</TableCell>
                    <TableCell>{subjectName}</TableCell>
                    <TableCell className={"p-0 m-0 gap-x-0"}>
                        <Button onClick={() => handleEdit(grade.id)}>Modifier</Button>
                    </TableCell>
                    <TableCell className={"p-0 m-0 gap-x-0"}>
                        <Button onClick={() => handleDelete(grade.id)}>Supprimer</Button>
                    </TableCell>
                </TableRow>))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={6}>Total</TableCell>
                    <TableCell className="text-right">{grades?.length}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </div>);
};

export default GradeComponent;