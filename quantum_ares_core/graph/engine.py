import os
import json
import networkx as nx
from typing import Dict, Any
from quantum_ares_core.graph.models import InfraGraph
from quantum_ares_core.parsers import json_parser, yaml_parser, terraform_parser

class GraphEngine:
    def __init__(self):
        self.nvd_data = self._load_nvd()

    def _load_nvd(self):
        path = os.path.join(os.path.dirname(__file__), "..", "data", "nvd_snapshot.json")
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception:
            return []

    def parse_file(self, filepath: str) -> nx.DiGraph:
        ext = os.path.splitext(filepath)[1].lower()
        
        if ext == '.json':
            infra = json_parser.parse(filepath)
        elif ext in ['.yaml', '.yml']:
            infra = yaml_parser.parse(filepath)
        elif ext == '.tf':
            infra = terraform_parser.parse(filepath)
        else:
            raise ValueError(f"Unsupported file extension: {ext}")
            
        return self.build_graph(infra)

    def build_graph(self, infra: InfraGraph) -> nx.DiGraph:
        G = nx.DiGraph()
        
        # Add Nodes
        for node in infra.nodes:
            # Enrich with NVD data
            cvss = 0.0
            if node.container_image:
                parts = node.container_image.split(':')
                name = parts[0]
                version = parts[1] if len(parts) > 1 else ""
                
                scores = [item['cvss_score'] for item in self.nvd_data 
                         if item['component'] == name and (not version or item['version'] == version)]
                if scores:
                    cvss = max(scores)
            
            node.cvss_live = cvss
            
            G.add_node(node.id, **node.model_dump())
            
        # Add Edges
        for edge in infra.edges:
            G.add_edge(edge.source_id, edge.target_id, **edge.model_dump())
            
        if G.number_of_nodes() > 5000:
            print("WARNING: Node count > 5000. Flagging for Neo4j routing.")
            
        return G
