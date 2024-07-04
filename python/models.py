import enum

from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum, Float, Index
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Department(Base):
    __tablename__ = 'Department'

    id: str = Column(String, primary_key=True, default='uuid_generate_v4()')
    name: str = Column(String(255), unique=True)

    teachingUnits = relationship("TeachingUnit", back_populates="department")
    students = relationship("Student", back_populates="department")


class TeachingUnit(Base):
    __tablename__ = 'TeachingUnit'

    id: str = Column(String, primary_key=True, default='uuid_generate_v4()')
    name: str = Column(String(255))
    semester: int = Column(Integer)
    departmentId: str = Column(String, ForeignKey('Department.id'))

    department = relationship("Department", back_populates="teachingUnits")
    subjects = relationship("Subject", back_populates="teachingUnit")

    __table_args__ = (Index('teaching_unit_index_0', 'departmentId'),)


class Subject(Base):
    __tablename__ = 'Subject'

    id: str = Column(String, primary_key=True, default='uuid_generate_v4()')
    name: str = Column(String(255))
    coefficient: int = Column(Integer)
    ccCoefficient: int = Column(Integer, nullable=True)
    tpCoefficient: int = Column(Integer, nullable=True)
    examCoefficient: int = Column(Integer, nullable=True)

    teachingUnitId: str = Column(String, ForeignKey('TeachingUnit.id'))
    teachingUnit = relationship("TeachingUnit", back_populates="subjects")
    assessments = relationship("Assessment", back_populates="subject")

    __table_args__ = (Index('subject_index_0', 'teachingUnitId'),)


class AssessmentType(enum.Enum):
    CC = "CC"
    TP = "TP"
    EXAM = "EXAM"
    CATCH = "CATCH"


class Assessment(Base):
    __tablename__ = 'Assessment'

    id: str = Column(String, primary_key=True, default='uuid_generate_v4()')
    type: AssessmentType = Column(Enum(AssessmentType))
    isCatchUp: bool = Column(Boolean, default=False)
    date: str = Column(DateTime, default='now()')
    coefficient: int = Column(Integer)
    fileName: str = Column(String(255))
    period: int = Column(Integer, nullable=True)

    subjectId: str = Column(String, ForeignKey('Subject.id'))
    subject = relationship("Subject", back_populates="assessments")
    grades = relationship("Grade", back_populates="assessment")

    __table_args__ = (Index('assessment_index_0', 'subjectId'),)


class Grade(Base):
    __tablename__ = 'Grade'

    id: str = Column(String, primary_key=True, default='uuid_generate_v4()')
    value: float = Column(Float)
    studentNumber: str = Column(String, ForeignKey('Student.studentNumber'))
    assessmentId: str = Column(String, ForeignKey('Assessment.id'))

    student = relationship("Student", back_populates="grades")
    assessment = relationship("Assessment", back_populates="grades")

    __table_args__ = (
        Index('grade_index_0', 'studentNumber'),
        Index('grade_index_1', 'assessmentId'),
    )


class Student(Base):
    __tablename__ = 'Student'

    studentNumber: str = Column(String, primary_key=True)
    lastName: str = Column(String(50))
    firstName: str = Column(String(50))
    entryYear: int = Column(Integer, nullable=True)
    level: int = Column(Integer)
    departmentId: str = Column(String, ForeignKey('Department.id'))

    department = relationship("Department", back_populates="students")
    grades = relationship("Grade", back_populates="student")

    __table_args__ = (
        Index('student_index_0', 'studentNumber'),
        Index('student_index_1', 'departmentId'),
    )
