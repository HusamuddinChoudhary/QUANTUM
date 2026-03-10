Build a full React + TypeScript + Tailwind CSS + shadcn/ui SaaS application called 
QUANTUM-ARES — a cybersecurity infrastructure validation platform. The app has 3 pages: 
Login, Landing (Home), and Dashboard. Use React Router v6 for routing. Use Recharts for 
charts, Cytoscape.js for graph visualization, and Three.js for the 3D hero model on the 
landing page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM (apply globally)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Colors:
  --navy:   #0D1B3E   (primary background, sidebar)
  --gold:   #9A7D0A   (accent, CTA borders, highlights)
  --red:    #B03A2E   (critical severity, alerts)
  --green:  #2A7A2A   (good scores, success)
  --orange: #C97A2A   (medium severity, DMZ nodes)
  --bg-dark: #070E20  (deep background)
  --card:   #0F2347   (card background)
  --text:   #E8EDF7   (primary text)
  --muted:  #6B7FA3   (secondary text)

Typography: Use 'Syne' (headings, bold weight) + 'DM Sans' (body) from Google Fonts.

Style direction: Dark cyberpunk-military aesthetic. Subtle grid dot pattern on all 
backgrounds. Glowing borders on hover (box-shadow with navy/gold). No white backgrounds 
anywhere. All cards use --card color with 1px border in rgba(154,125,10,0.25).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1: LOGIN PAGE  (route: /login)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-screen split layout:
  LEFT HALF: Animated background — a subtle looping CSS particle/circuit animation 
  (use CSS keyframes with moving dots/lines on dark navy bg). Show the QUANTUM-ARES 
  logo (text logo: "QUANTUM·ARES" in gold Syne font, letter-spaced). Below the logo, 
  show the tagline: "Architecture is the new perimeter." in muted white. Show 3 feature 
  pills below: "Zero-Trust Validation", "Quantum Risk (HNDL)", "Blockchain Reports".

  RIGHT HALF: Centered login card (dark card bg, gold border glow). Contains:
    - Heading: "Welcome Back" (Syne, white, 28px)
    - Subtext: "Sign in to your QUANTUM-ARES workspace"
    - Email input (shadcn Input, dark styled, label "Email Address")
    - Password input (shadcn Input, type password, label "Password", show/hide toggle)
    - "Sign In" button (full width, gold background #9A7D0A, navy text, hover glow)
    - Error message area (red text, hidden by default)
    - Link below: "Learn more about QUANTUM-ARES →" links to /

  Mock authentication logic:
    - Accept: admin@bank.com / password → redirect to /dashboard
    - Accept: demo@hospital.com / demo123 → redirect to /dashboard
    - Any other credentials → show error "Invalid email or password"
    - Store mock user in localStorage as { email, name: "Alex Chen", role: "CISO", 
      orgId: "bank-01" }
  
  Add a subtle fade-in animation (opacity 0 → 1, translateY 20px → 0) on mount for 
  the card.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2: LANDING/HOME PAGE  (route: /)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — HERO (fullscreen):
  Sticky navbar: "QUANTUM·ARES" logo left, nav links center (Features, How It Works, 
  Why India), CTA button right: "Sign In" → /login. Navbar background transparent on 
  hero, becomes --navy with blur on scroll.

  Hero content LEFT side:
    - Badge pill: "v7.45 Ship-Ready" with pulsing green dot
    - H1 (Syne, 64px, white): "Architecture is the" + line break + 
      "new perimeter." (highlight "perimeter" in gold)
    - Subheadline (DM Sans, 20px, muted): "Validate your infrastructure design before 
      attackers exploit it. QUANTUM-ARES gives your CISO a Security Index — like CIBIL 
      for your tech stack."
    - Two CTA buttons: "Try Demo →" (gold filled) | "Watch How It Works" (outline gold)
    - Below: 3 stats pills in a row:
        "100+ MITRE Rules" | "5 Validation Engines" | "Blockchain Anchored"

  Hero content RIGHT side — 3D MODEL using Three.js:
    Create an animated 3D network/graph visualization using Three.js:
    - Render a rotating 3D sphere made of interconnected nodes (icosahedron wireframe 
      or point cloud sphere).
    - Nodes: small glowing spheres, color-coded (green, orange, red) representing 
      infrastructure zones.
    - Connecting lines/edges between nodes (THREE.LineSegments).
    - Slow continuous rotation on Y axis.
    - Some nodes pulse red (attack path simulation) with a setTimeout loop.
    - Use a React component <ThreeJSHero /> with useRef for the canvas mount.
    - Canvas size: 600x600, transparent background.
    - Ambient light + point light in gold color.

SECTION 2 — THE CIBIL ANALOGY:
  Dark section with subtle grid. Two-column layout:
    LEFT: Text block:
      - Eyebrow: "THE SECURITY INDEX"
      - H2: "Your infrastructure gets a score. Just like your credit."
      - Body: "Just as CIBIL turns your financial history into one trusted number, 
        QUANTUM-ARES turns your infrastructure design into a Security Index (0–100) 
        that every CISO, auditor, and regulator can understand and verify."
    RIGHT: Side-by-side comparison cards:
      - Card 1 "CIBIL Score": shows a mock 742/900 score card (green) with label 
        "Financial Trustworthiness"
      - Card 2 "QUANTUM-ARES Index": shows a mock 84/100 score (gold ring using 
        CSS conic-gradient) with label "Infrastructure Security"
      - Arrow/vs divider between them.

SECTION 3 — KEY FEATURES (4 pillars):
  H2: "Four Pillars of Infrastructure Assurance"
  Grid of 4 cards (2x2 on desktop), each with:
    1. Icon (Lucide) + Title "Zero-Trust Validation" + description 
       "100+ rules mapped to MITRE ATT&CK. Every trust boundary validated."
    2. Icon + "Quantum Risk (HNDL)" + "Detects cryptography broken by 2030. 
       Migrate before harvest-now-decrypt-later attacks hit."
    3. Icon + "Supply Chain Security" + "SBOM generation + CVE scanning for 
       every dependency in your stack."
    4. Icon + "Blockchain Reports" + "Tamper-proof, verifiable evidence anchored 
       on-chain for auditors and regulators."
  Cards: dark card bg, gold top border, hover lifts with gold glow.

SECTION 4 — HOW IT WORKS (4 steps):
  Horizontal stepper with connecting dotted line:
    Step 1: Upload — "Drop your infrastructure file (JSON, YAML, Terraform)"
    Step 2: Graph — "We build a live topology graph of your entire system"
    Step 3: Score — "5 engines score your design. Zero-Trust, Quantum, Supply Chain, 
                      Compliance, Attack Path."
    Step 4: Report — "Get a blockchain-anchored PDF report your CISO can show regulators."
  Each step has a number badge (gold), icon, title, description.

SECTION 5 — INDIA IMPACT:
  Full-width dark banner with gold accent:
    "₹8,500 Cr lost to infra-level breaches annually."
    "₹380 Cr in DPDP fines issued in Q1 2026 alone."
    "1.5 Million attacks per year targeting Indian infrastructure."
    CTA: "Don't be the next breach. Validate now →"

FOOTER:
  Three columns: Logo + tagline | Links (GitHub, Docs, Contact) | Legal (Privacy, Terms)
  Bottom bar: "© 2025 QUANTUM-ARES. v7.45 ShipReady."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 3: DASHBOARD  (route: /dashboard — protected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Protected route: if no user in localStorage, redirect to /login.

LAYOUT: Full-height flex row.
  Left: Fixed sidebar (240px wide, --navy bg, gold logo top)
  Right: Main content area (flex-1, --bg-dark, scrollable)

SIDEBAR:
  Top: "QUANTUM·ARES" logo + "v7.45" badge
  Nav items (with Lucide icons, active state = gold left border + gold text):
    - Overview (LayoutDashboard icon) → /dashboard
    - History (Clock icon) → /dashboard/history
    - Upload (Upload icon) → /dashboard/upload
    - Reports (FileText icon) → /dashboard/reports
  Bottom: User avatar initials circle (gold bg) + name "Alex Chen" + "CISO" badge + 
    Logout button (LogOut icon, muted, hover red)

DASHBOARD HEADER (top bar, sticky):
  Left: Page title (changes with route)
  Right: Notification bell icon + "Last scan: 2 mins ago" pill (green dot)

━━━━━━━
TAB: OVERVIEW  (/dashboard)
━━━━━━━

Top row — 4 stat cards:
  1. Security Index: "84" (large, green glow) / 100 with label "Current Score"
  2. Active Violations: "12" (orange) with label "Needs Attention"  
  3. Critical Issues: "3" (red) with label "Immediate Action"
  4. Last Validated: "2 hours ago" (muted) with label "Time Since Scan"

Middle: "Recent Sessions" — table with 3 mock rows:
  Columns: Name | Date | Score (colored badge) | Status | Actions
  Mock data:
    "Bank Core Infrastructure" | 2025-01-15 | 84 (green) | Completed | View / Download
    "Hospital Network Scan" | 2025-01-12 | 61 (orange) | Completed | View / Download
    "Government Portal" | 2025-01-10 | 38 (red) | Completed | View / Download

Bottom: Two quick action buttons: "Upload New File →" | "View Full History →"

━━━━━━━
TAB: HISTORY  (/dashboard/history)
━━━━━━━

Heading: "Validation History"
Search input + filter by severity dropdown above the table.

Full paginated table (shadcn Table):
  Columns: # | Session Name | Date | Security Index | Violations | Status | Actions
  10 mock rows with varied scores (use the 3 from above + 7 more varied entries).
  Score badge: <40 red, 40-60 orange, 60-80 yellow, >80 green.
  Actions: "View Results" button (opens Validation Results view) + "Download PDF" button.

Clicking "View Results" on any row shows the full Validation Results panel below 
(same page, replaces table, with a "← Back to History" button at top).

━━━━━━━
TAB: UPLOAD  (/dashboard/upload)
━━━━━━━

Heading: "New Validation"

Drag-and-drop zone (dashed gold border, dark bg, centered):
  Icon (UploadCloud) + "Drop your infrastructure file here"
  Subtext: "Supports JSON, YAML, Terraform (.tf)"
  Or: "click to browse" link

Below drag zone: "Or try a demo scenario:"
  3 buttons side by side:
    "🏦 Load Bank Demo" | "🏥 Load Hospital Demo" | "🏛️ Load Government Demo"

When any demo button OR file is "uploaded" (simulated with setTimeout):
  Show a progress section below:
    - Session ID: "sess_20250115_001"
    - Progress bar (animated, gold fill)
    - Engine status list (5 items with spinner → checkmark animation):
        ⏳ Zero-Trust Engine... → ✅ Complete (38 rules checked)
        ⏳ Quantum Risk Engine... → ✅ Complete (HNDL timeline built)
        ⏳ Attack Path Engine... → ✅ Complete (3 paths found)
        ⏳ Supply Chain Engine... → ✅ Complete (SBOM generated)
        ⏳ Compliance Engine... → ✅ Complete (NIST/DPDP/RBI mapped)
    - Each engine completes with a 1-2 second stagger.
  After all engines complete → auto-show Validation Results below.

━━━━━━━
TAB: REPORTS  (/dashboard/reports)
━━━━━━━

Heading: "Generated Reports"
Table: Report ID | Session Name | Date | Format | Download
5 mock rows. Download button triggers a window.alert("Downloading PDF report...").

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VALIDATION RESULTS VIEW (component, shown in-page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This full-width component appears either after upload or when clicking "View Results" 
from history. It has tabs within it:

Header bar:
  Security Index ring: large SVG ring (CSS conic-gradient), number inside 84/100, 
  green color. Session name + date + "Download Report" button.

Inner tab bar: Graph | Score | Violations | Quantum Risk | AI Chat

──────
INNER TAB 1: GRAPH VIEW
──────
Use Cytoscape.js to render an interactive infrastructure graph.
Use this static mock data:

Nodes (8 total):
  { id: 'fw1', label: 'Firewall-01', zone: 'PUBLIC', cvss: 0 }
  { id: 'lb1', label: 'Load-Balancer', zone: 'DMZ', cvss: 3.2 }
  { id: 'web1', label: 'WebServer-01', zone: 'DMZ', cvss: 7.8 }
  { id: 'web2', label: 'WebServer-02', zone: 'DMZ', cvss: 4.1 }
  { id: 'app1', label: 'AppServer-01', zone: 'PRIVATE', cvss: 0 }
  { id: 'db1', label: 'Database-01', zone: 'PRIVATE', cvss: 9.1 }
  { id: 'cache1', label: 'Redis-Cache', zone: 'PRIVATE', cvss: 5.5 }
  { id: 'mq1', label: 'MessageQueue', zone: 'PRIVATE', cvss: 2.0 }

Edges:
  fw1→lb1, lb1→web1, lb1→web2, web1→app1, web2→app1, app1→db1, 
  app1→cache1, app1→mq1

Node colors: PUBLIC=red (#B03A2E), DMZ=orange (#C97A2A), PRIVATE=green (#2A7A2A)
Attack path edges (pulsing red, thicker): web1→app1, app1→db1
Style: dark background (#070E20), nodes as rounded rectangles, labels in white DM Sans.

Clicking a node opens a right side drawer/panel showing:
  Node name, Zone badge, CVSS Score, 
  Violations for that node (1-2 mock violations), 
  Remediation: "Apply network segmentation" or "Upgrade TLS to 1.3"

──────
INNER TAB 2: SCORE DASHBOARD
──────
Large Security Index ring at top (already in header, repeat as emphasized version).
Below: 5 score cards in a row:
  Zero-Trust Score: 88/100 (green progress bar)
  Quantum Vuln Index: 72/100 (yellow)
  Attack Path Score: 91/100 (green)
  Supply Chain Score: 78/100 (yellow)
  Compliance Score: 81/100 (green)

Below cards: Recharts RadarChart showing the 5 engine scores as a pentagon radar. 
Gold fill, navy stroke. Axes labeled with engine names.

──────
INNER TAB 3: VIOLATIONS
──────
Filter row: "All Severities" dropdown + "All Engines" dropdown + search input.
Table of violations (shadcn Table):
  Columns: Rule ID | Severity | MITRE Technique | Affected Node | Remediation
  
  Mock 8 violations:
    ZT-001 | CRITICAL (red) | T1190 Initial Access | WebServer-01 | "Enable WAF"
    ZT-012 | HIGH (orange)  | T1021 Lateral Mvmt   | AppServer-01 | "Enforce MFA"
    QR-003 | HIGH (orange)  | —                    | Database-01  | "Migrate to AES-256"
    SC-007 | MEDIUM (yellow)| —                    | Redis-Cache  | "Patch CVE-2024-1234"
    ZT-033 | MEDIUM (yellow)| T1078 Valid Accounts | LoadBalancer | "Rotate API keys"
    CP-002 | LOW (blue)     | —                    | All Nodes    | "Add audit logging"
    ZT-019 | CRITICAL (red) | T1071 C2 Channel     | WebServer-02 | "Block outbound 443"
    QR-009 | HIGH (orange)  | —                    | AppServer-01 | "Replace RSA-2048"

  Severity badge colors match the design system. Row hover highlights gold.
  Clicking a row should highlight that node in the graph (show a toast: 
  "Node highlighted in Graph view").

──────
INNER TAB 4: QUANTUM RISK
──────
Heading: "Harvest-Now-Decrypt-Later (HNDL) Risk Timeline"

Recharts AreaChart (full width, dark styled):
  X-axis: Years 2024 to 2035
  Y-axis: Risk Level (0-100)
  Three area series:
    "Current Cryptography Risk" — starts low, rises sharply from 2029 (red area)
    "Post-Quantum Migration" — flat low green line
    "Harvest Window" — orange dotted reference line at Y=60
  Add a vertical red dashed reference line at X=2029 labeled "Quantum Threat Horizon"
  
Below chart: table of nodes with QVI scores:
  Node | Algorithm | QVI Score | Migration Recommendation | Priority
  Database-01 | RSA-2048 | 91 (red) | "Migrate to CRYSTALS-Kyber" | P1-Critical
  AppServer-01 | RSA-2048 | 85 (red) | "Implement hybrid PQC" | P1-Critical
  WebServer-01 | AES-128  | 54 (orange) | "Upgrade to AES-256" | P2-High
  Redis-Cache  | DES      | 72 (orange) | "Replace with ChaCha20" | P2-High

──────
INNER TAB 5: AI CHAT
──────
Chat interface component:
  Messages area (scrollable, dark bg):
    Initial assistant message: "Hi Alex! I've analyzed your Bank Core Infrastructure 
    scan. Security Index is 84/100 — strong overall, but 3 critical issues need 
    immediate attention. Ask me anything about your results."
    Badge on message: "Rule Engine ⚡" (gold pill)
  
  Input area at bottom: text input + "Ask" button (gold).
  
  Mock responses (match question keywords):
    if input contains "critical" → "You have 3 critical violations: ZT-001 on 
      WebServer-01 (WAF missing), ZT-019 on WebServer-02 (outbound C2 channel), 
      and QR-003 on Database-01 (weak encryption)."
    if input contains "quantum" → "Your HNDL risk horizon is 2029. Database-01 
      and AppServer-01 use RSA-2048 which will be vulnerable. Migrate to 
      CRYSTALS-Kyber within 18 months."
    if input contains "compliance" → "You're 81% compliant overall. NIST: 84%, 
      DPDP: 79%, RBI: 80%. Main gap: audit logging not configured on 4 nodes."
    default → "I found relevant information in your scan results. 
      Your Security Index of 84 puts you in the 'Good' tier. 
      Focus on the 3 critical violations for maximum score improvement. [Rule Engine ⚡]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS & POLISH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- All page transitions: fade-in (opacity + translateY)
- Sidebar nav items: smooth left border slide on active
- Score ring: animated count-up from 0 to final value on mount
- Stat cards on overview: staggered fade-in on mount
- Table rows: hover background changes to rgba(154,125,10,0.08)
- Progress bars: animated width transitions
- Toast notifications: use shadcn/ui toast (top-right, dark themed)
- All buttons: subtle scale(0.97) on active press

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE STRUCTURE EXPECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/
  pages/
    LoginPage.tsx
    HomePage.tsx
    DashboardPage.tsx
  components/
    layout/Sidebar.tsx
    layout/Header.tsx
    dashboard/OverviewTab.tsx
    dashboard/HistoryTab.tsx
    dashboard/UploadTab.tsx
    dashboard/ReportsTab.tsx
    results/ValidationResults.tsx
    results/GraphView.tsx
    results/ScoreDashboard.tsx
    results/ViolationPanel.tsx
    results/QuantumPanel.tsx
    results/ChatInterface.tsx
    home/ThreeJSHero.tsx
    home/CibilAnalogy.tsx
  hooks/
    useAuth.ts
    useMockValidation.ts
  data/
    mockSessions.ts
    mockViolations.ts
    mockGraphData.ts
  App.tsx (routing with protected route wrapper)