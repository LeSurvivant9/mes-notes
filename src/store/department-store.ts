import {create} from "zustand";
import {department} from "@prisma/client";


export const departmentStore = create((set => ({
    departments: <department[]>[],
    setDepartments: (newDepartments: department[]) => set((state: any) => ({
        departments: [...newDepartments]
    })),
})))