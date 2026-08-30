from sqlalchemy import Column, String, DateTime, Text, Enum, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid
import datetime

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    problem_id = Column(UUID(as_uuid=True), ForeignKey("problems.id"), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String(20), nullable=False)
    verdict = Column(Enum("pending", "accepted", "wrong_answer", "time_limit", "runtime_error", name="verdict_enum"), default="pending")
    runtime_ms = Column(Integer)
    memory_kb = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)