import json
import os
import networkx as nx
from typing import List
from quantum_ares_core.graph.models import EngineResult, ViolationFinding

class ZeroTrustEngine:
    def __init__(self):
        self.rules = self._load_rules()

    def _load_rules(self):
        path = os.path.join(os.path.dirname(__file__), "..", "rules", "zt-rules-v1.0.json")
        with open(path, "r") as f:
            return json.load(f)

    def validate(self, graph: nx.DiGraph) -> EngineResult:
        violations = []
        counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        
        # evaluation context
        eval_locals = {"G": graph, "nx": nx, "any": any, "all": all}
        
        for rule in self.rules:
            try:
                # eval the check string
                affected_node_ids = eval(rule["check"], {"__builtins__": {}}, eval_locals)
                
                if affected_node_ids:
                    # affected_node_ids might be a list of node IDs or a list of edge tuples
                    # normalise to node IDs
                    node_ids = []
                    for item in affected_node_ids:
                        if isinstance(item, tuple):
                            node_ids.extend(list(item))
                        else:
                            node_ids.append(item)
                    
                    node_ids = list(set(node_ids)) # unique
                    
                    violations.append(ViolationFinding(
                        rule_id=rule["rule_id"],
                        severity=rule["severity"],
                        mitre_technique_id=rule["mitre_id"],
                        cvss_score=rule["cvss_base"],
                        affected_node_ids=node_ids,
                        description=rule["description"],
                        remediation_steps=rule["remediation"],
                        compliance_clauses=rule.get("compliance", [])
                    ))
                    counts[rule["severity"]] += 1
            except Exception as e:
                print(f"Error evaluating rule {rule['rule_id']}: {str(e)}")

        # Score formula: ZTS = max(0, 100 − (CRITICAL×15 + HIGH×8 + MEDIUM×3 + LOW×1))
        score = max(0, 100 - (counts["CRITICAL"] * 15 + counts["HIGH"] * 8 + counts["MEDIUM"] * 3 + counts["LOW"] * 1))
        
        return EngineResult(
            engine_name="zero_trust",
            score=float(score),
            violations=violations,
            metadata={"counts": counts}
        )
