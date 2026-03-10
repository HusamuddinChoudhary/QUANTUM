import re
import hcl2
from typing import Any, Dict
from quantum_ares_core.graph.models import InfraGraph, InfraNode, InfraEdge

def parse(filepath: str) -> InfraGraph:
    """
    3-tier Terraform parser:
    1. full hcl2 parse
    2. regex extraction for fallback
    3. minimal return on failure
    """
    nodes = []
    edges = []
    
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Tier 1: HCL2 Parse
        try:
            data = hcl2.loads(content)
            # Basic extraction from HCL2 structure (simplified for MVP)
            for resource_type, resources in data.get('resource', {}).items():
                for name, props in resources[0].items():
                    node_type = "server" # Default mapping
                    if "db" in resource_type or "aws_db" in resource_type: node_type = "database"
                    elif "lb" in resource_type or "aws_lb" in resource_type: node_type = "load_balancer"
                    
                    nodes.append(InfraNode(
                        id=f"{resource_type}.{name}",
                        name=name,
                        type=node_type,
                        zone="PRIVATE", # Default
                        encryption_type="AES-256",
                        data_sensitivity="MEDIUM"
                    ))
        except Exception:
            # Tier 2: Regex Fallback
            resource_pattern = r'resource\s+"([^"]+)"\s+"([^"]+)"'
            matches = re.findall(resource_pattern, content)
            for r_type, r_name in matches:
                nodes.append(InfraNode(
                    id=f"{r_type}.{r_name}",
                    name=r_name,
                    type="server",
                    zone="PRIVATE",
                    encryption_type="NONE",
                    data_sensitivity="LOW"
                ))
                
        # Tier 3: Minimal return if nothing found
        if not nodes:
            nodes.append(InfraNode(
                id="manual-entry",
                name="Imported Resource",
                type="server",
                zone="DMZ",
                encryption_type="NONE",
                data_sensitivity="LOW"
            ))
            
    except Exception as e:
        print(f"Terraform parsing warning: {str(e)}")
        
    return InfraGraph(nodes=nodes, edges=edges)
