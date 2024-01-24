"use client";
import Container from "@/components/ui/container";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {getCompleteStudentGrades} from "@/actions/grade-action";
import {v4 as uuidv4} from 'uuid';


export type CompleteGradesType = {
    id: number,
    student_id: number,
    grade_value: number,
    assessment: {
        id: number,
        file_name: string,
        type_of_assessment: string,
        date_of_assessment: Date,
        coefficient: number,
        period: number,
        subject_id: number,
        subject: {
            id: number,
            subject_name: string,
            subject_coefficient: number,
            teaching_unit_id: number,
            teaching_unit: {
                id: number,
                semester: number,
                teaching_unit_name: string,
                department_id: number,
            },
        },
    },
}[];

type AssessmentType = {
    id: number;
    file_name: string;
    gradeValue: number;
    coefficient: number;
    period: number;
};

type SubjectType = {
    name: string;
    totalGrade: number;
    totalCoefficient: number;
    subjectCoefficient: number;
    average: number;
    assessments: AssessmentType[];
};

type TeachingUnitType = {
    name: string;
    totalGrade: number;
    totalCoefficient: number;
    average: number;
    subjects: { [subjectId: number]: SubjectType };
};

type SemesterType = {
    totalGrade: number;
    totalCoefficient: number;
    average: number;
    teachingUnits: { [teachingUnitId: number]: TeachingUnitType };
};

const GradesPage = () => {
    const {data: session} = useSession();
    const studentId = session?.student.id;
    const [organizedGrades, setOrganizedGrades] = useState<SemesterType[]>([]);

    useEffect(() => {
        if (studentId) {
            getCompleteStudentGrades(studentId).then((grades: CompleteGradesType) => {
                const organized = organizeGrades(grades);
                setOrganizedGrades(organized);
            });
        }
    }, [studentId]);

    function organizeGrades(grades: CompleteGradesType): SemesterType[] {
        const semesters: { [key: number]: SemesterType } = {};

        grades.forEach(grade => {
            const {assessment} = grade;
            const {subject} = assessment;
            const teachingUnit = subject.teaching_unit;
            const semesterNumber = teachingUnit.semester;

            if (!semesters[semesterNumber]) {
                semesters[semesterNumber] = {average: 0, totalGrade: 0, totalCoefficient: 0, teachingUnits: {}};
            }

            if (!semesters[semesterNumber].teachingUnits[teachingUnit.id]) {
                semesters[semesterNumber].teachingUnits[teachingUnit.id] = {
                    average: 0,
                    name: teachingUnit.teaching_unit_name,
                    totalGrade: 0,
                    totalCoefficient: 0,
                    subjects: {}
                };
            }

            if (!semesters[semesterNumber].teachingUnits[teachingUnit.id].subjects[subject.id]) {
                semesters[semesterNumber].teachingUnits[teachingUnit.id].subjects[subject.id] = {
                    name: subject.subject_name,
                    totalGrade: 0,
                    totalCoefficient: 0,
                    subjectCoefficient: subject.subject_coefficient,
                    average: 0,
                    assessments: []
                };
            }

            const subjectData = semesters[semesterNumber].teachingUnits[teachingUnit.id].subjects[subject.id];
            subjectData.assessments.push({
                id: assessment.id,
                file_name: assessment.file_name,
                gradeValue: grade.grade_value,
                coefficient: assessment.coefficient,
                period: assessment.period
            });

            const gradeValueTimesCoefficient = grade.grade_value * assessment.coefficient;
            subjectData.totalGrade += gradeValueTimesCoefficient;
            subjectData.totalCoefficient += assessment.coefficient;
        });

        Object.values(semesters).forEach(semester => {
            Object.values(semester.teachingUnits).forEach(teachingUnit => {
                Object.values(teachingUnit.subjects).forEach(subject => {
                    subject.average = subject.totalGrade / subject.totalCoefficient;
                    teachingUnit.totalGrade += subject.average * subject.subjectCoefficient;
                    teachingUnit.totalCoefficient += subject.subjectCoefficient;
                });
                teachingUnit.average = teachingUnit.totalGrade / teachingUnit.totalCoefficient;
                semester.totalGrade += teachingUnit.average;
                semester.totalCoefficient += 1;
            });
            semester.average = semester.totalGrade / semester.totalCoefficient;
        });

        return Object.values(semesters);
    }


    return (
        <Container>
            {Object.entries(organizedGrades).map(([semesterNumber, semesterData]) => (
                <div key={semesterNumber}>
                    <h2>Semestre {semesterNumber} - Moyenne générale: {semesterData.average.toFixed(2)}</h2>
                    {Object.entries(semesterData.teachingUnits).map(([teachingUnitId, teachingUnitData]) => (
                        <div key={teachingUnitId}>
                            <h3>UE {teachingUnitData.name} - Moyenne de l'UE: {teachingUnitData.average.toFixed(2)}</h3>
                            {Object.entries(teachingUnitData.subjects).map(([subjectId, subjectData]) => (
                                <div key={subjectId}>
                                    <h4>{subjectData.name} - Moyenne de la matière: {subjectData.average.toFixed(2)} - Poids : {subjectData.subjectCoefficient}</h4>
                                    {subjectData.assessments.map(assessment => (
                                        <p key={assessment.id}>
                                            {assessment.file_name} | Note: {assessment.gradeValue} |
                                            Coefficient: {assessment.coefficient} | Période: {assessment.period}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </Container>
    );
};

export default GradesPage;