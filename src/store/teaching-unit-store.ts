import {create} from "zustand";
import {teaching_unit} from "@prisma/client";

export const teachingUnitStore = create((set => ({
    teachingUnits: <teaching_unit[]>[],
    setTeachingUnits: (newTeachingUnits: teaching_unit[]) => set((state: any) => ({
        teachingUnits: [...newTeachingUnits],
    })),
})));