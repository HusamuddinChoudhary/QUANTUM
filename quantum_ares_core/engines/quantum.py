import networkx as nx
from typing import List, Dict, Any
from quantum_ares_core.graph.models import EngineResult, ViolationFinding

VULNERABLE_ALGORITHMS = {
    "RSA": {"vulnerability": 1.0, "broken_by": "Shor's Algorithm", "replacement": "ML-KEM-768 (NIST FIPS 203)"},
    "RSA-2048": {"vulnerability": 1.0, "broken_by": "Shor's Algorithm", "replacement": "ML-KEM-768 (NIST FIPS 203)"},
    "ECC": {"vulnerability": 0.9, "broken_by": "Shor's Algorithm", "replacement": "ML-DSA-65 (NIST FIPS 204)"},
    "AES-128": {"vulnerability": 0.3, "broken_by": "Grover's Algorithm (halved)", "replacement": "AES-256"},
    "DES": {"vulnerability": 1.0, "replacement": "AES-256 or ChaCha20"},
    "NONE": {"vulnerability": 1.0, "replacement": "AES-256-GCM"},
}

SAFE_ALGORITHMS = ["AES-256", "TLS-1.3", "ML-KEM-768", "CHACHA20"]

class QuantumEngine:
    def validate(self, graph: nx.DiGraph) -> EngineResult:
        violations = []
        node_details = []
        qvi_sum = 0.0
        sensitivity_weight_map = {"CRITICAL": 1.0, "HIGH": 0.8, "MEDIUM": 0.5, "LOW": 0.2}
        
        for node_id, data in graph.nodes(data=True):
            enc = data.get('encryption_type', 'NONE')
            sensitivity = data.get('data_sensitivity', 'LOW')
            retention = data.get('retention_years', 1)
            
            s_weight = sensitivity_weight_map.get(sensitivity, 0.2)
            
            # Find vulnerability
            vulnerability = 0.0
            replacement = "N/A"
            for key, val in VULNERABLE_ALGORITHMS.items():
                if key in enc:
                    vulnerability = val['vulnerability']
                    replacement = val['replacement']
                    break
            
            if enc in SAFE_ALGORITHMS:
                vulnerability = 0.0
                replacement = "Already quantum-safe"

            # QVI = min(100, sensitivity_weight × encryption_vulnerability × 100 × (1 + node.retention_years × 0.05))
            qvi = min(100.0, s_weight * vulnerability * 100 * (1 + retention * 0.05))
            qvi_sum += qvi
            
            # risk_year = 2025 + int((100 − QVI_node) / 10)
            risk_year = 2025 + int((100 - qvi) / 10)
            
            node_info = {
                "node_id": node_id,
                "qvi": round(qvi, 1),
                "risk_year": risk_year,
                "algorithm": enc,
                "recommendation": replacement
            }
            node_details.append(node_info)
            
            # Generate violation for any node with QVI > 50
            if qvi > 50:
                severity = "MEDIUM"
                if qvi > 85: severity = "CRITICAL"
                elif qvi > 65: severity = "HIGH"
                
                violations.append(ViolationFinding(
                    rule_id="Q-VULN",
                    severity=severity,
                    mitre_technique_id="T1600",
                    cvss_score=qvi / 10.0,
                    affected_node_ids=[node_id],
                    description=f"Node {node_id} is vulnerable to quantum decryption ({enc})",
                    remediation_steps=[f"Migrate to {replacement}"],
                    compliance_clauses=["NIST-SC-28", "DPDP-S8"]
                ))

        node_count = graph.number_of_nodes()
        aggregate_qvi = qvi_sum / node_count if node_count > 0 else 0.0
        score = max(0.0, 100.0 - aggregate_qvi)
        
        return EngineResult(
            engine_name="quantum",
            score=round(score, 1),
            violations=violations,
            metadata={
                "aggregate_qvi": round(aggregate_qvi, 1),
                "hndl_timeline": node_details
            }
        )
