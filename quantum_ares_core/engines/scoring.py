from typing import Dict, Any, List
from quantum_ares_core.graph.models import EngineResult

class ScoringEngine:
    def compute(self, zt: EngineResult, quantum: EngineResult, 
                ap: EngineResult, sc: EngineResult, 
                compliance: EngineResult) -> Dict[str, Any]:
        
        qvi = quantum.metadata.get("aggregate_qvi", 0)
        
        # security_index = (
        #   zt_score * 0.35 +
        #   (100 - qvi) * 0.20 +
        #   ap_score * 0.25 +
        #   sc_score * 0.10 +
        #   compliance_score * 0.10
        # )
        
        security_index = (
            zt.score * 0.35 +
            (100 - qvi) * 0.20 +
            ap.score * 0.25 +
            sc.score * 0.10 +
            compliance.score * 0.10
        )
        
        color = "red"
        if security_index >= 80: color = "green"
        elif security_index >= 60: color = "yellow"
        elif security_index >= 40: color = "orange"
        
        return {
            "security_index": round(security_index, 1),
            "zt_score": round(zt.score, 1),
            "qvi": round(qvi, 1),
            "attack_path_score": round(ap.score, 1),
            "supply_chain_score": round(sc.score, 1),
            "compliance_score": round(compliance.score, 1),
            "color": color
        }
