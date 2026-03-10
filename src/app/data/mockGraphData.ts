export interface GraphNode {
  id: string;
  label: string;
  zone: 'PUBLIC' | 'DMZ' | 'PRIVATE';
  cvss: number;
}

export interface Violation {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  mitreId: string;
  mitreName: string;
  node: string;
  remediation: string;
  engine: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  attackPath?: boolean;
}

export interface GraphScenario {
  nodes: GraphNode[];
  edges: GraphEdge[];
  violations: Record<string, string[]>;
  violationDetails: Violation[];
}

export function generateScenario(scenarioName: string): GraphScenario {
  const name = scenarioName.toLowerCase();

  if (name.includes('bank')) {
    return {
      nodes: [
        { id: 'fw1', label: 'Firewall-01', zone: 'PUBLIC', cvss: 0 },
        { id: 'lb1', label: 'Load-Balancer', zone: 'DMZ', cvss: 3.2 },
        { id: 'web1', label: 'WebServer-01', zone: 'DMZ', cvss: 7.8 },
        { id: 'web2', label: 'WebServer-02', zone: 'DMZ', cvss: 4.1 },
        { id: 'app1', label: 'AppServer-01', zone: 'PRIVATE', cvss: 0 },
        { id: 'db1', label: 'Database-01', zone: 'PRIVATE', cvss: 9.1 },
        { id: 'cache1', label: 'Redis-Cache', zone: 'PRIVATE', cvss: 5.5 },
        { id: 'mq1', label: 'MessageQueue', zone: 'PRIVATE', cvss: 2.0 },
      ],
      edges: [
        { source: 'fw1', target: 'lb1' },
        { source: 'lb1', target: 'web1' },
        { source: 'lb1', target: 'web2' },
        { source: 'web1', target: 'app1', attackPath: true },
        { source: 'web2', target: 'app1' },
        { source: 'app1', target: 'db1', attackPath: true },
        { source: 'app1', target: 'cache1' },
        { source: 'app1', target: 'mq1' },
      ],
      violations: {
        web1: ['ZT-001: WAF not configured', 'T1190 Initial Access vulnerability detected'],
        web2: ['ZT-019: Outbound C2 channel on port 443'],
        app1: ['ZT-012: No MFA enforced for admin access', 'QR-009: RSA-2048 deprecated by 2030'],
        db1: ['QR-003: AES-128 encryption insufficient', 'CVSS 9.1 — Critical exposure'],
        cache1: ['SC-007: CVE-2024-1234 unpatched'],
        lb1: ['ZT-033: API keys not rotated in 90+ days'],
      },
      violationDetails: [
        { id: 'ZT-001', severity: 'CRITICAL', mitreId: 'T1190', mitreName: 'Initial Access', node: 'WebServer-01', remediation: 'Enable WAF immediately', engine: 'Zero-Trust' },
        { id: 'ZT-012', severity: 'HIGH', mitreId: 'T1021', mitreName: 'Lateral Movement', node: 'AppServer-01', remediation: 'Enforce MFA', engine: 'Zero-Trust' },
        { id: 'QR-003', severity: 'HIGH', mitreId: '—', mitreName: '—', node: 'Database-01', remediation: 'Migrate to AES-256-GCM', engine: 'Quantum Risk' },
        { id: 'SC-007', severity: 'MEDIUM', mitreId: '—', mitreName: '—', node: 'Redis-Cache', remediation: 'Patch CVE-2024-1234', engine: 'Supply Chain' },
        { id: 'ZT-033', severity: 'MEDIUM', mitreId: 'T1078', mitreName: 'Valid Accounts', node: 'Load-Balancer', remediation: 'Rotate API keys', engine: 'Zero-Trust' },
        { id: 'ZT-019', severity: 'CRITICAL', mitreId: 'T1071', mitreName: 'C2 Channel', node: 'WebServer-02', remediation: 'Block outbound 443', engine: 'Zero-Trust' },
        { id: 'QR-009', severity: 'HIGH', mitreId: '—', mitreName: '—', node: 'AppServer-01', remediation: 'Replace RSA-2048 with Kyber', engine: 'Quantum Risk' },
      ]
    };
  }

  if (name.includes('hospital')) {
    return {
      nodes: [
        { id: 'router', label: 'Edge-Router', zone: 'PUBLIC', cvss: 2.1 },
        { id: 'vpn', label: 'VPN-Gateway', zone: 'PUBLIC', cvss: 8.4 },
        { id: 'portal', label: 'Patient-Portal', zone: 'DMZ', cvss: 6.5 },
        { id: 'api', label: 'FHIR-API', zone: 'DMZ', cvss: 0 },
        { id: 'ehr', label: 'EHR-System', zone: 'PRIVATE', cvss: 9.8 },
        { id: 'pacs', label: 'Imaging-PACS', zone: 'PRIVATE', cvss: 7.2 },
      ],
      edges: [
        { source: 'router', target: 'portal' },
        { source: 'vpn', target: 'api', attackPath: true },
        { source: 'portal', target: 'api' },
        { source: 'api', target: 'ehr', attackPath: true },
        { source: 'api', target: 'pacs' },
      ],
      violations: {
        vpn: ['ZT-042: IPSec tunnel uses deprecated DH group'],
        portal: ['SC-012: Lodash prototype pollution CVE'],
        ehr: ['DPDP-01: Patient records lacking at-rest encryption', 'CVSS 9.8 — Direct access over RDP'],
        pacs: ['QR-011: Image metadata signed with SHA-1'],
      },
      violationDetails: [
        { id: 'ZT-042', severity: 'HIGH', mitreId: 'T1040', mitreName: 'Network Sniffing', node: 'VPN-Gateway', remediation: 'Upgrade DH groups', engine: 'Zero-Trust' },
        { id: 'SC-012', severity: 'CRITICAL', mitreId: 'T1190', mitreName: 'Exploit Public App', node: 'Patient-Portal', remediation: 'Patch Lodash to latest', engine: 'Supply Chain' },
        { id: 'DPDP-01', severity: 'HIGH', mitreId: '—', mitreName: '—', node: 'EHR-System', remediation: 'Implement volume encryption', engine: 'Compliance' },
        { id: 'CVSS-9.8', severity: 'CRITICAL', mitreId: 'T1021', mitreName: 'Remote Services', node: 'EHR-System', remediation: 'Block RDP externally', engine: 'Zero-Trust' },
        { id: 'QR-011', severity: 'MEDIUM', mitreId: '—', mitreName: '—', node: 'Imaging-PACS', remediation: 'Sign with SHA-256', engine: 'Quantum Risk' },
      ]
    };
  }

  // Default / Government / Custom File
  return {
    nodes: [
      { id: 'gw', label: 'Gov-Gateway', zone: 'PUBLIC', cvss: 0 },
      { id: 'waf', label: 'Cloud-WAF', zone: 'DMZ', cvss: 1.2 },
      { id: 'auth', label: 'Identity-Provider', zone: 'DMZ', cvss: 5.4 },
      { id: 'citizen', label: 'Citizen-DB', zone: 'PRIVATE', cvss: 8.9 },
      { id: 'tax', label: 'Tax-Ledger', zone: 'PRIVATE', cvss: 0 },
      { id: 'analytics', label: 'DataLake', zone: 'PRIVATE', cvss: 6.1 },
    ],
    edges: [
      { source: 'gw', target: 'waf' },
      { source: 'waf', target: 'auth' },
      { source: 'auth', target: 'citizen', attackPath: true },
      { source: 'auth', target: 'tax' },
      { source: 'citizen', target: 'analytics', attackPath: true },
      { source: 'tax', target: 'analytics' },
    ],
    violations: {
      auth: ['ZT-005: SAML signature bypass vulnerability'],
      citizen: ['DPDP-08: Aadhaar hashes weakly salted', 'CVSS 8.9 — API exposed to internal subnet'],
      analytics: ['SC-101: Log4j CVE-2021-44228 present in ingestion pipeline'],
    },
    violationDetails: [
      { id: 'ZT-005', severity: 'CRITICAL', mitreId: 'T1556', mitreName: 'Modify Authentication', node: 'Identity-Provider', remediation: 'Apply SAML patches', engine: 'Zero-Trust' },
      { id: 'DPDP-08', severity: 'HIGH', mitreId: '—', mitreName: '—', node: 'Citizen-DB', remediation: 'Use Argon2id hashing', engine: 'Compliance' },
      { id: 'CVSS-8.9', severity: 'HIGH', mitreId: 'T1190', mitreName: 'Exploit Public App', node: 'Citizen-DB', remediation: 'Segment API tier', engine: 'Zero-Trust' },
      { id: 'SC-101', severity: 'CRITICAL', mitreId: 'T1190', mitreName: 'Initial Access', node: 'DataLake', remediation: 'Update Log4j to >=2.17.1', engine: 'Supply Chain' },
      { id: 'CP-014', severity: 'MEDIUM', mitreId: '—', mitreName: '—', node: 'Gov-Gateway', remediation: 'Deny-by-default egress', engine: 'Compliance' },
    ]
  };
}
