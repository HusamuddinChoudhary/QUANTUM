export interface Session {
  id: string;
  name: string;
  date: string;
  score: number;
  violations: number;
  status: string;
}

export const mockSessions: Session[] = [
  { id: 'sess-001', name: 'Bank Core Infrastructure', date: '2025-01-15', score: 84, violations: 12, status: 'Completed' },
  { id: 'sess-002', name: 'Hospital Network Scan', date: '2025-01-12', score: 61, violations: 24, status: 'Completed' },
  { id: 'sess-003', name: 'Government Portal', date: '2025-01-10', score: 38, violations: 45, status: 'Completed' },
  { id: 'sess-004', name: 'FinTech API Gateway', date: '2025-01-08', score: 77, violations: 16, status: 'Completed' },
  { id: 'sess-005', name: 'Insurance Cloud Stack', date: '2025-01-05', score: 91, violations: 5, status: 'Completed' },
  { id: 'sess-006', name: 'Telecom Core Network', date: '2025-01-03', score: 55, violations: 31, status: 'Completed' },
  { id: 'sess-007', name: 'E-Commerce Platform', date: '2024-12-28', score: 72, violations: 19, status: 'Completed' },
  { id: 'sess-008', name: 'Energy Grid SCADA', date: '2024-12-25', score: 43, violations: 38, status: 'Completed' },
  { id: 'sess-009', name: 'Healthcare Portal v2', date: '2024-12-20', score: 88, violations: 9, status: 'Completed' },
  { id: 'sess-010', name: 'Defense Contractor VPN', date: '2024-12-15', score: 96, violations: 2, status: 'Completed' },
];
