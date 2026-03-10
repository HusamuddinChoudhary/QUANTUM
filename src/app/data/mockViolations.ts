export interface Violation {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  mitreId: string;
  mitreName: string;
  node: string;
  remediation: string;
  engine: string;
}

export const mockViolations: Violation[] = [
  { id: 'ZT-001', severity: 'CRITICAL', mitreId: 'T1190', mitreName: 'Initial Access', node: 'WebServer-01', remediation: 'Enable WAF', engine: 'Zero-Trust' },
  { id: 'ZT-012', severity: 'HIGH', mitreId: 'T1021', mitreName: 'Lateral Movement', node: 'AppServer-01', remediation: 'Enforce MFA', engine: 'Zero-Trust' },
  { id: 'QR-003', severity: 'HIGH', mitreId: '—', mitreName: '—', node: 'Database-01', remediation: 'Migrate to AES-256', engine: 'Quantum Risk' },
  { id: 'SC-007', severity: 'MEDIUM', mitreId: '—', mitreName: '—', node: 'Redis-Cache', remediation: 'Patch CVE-2024-1234', engine: 'Supply Chain' },
  { id: 'ZT-033', severity: 'MEDIUM', mitreId: 'T1078', mitreName: 'Valid Accounts', node: 'Load-Balancer', remediation: 'Rotate API keys', engine: 'Zero-Trust' },
  { id: 'CP-002', severity: 'LOW', mitreId: '—', mitreName: '—', node: 'All Nodes', remediation: 'Add audit logging', engine: 'Compliance' },
  { id: 'ZT-019', severity: 'CRITICAL', mitreId: 'T1071', mitreName: 'C2 Channel', node: 'WebServer-02', remediation: 'Block outbound 443', engine: 'Zero-Trust' },
  { id: 'QR-009', severity: 'HIGH', mitreId: '—', mitreName: '—', node: 'AppServer-01', remediation: 'Replace RSA-2048', engine: 'Quantum Risk' },
];
