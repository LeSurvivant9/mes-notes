import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import DepartmentForm from "@/components/admin/department-form";
import React, {useContext} from "react";
import {Button} from "@/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {AdminContext} from "@/app/(connected)/admin/AdminContext";


const DepartmentComponent = () => {
    const {departments} = useContext(AdminContext);

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
        <Accordion type={"single"} collapsible className="w-full overflow-visible">
            <AccordionItem value="departments">
                <AccordionTrigger>Départements</AccordionTrigger>
                <AccordionContent>
                    <div className={"text-center"}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className={"w-full"}>Ajouter</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DepartmentForm/>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left">Id</TableHead>
                                <TableHead className="text-right">Nom</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments?.map(department => (
                                <TableRow key={department.id}>
                                    <TableCell>{department.id}</TableCell>
                                    <TableCell className="text-right">{department.department_name}</TableCell>
                                    <TableCell className={"p-0 m-0 gap-x-0"}>
                                        <Button onClick={() => handleEdit(department.id)}>Modifier</Button>
                                    </TableCell>
                                    <TableCell className={"p-0 m-0 gap-x-0"}>
                                        <Button onClick={() => handleDelete(department.id)}>Supprimer</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">{departments?.length}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default DepartmentComponent;
