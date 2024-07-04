import re
from io import BytesIO
from typing import Any
from typing import Dict, List
from typing import Optional

from fastapi import FastAPI
from fastapi import File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pypdf import PdfReader

app: FastAPI = FastAPI()





class GradeModel(BaseModel):
    value: float


class AssessmentModel(BaseModel):
    type: str
    coefficient: float


class AssessmentWithGradeModel(BaseModel):
    assessment: AssessmentModel
    grade: GradeModel


class SubjectModel(BaseModel):
    name: str
    coefficient: float
    assessments: List[AssessmentWithGradeModel]


class TeachingUnitModel(BaseModel):
    name: str
    coefficient: float
    subjects: Dict[str, SubjectModel]


class SemesterModel(BaseModel):
    name: str
    ues: Dict[str, TeachingUnitModel]


class StudentModel(BaseModel):
    semesters: Dict[str, SemesterModel]


def extract_data_from_pdf(file: bytes) -> List[Dict[str, Optional[str]]]:
    regex_pattern = r"(2\d{7})\D*(\d+(\.\d+)?)?"
    data = []
    with BytesIO(file) as pdf_buffer:
        pdf = PdfReader(pdf_buffer)
        for page_number in range(len(pdf.pages)):
            page = pdf.pages[page_number]
            text = page.extract_text()
            for line in text.split('\n'):
                match = re.search(regex_pattern, line)
                if match:
                    student_number = match.group(1)
                    note = match.group(2) if match.group(2) else None
                    if note is None:
                        continue
                    entry = {"studentNumber": student_number, "value": note}
                    data.append(entry)
    return data


@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "Tout fonctionne correctement"}


@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        return extract_data_from_pdf(file_bytes)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/calculate_averages/")
def calculate_averages_endpoint(organized_grades: StudentModel):
    student_data = organized_grades.dict()
    return calculate_averages(student_data)


def calculate_average_for_group(group: Dict[str, float], num_assessments: int) -> float:
    return group["total"] / num_assessments


def calculate_subject_average(assessments: List[AssessmentWithGrade], subject_coefficient: float) -> float:
    assessment_groups = {}
    for ag in assessments:
        if ag.assessment.type not in assessment_groups:
            assessment_groups[ag.assessment.type] = {"total": 0, "coefficient": 0}
        assessment_groups[ag.assessment.type]["total"] += ag.grade.value
        assessment_groups[ag.assessment.type]["coefficient"] += ag.assessment.coefficient

    subject_total = 0
    subject_coefficient_sum = 0

    for type, group in assessment_groups.items():
        num_assessments = len([a for a in assessments if a.assessment.type == type])
        average_for_type = calculate_average_for_group(group, num_assessments)
        subject_total += average_for_type * (group["coefficient"] / num_assessments)
        subject_coefficient_sum += group["coefficient"] / num_assessments

    return subject_total / subject_coefficient_sum


def calculate_ue_average(subjects: Dict[str, Subject]) -> Dict[str, Any]:
    ue_total = 0
    ue_coefficient_sum = 0
    subject_averages = {}

    for subject_id, subject in subjects.items():
        subject_average = calculate_subject_average(subject.assessments, subject.coefficient)
        subject_averages[subject_id] = {
            "average": subject_average,
            "name": subject.name,
            "assessments": [
                {"type": ag.assessment.type, "value": ag.grade.value, "coefficient": ag.assessment.coefficient} for ag
                in subject.assessments]
        }
        ue_total += subject_average * subject.coefficient
        ue_coefficient_sum += subject.coefficient

    ue_average = ue_total / ue_coefficient_sum
    return {"average": ue_average, "subjects": subject_averages}


def calculate_semester_average(teaching_units: Dict[str, TeachingUnit]) -> Dict[str, Any]:
    semester_total = 0
    semester_coefficient_sum = 0
    ue_averages = {}

    for teaching_unit_id, teaching_unit in teaching_units.items():
        ue_average_data = calculate_ue_average(teaching_unit.subjects)
        ue_averages[teaching_unit_id] = ue_average_data

        semester_total += ue_average_data["average"]
        semester_coefficient_sum += 1

    return {"average": semester_total / semester_coefficient_sum, "ues": ue_averages}


def calculate_averages(student_data: Dict[str, Any]) -> Dict[str, Any]:
    averages = {"semesters": {}}

    for semester_name, semester_data in student_data["semesters"].items():
        semester_average_data = calculate_semester_average(semester_data["ues"])
        averages["semesters"][semester_name] = semester_average_data

    return averages
