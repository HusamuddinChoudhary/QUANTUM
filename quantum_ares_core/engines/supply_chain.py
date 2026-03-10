import os
import json
import networkx as nx
from typing import List, Dict, Any
from quantum_ares_core.graph.models import EngineResult, ViolationFinding

class SupplyChainEngine:
    def __init__(self):
        self.nvd_data = self._load_nvd()

    def _load_nvd(self):
        path = os.path.join(os.path.dirname(__file__), "..", "data", "nvd_snapshot.json")
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception:
            return []

    def validate(self, graph: nx.DiGraph) -> EngineResult:
        violations = []
        counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        sbom_components = []
        
        for node_id, data in graph.nodes(data=True):
            image = data.get('container_image')
            if image:
                parts = image.split(':')
                name = parts[0]
                version = parts[1] if len(parts) > 1 else "latest"
                
                sbom_components.append({
                    "name": name,
                    "version": version,
                    "type": "container",
                    "purl": f"pkg:docker/{name}@{version}"
                })
                
                # Match against NVD
                for cve in self.nvd_data:
                    if cve['component'] == name and (version == "latest" or cve['version'] == version):
                        cvss = cve['cvss_score']
                        severity = "LOW"
                        if cvss > 9.0: severity = "CRITICAL"
                        elif cvss > 7.0: severity = "HIGH"
                        elif cvss > 4.0: severity = "MEDIUM"
                        
                        counts[severity] += 1
                        
                        violations.append(ViolationFinding(
                            rule_id=cve['cve_id'],
                            severity=severity,
                            mitre_technique_id="T1195",
                            cvss_score=cvss,
                            affected_node_ids=[node_id],
                            description=f"Supply Chain Vulnerability: {cve['cve_id']} in {name}:{version}",
                            remediation_steps=[f"Update {name} to {cve['fix_version']}"],
                            compliance_clauses=["NIST-SA-12", "RBI-IT-11.1"]
                        ))

        # CycloneDX 1.5 SBOM
        sbom = {
            "bomFormat": "CycloneDX",
            "specVersion": "1.5",
            "components": sbom_components
        }

        # Score: SCS = max(0, 100 − (crit_cves×20 + high_cves×8 + med_cves×3))
        score = max(0, 100 - (counts["CRITICAL"] * 20 + counts["HIGH"] * 8 + counts["MEDIUM"] * 3))
        
        return EngineResult(
            engine_name="supply_chain",
            score=float(score),
            violations=violations,
            metadata={
                "sbom": json.dumps(sbom),
                "cve_counts": counts
            }
        )
