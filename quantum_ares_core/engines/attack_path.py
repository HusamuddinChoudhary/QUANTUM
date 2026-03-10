import networkx as nx
from typing import List, Dict, Any
from quantum_ares_core.graph.models import EngineResult, ViolationFinding

class AttackPathEngine:
    def validate(self, graph: nx.DiGraph) -> EngineResult:
        violations = []
        attack_path_edges = []
        
        entry_points = [n for n, d in graph.nodes(data=True) if d.get('zone') == 'PUBLIC']
        targets = [n for n, d in graph.nodes(data=True) if d.get('data_sensitivity') in ['HIGH', 'CRITICAL']]
        
        scored_paths = []
        
        for source in entry_points:
            for target in targets:
                if source == target: continue
                try:
                    # Find simple paths with a cutoff of 6
                    paths = list(nx.all_simple_paths(graph, source, target, cutoff=6))
                    for path in paths:
                        risk = self._calculate_path_risk(graph, path)
                        scored_paths.append((path, risk))
                except nx.NetworkXNoPath:
                    continue

        # Sort paths by risk (descending)
        scored_paths.sort(key=lambda x: x[1], reverse=True)
        top_paths = scored_paths[:10]
        
        counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        
        for path, risk in top_paths:
            severity = "LOW"
            if risk > 15: severity = "CRITICAL"
            elif risk > 8: severity = "HIGH"
            elif risk > 4: severity = "MEDIUM"
            
            counts[severity] += 1
            
            # Collect edges for frontend red pulsing
            for i in range(len(path) - 1):
                attack_path_edges.append((path[i], path[i+1]))
            
            violations.append(ViolationFinding(
                rule_id=f"AP-{severity[0]}",
                severity=severity,
                mitre_technique_id="T1190",
                cvss_score=min(10.0, risk / 2.0),
                affected_node_ids=path,
                description=f"Attack path: {' -> '.join(path)} | Risk score: {risk:.1f}",
                remediation_steps=[
                    f"Add auth to edge {path[i]}->{path[i+1]}" if not graph.edges[path[i], path[i+1]].get('auth_required') 
                    else f"Harden node {path[i]}" for i in range(len(path) - 1)
                ],
                compliance_clauses=["NIST-AC-3", "RBI-IT-7.2"]
            ))

        # Blast radius
        blast_radius_map = {}
        for node in graph.nodes():
            descendants = nx.descendants(graph, node)
            score = (len(descendants) / max(1, graph.number_of_nodes())) * 100
            blast_radius_map[node] = round(score, 1)

        # APS = max(0, 100 − (crit_paths×20 + high_paths×10 + med_paths×4))
        score = max(0, 100 - (counts["CRITICAL"] * 20 + counts["HIGH"] * 10 + counts["MEDIUM"] * 4))
        
        return EngineResult(
            engine_name="attack_path",
            score=float(score),
            violations=violations,
            metadata={
                "attack_path_edges": list(set(attack_path_edges)),
                "blast_radius": blast_radius_map,
                "counts": counts
            }
        )

    def _calculate_path_risk(self, G: nx.DiGraph, path: List[str]) -> float:
        risk = 0.0
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            edge_data = G.edges[u, v]
            source_data = G.nodes[u]
            target_data = G.nodes[v]
            
            weight = 1.0
            if not edge_data.get('auth_required'): weight *= 3
            if source_data.get('cvss_live', 0.0) > 7: weight *= 2
            
            weight *= (1 + target_data.get('cvss_live', 0.0) / 10)
            risk += weight
            
        return risk
