from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class SubmissionCreate(BaseModel):
    problem_id: UUID
    code: str
    language: str

class SubmissionResponse(BaseModel):
    id: UUID
    problem_id: UUID
    user_id: UUID
    code: str
    language: str
    verdict: str
    runtime_ms: Optional[int]
    memory_kb: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True