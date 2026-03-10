import yaml
from quantum_ares_core.graph.models import InfraGraph

def parse(filepath: str) -> InfraGraph:
    with open(filepath, 'r') as f:
        data = yaml.safe_load(f)
    return InfraGraph(**data)
