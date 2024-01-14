import {Card, CardContent} from "@/components/ui/card";
import {getTeachingUnits} from "@/actions/admin";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {TeachingUnitSchema} from "@/schemas";
import {z} from "zod"
import {useState} from "react";
import TeachingUnitForm from "@/components/admin/teaching-unit-form";

const TeachingUnitComponent = () => {
    const [teachingUnits, setTeachingUnits] = useState<z.infer<typeof TeachingUnitSchema>[]>()

    return (
        <div className={"flex flex-row items-center rounded-lg border p-3 shadow-md"}>
            <p className={"flex-grow text-sm font-medium"}>
                Unités d&apos;enseignements
            </p>
            <div className={"flex gap-x-2"}>
                <Dialog>
                    <DialogTrigger className={"border-black border-2 rounded"}>Ajouter</DialogTrigger>
                    <DialogContent>
                        <TeachingUnitForm/>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger onClick={async () => {
                        const teachingUnits = await getTeachingUnits()
                        setTeachingUnits(teachingUnits);
                    }}>Voir
                    </DialogTrigger>
                    <DialogContent>
                        <Card>
                            <CardContent>
                                {JSON.stringify(teachingUnits)}
                            </CardContent>
                        </Card>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default TeachingUnitComponent;
