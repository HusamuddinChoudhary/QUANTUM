import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../../lib/api';

interface GraphState {
    sessionName: string;
    sessionId: string | null;
    nodes: any[];
    edges: any[];
    violations: any[];
    violationDetails: any[];
    qviDetails: any[];
    scores: {
        zeroTrust: number;
        quantumVuln: number;
        attackPath: number;
        supplyChain: number;
        compliance: number;
    };
    metadata: any;
}

interface GraphContextType extends GraphState {
    loadSession: (sessionId: string) => Promise<void>;
    refreshScores: () => Promise<void>;
    loadScenario: (name: string) => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<GraphState>({
        sessionName: 'No Session Selected',
        sessionId: null,
        nodes: [],
        edges: [],
        violations: [],
        violationDetails: [],
        qviDetails: [],
        scores: { zeroTrust: 0, quantumVuln: 0, attackPath: 0, supplyChain: 0, compliance: 0 },
        metadata: {}
    });

    const loadSession = useCallback(async (id: string) => {
        try {
            const res = await api.get(`/sessions/${id}`);
            const data = res.data;
            setState({
                sessionId: id,
                sessionName: data.name || 'Validation Session',
                nodes: data.graph?.nodes || [],
                edges: data.graph?.edges || [],
                violations: data.violations || [],
                violationDetails: data.violations?.map((v: any) => ({
                    id: v.rule_id,
                    severity: v.severity,
                    mitreId: v.mitre_id || '—',
                    mitreName: v.mitre_name || '—',
                    node: v.node_id,
                    engine: v.engine,
                    remediation: v.remediation
                })) || [],
                qviDetails: data.qvi_results?.map((q: any) => ({
                    node: q.node_id,
                    algo: q.algorithm,
                    qvi: q.qvi_score,
                    rec: q.recommendation,
                    priority: q.priority
                })) || [],
                scores: {
                    zeroTrust: data.scores?.zt_score || 0,
                    quantumVuln: data.scores?.qvi || 0,
                    attackPath: data.scores?.attack_path_score || 0,
                    supplyChain: data.scores?.supply_chain_score || 0,
                    compliance: data.scores?.compliance_score || 0,
                },
                metadata: data.metadata || {}
            });
        } catch (error) {
            console.error('Failed to load session from backend', error);
        }
    }, []);

    const refreshScores = useCallback(async () => {
        if (state.sessionId) {
            await loadSession(state.sessionId);
        }
    }, [state.sessionId, loadSession]);

    const loadScenario = useCallback((name: string) => {
        // Placeholder for legacy local scenario loading if needed
        console.log('Switching scenario to:', name);
    }, []);

    return (
        <GraphContext.Provider value={{ ...state, loadSession, refreshScores, loadScenario }}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraphContext() {
    const context = useContext(GraphContext);
    if (context === undefined) {
        throw new Error('useGraphContext must be used within a GraphProvider');
    }
    return context;
}
