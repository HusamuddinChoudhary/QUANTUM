from typing import List, Dict, Any
from quantum_ares_core.graph.models import EngineResult, ViolationFinding

NIST_MAP = {
    "ZT-001": "AC-3 (Access Enforcement)", 
    "ZT-003": "SC-28 (Protection at Rest)",
    "ZT-004": "IA-2 (MFA)", 
    "ZT-005": "AC-6 (Least Privilege)",
    "T1046": "SI-3 (Malicious Code Protection)", 
    "T1530": "SC-28 (Protection at Rest)",
    "T1190": "SI-2 (Flaw Remediation)", 
    "T1195": "SA-12 (Supply Chain Risk)"
}

DPDP_MAP = {
    "ZT-003": "Section 8(4) - Data Protection by Design",
    "ZT-005": "Section 6(1) - Purpose Limitation",
    "T1530": "Section 8(3) - Data Minimization",
    "T1195": "Section 9 - Significant Data Fiduciaries",
    "ZT-001": "Section 8(5) - Storage Limitation"
}

RBI_MAP = {
    "ZT-001": "RBI-IT-7.2 Access Control",
    "ZT-003": "RBI-IT-9.1 Encryption Standards", 
    "ZT-004": "RBI-IT-7.3 Privileged Access",
    "T1195": "RBI-IT-11.1 Third Party Risk"
}

class ComplianceEngine:
    def validate(self, all_violations: List[ViolationFinding]) -> EngineResult:
        # Framework control counts (total rules checked/mappable)
        nist_total = 50
        dpdp_total = 35
        rbi_total = 25
        
        nist_violated = set()
        dpdp_violated = set()
        rbi_violated = set()
        
        for v in all_violations:
            clauses = []
            
            # Lookup NIST
            nist_clause = NIST_MAP.get(v.rule_id) or NIST_MAP.get(v.mitre_technique_id)
            if nist_clause:
                clauses.append(f"NIST:{nist_clause}")
                nist_violated.add(nist_clause)
                
            # Lookup DPDP
            dpdp_clause = DPDP_MAP.get(v.rule_id) or DPDP_MAP.get(v.mitre_technique_id)
            if dpdp_clause:
                clauses.append(f"DPDP:{dpdp_clause}")
                dpdp_violated.add(dpdp_clause)
                
            # Lookup RBI
            rbi_clause = RBI_MAP.get(v.rule_id) or RBI_MAP.get(v.mitre_technique_id)
            if rbi_clause:
                clauses.append(f"RBI:{rbi_clause}")
                rbi_violated.add(rbi_clause)
                
            v.compliance_clauses = clauses

        nist_score = 100 * (1 - len(nist_violated) / nist_total)
        dpdp_score = 100 * (1 - len(dpdp_violated) / dpdp_total)
        rbi_score = 100 * (1 - len(rbi_violated) / rbi_total)
        
        avg_score = (nist_score + dpdp_score + rbi_score) / 3
        
        return EngineResult(
            engine_name="compliance",
            score=round(avg_score, 1),
            violations=[], # Results reflected in individual engine violations
            metadata={
                "nist_percent": round(nist_score, 1),
                "dpdp_percent": round(dpdp_score, 1),
                "rbi_percent": round(rbi_score, 1)
            }
        )
