from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from db.database import Base
import uuid

class Document(Base):
    __tablename__ = "documents"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title      = Column(String, nullable=True)
    domain     = Column(String, nullable=True)
    language   = Column(String, default="Tamil")
    source     = Column(String, default="Manual")
    license    = Column(String, default="CC BY")
    raw_text   = Column(Text)
    clean_text = Column(Text)
    tokens     = Column(Text)
    pos        = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class Job(Base):
    __tablename__ = "jobs"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status      = Column(String, default="processing")
    document_id = Column(String, nullable=True)
    steps       = Column(Text, default="{}")
    created_at  = Column(DateTime, server_default=func.now())