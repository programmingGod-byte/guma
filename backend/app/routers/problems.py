from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemResponse, ProblemListResponse, ProblemCreate

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("/", response_model=List[ProblemListResponse])
def list_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()

@router.get("/{slug}", response_model=ProblemResponse)
def get_problem(slug: str, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.post("/", response_model=ProblemResponse)
def create_problem(data: ProblemCreate, db: Session = Depends(get_db)):
    test_cases_json = [tc.dict() for tc in data.test_cases]
    
    problem = Problem(
        title=data.title,
        slug=data.slug,
        description=data.description,
        difficulty=data.difficulty,
        topic=data.topic,
        test_cases=test_cases_json
    )
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem

@router.put("/{slug}", response_model=ProblemResponse)
def update_problem(slug: str, data: ProblemCreate, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem.title = data.title
    problem.slug = data.slug
    problem.description = data.description
    problem.difficulty = data.difficulty
    problem.topic = data.topic
    problem.test_cases = [tc.dict() for tc in data.test_cases]
    
    db.commit()
    db.refresh(problem)
    return problem

@router.delete("/{slug}")
def delete_problem(slug: str, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    db.delete(problem)
    db.commit()
    return {"message": "Problem deleted successfully"}