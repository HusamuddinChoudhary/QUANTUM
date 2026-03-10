from rapidfuzz import fuzz
from typing import Dict, Any, Optional

TIER1_TEMPLATES = [
    {
        "keywords": ["critical", "what are critical", "highest risk"],
        "response": "The highest risk findings include {top_violations}. Total of {crit_count} Critical issues detected.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["quantum", "qvi", "hndl", "harvest", "decryption"],
        "response": "HNDL risk: nodes with RSA/ECC encryption are vulnerable to quantum decryption by 2029-2032. Migrating to ML-KEM-768 (NIST FIPS 203) is recommended for your {node_counts} affected nodes.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["compliance", "dpdp", "nist", "rbi"],
        "response": "Overall compliance score is {comp_score}%. Breakdown: NIST ({nist}%), DPDP ({dpdp}%), RBI ({rbi}%).",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["attack path", "lateral movement", "hops", "pivoting"],
        "response": "The analyzed attack paths show vulnerability starting from PUBLIC zones. Top path involves {top_path_hops} hops reaching {target_node}.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["supply chain", "cve", "sbom", "container", "vulnerability"],
        "response": "Supply chain analysis detected {cve_count} vulnerabilities. Critical CVEs found in: {crit_components}.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["score", "security index", "why", "explain the score"],
        "response": "Your Security Index of {score} is calculated based on Zero-Trust (35%), Quantum (20%), Attack Path (25%), Supply Chain (10%), and Compliance (10%). Highest negative impact comes from {lowest_engine}.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["fix", "remediate", "how to improve", "remediation"],
        "response": "Priority remediation steps: 1. {fix1}, 2. {fix2}, 3. {fix3}.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["blockchain", "polygon", "anchoring", "proof", "tamper"],
        "response": "Report SHA-256 is anchored on Polygon Amoy testnet. Verify at polygonscan.com with tx hash. It is mathematically tamper-proof.",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["zero trust", "zt", "never trust", "principles"],
        "response": "Zero-Trust = 'never trust, always verify'. No implicit trust by network zone. Each connection requires explicit auth. (NIST SP 800-207).",
        "source": "Rule Engine",
        "tier": 1
    },
    {
        "keywords": ["rsa", "ecc", "asymmetric", "deprecated"],
        "response": "RSA-2048 and ECC are broken by Shor's algorithm on a quantum computer. NIST FIPS 203/204 finalised August 2024. Plan migration within 18 months.",
        "source": "Rule Engine",
        "tier": 1
    }
]

def match_tier1(question: str, session_context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    best_score = 0
    best_template = None
    
    q_lower = question.lower()
    
    for template in TIER1_TEMPLATES:
        keywords_str = " ".join(template["keywords"])
        score = fuzz.partial_ratio(q_lower, keywords_str)
        if score > best_score and score >= 75:
            best_score = score
            best_template = template
            
    if best_template:
        response = best_template["response"].format(**self_generate_placeholders(session_context))
        return {
            "answer": response,
            "tier": 1,
            "badge": "Rule Engine ⚡",
            "source": best_template["source"]
        }
    return None

def self_generate_placeholders(ctx: Dict[str, Any]) -> Dict[str, Any]:
    # ctx should contain engine scores and statistics
    # Use defaults if context is empty
    return {
        "top_violations": ctx.get("top_violations", "administrative access exposures"),
        "crit_count": ctx.get("crit_count", 0),
        "node_counts": ctx.get("q_node_count", 0),
        "comp_score": ctx.get("compliance_score", 0),
        "nist": ctx.get("nist_percent", 0),
        "dpdp": ctx.get("dpdp_percent", 0),
        "rbi": ctx.get("rbi_percent", 0),
        "top_path_hops": ctx.get("top_path_hops", 0),
        "target_node": ctx.get("target_node", "sensitive database"),
        "cve_count": ctx.get("cve_count", 0),
        "crit_components": ctx.get("crit_components", "nginx, log4j"),
        "score": ctx.get("security_index", 0),
        "lowest_engine": ctx.get("lowest_engine", "Zero-Trust"),
        "fix1": ctx.get("fix1", "Implement MFA"),
        "fix2": ctx.get("fix2", "Update container images"),
        "fix3": ctx.get("fix3", "Migrate to Post-Quantum Crypto")
    }
