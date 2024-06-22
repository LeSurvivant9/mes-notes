import re
from io import BytesIO
from typing import List, Dict, Optional

import pdfplumber
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app: FastAPI = FastAPI()


def find_student_column(rows: List[List[str]]) -> Optional[int]:
    """
    Find the column index containing the student number using regex.
    """
    for row in rows:
        for index, cell in enumerate(row):
            if cell and re.match(r"^2\d{7}$", cell):
                return index
    return None


def extract_data_from_pdf(file: bytes) -> List[Dict[str, Optional[str]]]:
    data = []
    with BytesIO(file) as pdf_buffer:
        with pdfplumber.open(pdf_buffer) as pdf:
            for page in pdf.pages:
                table = page.extract_table()
                if not table:
                    continue
                student_column = find_student_column(table)
                if student_column is None:
                    continue
                for row in table:
                    if not row[student_column] or not re.match(r"^2\d{7}$", row[student_column]):
                        continue
                    student_number = row[student_column]
                    note = None
                    for index, cell in enumerate(row):
                        if index != student_column and cell and re.match(r"^\d+(\.\d+)?$", cell):
                            note = cell
                            break
                    if note is not None:
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
