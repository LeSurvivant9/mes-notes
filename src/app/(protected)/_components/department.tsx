import {Card, CardContent} from "@/components/ui/card";
import {getDepartments} from "@/actions/admin";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import DepartmentForm from "@/components/admin/department-form";
import {DepartmentSchema} from "@/schemas";
import {z} from "zod"
import React, {useState} from "react";

const DepartmentComponent = () => {
    const [departments, setDepartments] = useState<z.infer<typeof DepartmentSchema>[]>()

    return (
        <div className={"flex flex-row items-center rounded-lg border p-3 shadow-md"}>
            <p className={"flex-grow text-sm font-medium"}>
                Département
            </p>
            <div className={"flex gap-x-2"}>
                <Dialog>
                    <DialogTrigger>
                        Ajouter
                    </DialogTrigger>
                    <DialogContent>
                        <DepartmentForm/>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger onClick={async () => {
                        const departments = await getDepartments()
                        setDepartments(departments);
                    }}>Voir
                    </DialogTrigger>
                    <DialogContent>
                        <Card>
                            <CardContent>
                                {JSON.stringify(departments)}
                            </CardContent>
                        </Card>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default DepartmentComponent;
