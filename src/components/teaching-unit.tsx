import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import React, {useContext} from "react";
import TeachingUnitForm from "@/components/admin/teaching-unit-form";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {AdminContext} from "@/app/(connected)/admin/AdminContext";

const TeachingUnitComponent = () => {
    const {teachingUnits, departments} = useContext(AdminContext);

    const handleDelete = async (teachingUnitId: number | undefined) => {
        // Logique de suppression ici...
        console.log("Supprimer le département avec l'id:", teachingUnitId);
    };

    // Fonction pour gérer la modification
    const handleEdit = (teachingUnitId: number | undefined) => {
        // Logique de modification ici...
        console.log("Modifier le département avec l'id :", teachingUnitId);
    };

    return (<div className={"text-center"}>
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"w-full"}>Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
                <TeachingUnitForm/>
            </DialogContent>
        </Dialog>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Id</TableHead>
                    <TableHead className="">Nom</TableHead>
                    <TableHead className="">Semestre</TableHead>
                    <TableHead className="text-right">Département rattaché</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {teachingUnits?.map(teachingUnit => (<TableRow key={teachingUnit.id}>
                    <TableCell>{teachingUnit.id}</TableCell>
                    <TableCell className="text-center">{teachingUnit.teaching_unit_name}</TableCell>
                    <TableCell className="text-center">{teachingUnit.semester}</TableCell>
                    <TableCell
                        className="text-right">{departments.filter(department => department.id === teachingUnit.department_id)[0].department_name}</TableCell>
                    <TableCell className={"p-0 m-0 gap-x-0"}>
                        <Button onClick={() => handleEdit(teachingUnit.id)}>Modifier</Button>
                    </TableCell>
                    <TableCell className={"p-0 m-0 gap-x-0"}>
                        <Button onClick={() => handleDelete(teachingUnit.id)}>Supprimer</Button>
                    </TableCell>
                </TableRow>))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">{teachingUnits?.length}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </div>);
};

export default TeachingUnitComponent;
