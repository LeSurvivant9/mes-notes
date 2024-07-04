import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from sqlalchemy.orm import sessionmaker

from python.models import Grade, Assessment, Subject


def get_all_grades_with_informations(session: Session, student_number: str):
    return (session.query(Grade)
            .filter_by(studentNumber=student_number)
            .options(
        joinedload(Grade.assessment)
        .joinedload(Assessment.subject)
        .joinedload(Subject.teachingUnit)
    )
            .order_by(Grade.id.asc())
            .all())


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
session_local = SessionLocal()
grades = get_all_grades_with_informations(session_local, "22201849")
for grade in grades:
    print(grades)
