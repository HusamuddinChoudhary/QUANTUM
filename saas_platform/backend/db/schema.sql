-- Create tables if not using Alembic for initial setup
CREATE TABLE organisations (
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    plan_tier VARCHAR DEFAULT 'free',
    blockchain_mode VARCHAR DEFAULT 'demo',
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(org_id),
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR CHECK (role IN ('ADMIN', 'ANALYST', 'VIEWER')),
    full_name VARCHAR,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE graphs (
    graph_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(org_id),
    infra_json JSONB,
    filename VARCHAR,
    node_count INT,
    edge_count INT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graph_id UUID REFERENCES graphs(graph_id),
    org_id UUID REFERENCES organisations(org_id),
    status VARCHAR CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETE', 'FAILED')),
    duration_ms INT,
    created_at TIMESTAMP DEFAULT now(),
    completed_at TIMESTAMP
);

CREATE TABLE engine_results (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    engine_name VARCHAR,
    score FLOAT,
    findings JSONB,
    metadata_json JSONB,
    completed_at TIMESTAMP DEFAULT now()
);

CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    action VARCHAR,
    actor_id UUID,
    rule_id VARCHAR,
    timestamp TIMESTAMP DEFAULT now()
);

-- ADD RULE: no UPDATE or DELETE allowed on audit_log
CREATE RULE no_update_audit AS ON UPDATE TO audit_log DO INSTEAD NOTHING;
CREATE RULE no_delete_audit AS ON DELETE TO audit_log DO INSTEAD NOTHING;

CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(session_id),
    sha256_hash VARCHAR,
    rsa_signature TEXT,
    polygon_tx_hash VARCHAR,
    evidence_bundle_url VARCHAR,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE posture_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organisations(org_id),
    snapshot_time TIMESTAMP DEFAULT now(),
    score FLOAT,
    violation_counts JSONB
);

-- Enable Row-Level Security
ALTER TABLE graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE engine_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE posture_snapshots ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY org_isolation_graphs ON graphs 
    USING (org_id = current_setting('app.org_id')::uuid);

CREATE POLICY org_isolation_sessions ON sessions 
    USING (org_id = current_setting('app.org_id')::uuid);

CREATE POLICY org_isolation_reports ON reports 
    USING (session_id IN (SELECT session_id FROM sessions WHERE org_id = current_setting('app.org_id')::uuid));

CREATE POLICY org_isolation_snapshots ON posture_snapshots 
    USING (org_id = current_setting('app.org_id')::uuid);
