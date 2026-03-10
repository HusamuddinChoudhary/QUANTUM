from typing import Literal, List, Optional, Dict, Any
from pydantic import BaseModel

class InfraNode(BaseModel):
    id: str
    name: str
    type: Literal["server", "database", "api", "iam_role", "load_balancer",
                  "firewall", "cache", "message_queue", "container"]
    zone: Literal["PUBLIC", "DMZ", "PRIVATE", "RESTRICTED"]
    encryption_type: str  # "RSA-2048","AES-256","AES-128","ECC","NONE","TLS-1.3"
    data_sensitivity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    iam_roles: List[str] = []
    ports: List[int] = []
    container_image: Optional[str] = None  # e.g. "nginx:1.20.1"
    retention_years: int = 1
    cvss_live: float = 0.0  # injected by GraphEngine from NVD

class InfraEdge(BaseModel):
    source_id: str
    target_id: str
    protocol: Literal["HTTP", "HTTPS", "TCP", "RDP", "SSH", "GRPC", "AMQP"]
    port: int
    auth_required: bool
    trust_level: Literal["UNTRUSTED", "LOW", "MEDIUM", "HIGH"]

class InfraGraph(BaseModel):
    nodes: List[InfraNode]
    edges: List[InfraEdge]

class ViolationFinding(BaseModel):
    rule_id: str
    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    mitre_technique_id: str
    cvss_score: float
    affected_node_ids: List[str]
    description: str
    remediation_steps: List[str]
    compliance_clauses: List[str] = []

class EngineResult(BaseModel):
    engine_name: str
    score: float  # 0-100
    violations: List[ViolationFinding]
    metadata: Dict[str, Any] = {}
