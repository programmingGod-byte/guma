from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List

class TestCase(BaseModel):
    input: str
    expected_output: str

class ProblemCreate(BaseModel):
    title: str
    slug: str
    description: str
    difficulty: str
    topic: Optional[str] = None
    test_cases: List[TestCase]

class ProblemResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    description: str
    difficulty: str
    topic: Optional[str]
    test_cases: List[TestCase]
    created_at: datetime

    class Config:
        from_attributes = True

class ProblemListResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    difficulty: str
    topic: Optional[str]

    class Config:
        from_attributes = True