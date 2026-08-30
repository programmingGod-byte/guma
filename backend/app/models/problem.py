from sqlalchemy import Column, String, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base
import uuid
import datetime

class Problem(Base):
    __tablename__ = "problems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(Enum("easy", "medium", "hard", name="difficulty_enum"), nullable=False)
    topic = Column(String(50))
    test_cases = Column(JSONB)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)