import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Organisation(Base):
    __tablename__ = "organisations"
    org_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    plan_tier = Column(String, default="free")
    blockchain_mode = Column(String, default="demo")
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organisations.org_id"))
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="ANALYST") # ADMIN, ANALYST, VIEWER
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class GraphRecord(Base):
    __tablename__ = "graphs"
    graph_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organisations.org_id"))
    infra_json = Column(JSONB)
    filename = Column(String)
    node_count = Column(Integer)
    edge_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Session(Base):
    __tablename__ = "sessions"
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    graph_id = Column(UUID(as_uuid=True), ForeignKey("graphs.graph_id"))
    org_id = Column(UUID(as_uuid=True), ForeignKey("organisations.org_id"))
    status = Column(String, default="PENDING") # PENDING, RUNNING, COMPLETE, FAILED
    duration_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class EngineResultRecord(Base):
    __tablename__ = "engine_results"
    result_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.session_id"))
    engine_name = Column(String)
    score = Column(Float)
    findings = Column(JSONB)
    metadata_json = Column(JSONB)
    completed_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_log"
    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.session_id"))
    action = Column(String)
    actor_id = Column(UUID(as_uuid=True))
    rule_id = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    report_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.session_id"))
    sha256_hash = Column(String)
    rsa_signature = Column(String)
    polygon_tx_hash = Column(String)
    evidence_bundle_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class PostureSnapshot(Base):
    __tablename__ = "posture_snapshots"
    snapshot_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organisations.org_id"))
    snapshot_time = Column(DateTime, default=datetime.utcnow)
    score = Column(Float)
    violation_counts = Column(JSONB)
