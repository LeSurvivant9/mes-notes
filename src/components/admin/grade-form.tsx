import {Input} from "@/components/ui/input";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import SubmitButton from "@/components/submit-button";
import React, {useState} from "react";
import {subjectStore} from "@/store/admin-store";
import {subject} from "@prisma/client";
import {addGrades} from "@/actions/add-admin-function";

type GradeDataType = {
    student_number: string,
    grade_value: number,
}

const GradeForm = () => {
    const subjects = subjectStore<subject[]>((state: any) => state.subjects);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setIsPending] = useState(false);

    const formSchema = z.object({
        subjectId: z.number().int(),
        typeOfAssessment: z.enum(["CC", "TP", "EXAM"]),
        assessmentCoefficient: z.number().int(),
        period: z.number().int(),
        file: z.instanceof(File),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: {}
    });

    const upload = async (event: any) => {
        const {subjectId, typeOfAssessment, assessmentCoefficient, file, period} = formSchema.parse(event);
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch('/api/upload', {
            method: 'POST', body: formData,
        });

        if (response.ok) {
            const data: GradeDataType[] = await response.json();
            await addGrades({data, subjectId, typeOfAssessment, assessmentCoefficient, fileName: file.name, period});
        } else {
            console.error('Erreur lors de l’extraction du texte PDF');
        }
    };

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(upload)} className={"space-y-6"}>
            <div className={"space-y-4"}>
                <FormField control={form.control} name={"subjectId"}
                           render={({field}) => (<FormItem>
                               <FormLabel>Nom de la matière</FormLabel>
                               <Select disabled={isPending} onValueChange={(val) => {
                                   const numberVal = parseInt(val, 10);
                                   field.onChange(numberVal);
                               }}>
                                   <FormControl>
                                       <SelectTrigger>
                                           <SelectValue placeholder="Sélectionner une matière"/>
                                       </SelectTrigger>
                                   </FormControl>
                                   <SelectContent>
                                       {subjects.map(subject => (
                                           <SelectItem key={subject.id} value={`${subject.id}`}>
                                               {subject.subject_name}
                                           </SelectItem>))}
                                   </SelectContent>
                               </Select>
                               <FormMessage/>
                           </FormItem>)}
                />
                <FormField control={form.control} name={"typeOfAssessment"}
                           render={({field}) => (<FormItem>
                               <FormLabel>Type d'examen</FormLabel>
                               <Select disabled={isPending} onValueChange={field.onChange}>
                                   <FormControl>
                                       <SelectTrigger>
                                           <SelectValue placeholder="Sélectionner le type d'évaluation"/>
                                       </SelectTrigger>
                                   </FormControl>
                                   <SelectContent>
                                       <SelectItem value={"CC"}>CC</SelectItem>
                                       <SelectItem value={"TP"}>TP</SelectItem>
                                       <SelectItem value={"EXAM"}>EXAM</SelectItem>
                                   </SelectContent>
                               </Select>
                               <FormMessage/>
                           </FormItem>)}
                />
                <FormField control={form.control} name={"assessmentCoefficient"}
                           render={({field}) => (<FormItem>
                               <FormLabel>Coefficient</FormLabel>
                               <FormControl>
                                   <Input disabled={isPending} {...field} placeholder={"Coefficient"}
                                          type={"number"}
                                          value={field.value}
                                          defaultValue={field.value}
                                          onChange={(e) => {
                                              const numberVal = parseInt(e.target.value, 10);
                                              field.onChange(numberVal);
                                          }}
                                   />
                               </FormControl>
                               <FormMessage/>
                           </FormItem>)}
                />
                <FormField control={form.control} name={"period"}
                           render={({field}) => (<FormItem>
                               <FormLabel>Période</FormLabel>
                               <FormControl>
                                   <Input disabled={isPending} {...field} placeholder={"Période"}
                                          type={"number"}
                                          value={field.value}
                                          defaultValue={field.value}
                                          onChange={(e) => {
                                              const numberVal = parseInt(e.target.value, 10);
                                              field.onChange(numberVal);
                                          }}
                                   />
                               </FormControl>
                               <FormMessage/>
                           </FormItem>)}
                />
                <FormField control={form.control} name={"file"}
                           render={({field}) => (<FormItem>
                               <FormLabel>Fichier</FormLabel>
                               <FormControl>
                                   <Input disabled={isPending} accept="application/pdf"
                                          type="file"
                                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}/>
                               </FormControl>
                               <FormMessage/>
                           </FormItem>)}
                />
            </div>
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <SubmitButton childrenProps={"w-full"} isPending={isPending}>Prévisualiser pour
                upload</SubmitButton>
        </form>
    </Form>);
};

export default GradeForm;
