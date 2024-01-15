import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import React, {useContext} from "react";
import {Button} from "@/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {AdminContext} from "@/app/(connected)/admin/AdminContext";
import SubjectForm from "@/components/admin/subject-form";


const SubjectComponent = () => {
    const {subjects, teachingUnits} = useContext(AdminContext);

    const handleDelete = async (departmentId: number | undefined) => {
        // Logique de suppression ici...
        console.log("Supprimer le département avec l'id:", departmentId);
    };

    // Fonction pour gérer la modification
    const handleEdit = (departmentId: number | undefined) => {
        // Logique de modification ici...
        console.log("Modifier le département avec l'id :", departmentId);
    };

    return (
        <Accordion type={"single"} collapsible className="w-full">
            <AccordionItem value="subjects">
                <AccordionTrigger>Matières</AccordionTrigger>
                <AccordionContent>
                    <div className={"text-center"}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className={"w-full"}>Ajouter</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <SubjectForm/>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Id</TableHead>
                                <TableHead className="">Nom</TableHead>
                                <TableHead className="">Coefficient</TableHead>
                                <TableHead className="">UE rattachée</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects?.map(subject => (
                                <TableRow key={subject.id}>
                                    <TableCell>{subject.id}</TableCell>
                                    <TableCell className="">{subject.subject_name}</TableCell>
                                    <TableCell className="">{subject.subject_coefficient}</TableCell>
                                    <TableCell
                                        className="">{teachingUnits.filter(teachingUnit => teachingUnit.id === subject.teaching_unit_id)[0].teaching_unit_name}</TableCell>
                                    <TableCell className={"p-0 m-0 gap-x-0"}>
                                        <Button onClick={() => handleEdit(subject.id)}>Modifier</Button>
                                    </TableCell>
                                    <TableCell className={"p-0 m-0 gap-x-0"}>
                                        <Button onClick={() => handleDelete(subject.id)}>Supprimer</Button>
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default SubjectComponent;
