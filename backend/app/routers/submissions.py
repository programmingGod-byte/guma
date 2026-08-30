from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.submission import Submission
from app.models.problem import Problem
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.dependencies import get_current_user
from app.services.judge import judge_submission
from app.services.ai_service import get_interview_hint
import time

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/", response_model=SubmissionResponse)
def create_submission(
    data: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == data.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    submission = Submission(
        user_id=current_user.id,
        problem_id=data.problem_id,
        code=data.code,
        language=data.language,
        verdict="pending"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    start = time.time()
    verdict = judge_submission(data.code, data.language, problem.test_cases)
    runtime_ms = int((time.time() - start) * 1000)

    submission.verdict = verdict
    submission.runtime_ms = runtime_ms
    db.commit()
    db.refresh(submission)

    return submission

@router.get("/me", response_model=list[SubmissionResponse])
def get_my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Submission).filter(Submission.user_id == current_user.id).all()

from app.services.ai_service import get_interview_hint

@router.post("/{submission_id}/hint")
def get_hint(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    problem = db.query(Problem).filter(Problem.id == submission.problem_id).first()

    hint = get_interview_hint(
        problem.title,
        problem.description,
        submission.code,
        submission.verdict
    )

    return {"hint": hint}

from pydantic import BaseModel
class AnalyzeRequest(BaseModel):
    problem_id: str
    code: str
    language: str

from app.services.ai_service import analyze_code_with_ai

@router.post("/analyze")
def analyze_code(
    data: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == data.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    analysis = analyze_code_with_ai(
        problem.title, 
        problem.description, 
        str(problem.test_cases), 
        data.code
    )
    return {"analysis": analysis}