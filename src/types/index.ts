export type GradeInformationType = {
    data: { student_number: string, grade_value: number }[],
    subjectId: number,
    typeOfAssessment: string
    assessmentCoefficient: number,
    fileName: string,
    period: number
}