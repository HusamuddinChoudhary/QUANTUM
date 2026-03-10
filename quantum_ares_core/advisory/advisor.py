from typing import Dict, Any, Optional
from quantum_ares_core.advisory.tier1_rules import match_tier1
from quantum_ares_core.advisory.tier2_semantic import SemanticAdvisor

class AIAdvisor:
    def __init__(self):
        self.semantic = SemanticAdvisor()

    def answer(self, question: str, session_context: Dict[str, Any]) -> Dict[str, Any]:
        # Try Tier 1
        tier1_result = match_tier1(question, session_context)
        if tier1_result:
            return tier1_result
            
        # Fallback to Tier 2
        try:
            return self.semantic.search(question)
        except Exception as e:
            return {
                "answer": f"I encountered an error while searching for a semantic answer: {str(e)}",
                "tier": 2,
                "badge": "AI Support 🤖",
                "sources": []
            }
