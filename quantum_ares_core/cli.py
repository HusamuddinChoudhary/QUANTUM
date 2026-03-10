import sys
import argparse
import json
from quantum_ares_core.graph.engine import GraphEngine
from quantum_ares_core.engines.zero_trust import ZeroTrustEngine
from quantum_ares_core.engines.quantum import QuantumEngine
from quantum_ares_core.engines.attack_path import AttackPathEngine
from quantum_ares_core.engines.supply_chain import SupplyChainEngine
from quantum_ares_core.engines.scoring import ScoringEngine
from quantum_ares_core.compliance.mapper import ComplianceEngine

def main():
    parser = argparse.ArgumentParser(description="QUANTUM-ARES Core CLI")
    parser.add_argument("command", choices=["validate", "report"], help="Action to perform")
    parser.add_argument("file", help="Infrastructure file (.json, .yaml, .tf)")
    
    args = parser.parse_args()
    
    engine = GraphEngine()
    zt = ZeroTrustEngine()
    qn = QuantumEngine()
    ap = AttackPathEngine()
    sc = SupplyChainEngine()
    se = ScoringEngine()
    ce = ComplianceEngine()
    
    try:
        G = engine.parse_file(args.file)
        
        # Run all engines
        zt_res = zt.validate(G)
        qn_res = qn.validate(G)
        ap_res = ap.validate(G)
        sc_res = sc.validate(G)
        
        all_violations = zt_res.violations + qn_res.violations + ap_res.violations + sc_res.violations
        ce_res = ce.validate(all_violations)
        
        final_scores = se.compute(zt_res, qn_res, ap_res, sc_res, ce_res)
        
        if args.command == "validate":
            print("\n" + "="*40)
            print(" QUANTUM-ARES VALIDATION RESULT")
            print("="*40)
            print(f" SECURITY INDEX:  {final_scores['security_index']} ({final_scores['color'].upper()})")
            print(f" Violations:      {len(all_violations)}")
            print("-"*40)
            print(f" Zero Trust:      {final_scores['zt_score']}")
            print(f" Quantum Risk:    {final_scores['qvi']} (lower is better)")
            print(f" Attack Path:     {final_scores['attack_path_score']}")
            print(f" Supply Chain:    {final_scores['supply_chain_score']}")
            print(f" Compliance:      {final_scores['compliance_score']}%")
            print("="*40 + "\n")
            
        elif args.command == "report":
            # Logic for saving PDF locally
            print("Report generation via CLI coming soon (PDF engine active).")
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
