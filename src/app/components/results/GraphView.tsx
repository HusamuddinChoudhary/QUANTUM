import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { useGraphContext } from '../../hooks/useGraphContext';
import { X } from 'lucide-react';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

const ZONE_COLORS: Record<string, string> = {
  PUBLIC: '#dc2626',
  DMZ: '#d97706',
  PRIVATE: '#16a34a',
};

type SelectedNode = { id: string; label: string; zone: string; cvss: number };

export function GraphView() {
  const cyRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const { nodes, edges, violationDetails } = useGraphContext();

  useEffect(() => {
    if (!cyRef.current) return;

    const getIconSvg = (label: string) => {
      const l = label.toLowerCase();

      // isometric 3D SVGs — each is a 40×40 viewBox with gradient faces + shadow
      const icons: Record<string, string> = {

        // ── DATABASE: 3-tier isometric cylinder ──
        database: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="dbT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
            <linearGradient id="dbL" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#1e40af"/></linearGradient>
            <linearGradient id="dbR" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
            <filter id="ds"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#1e3a8a" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#ds)">
            <!-- tier 3 bottom -->
            <ellipse cx="20" cy="31" rx="10" ry="3.5" fill="url(#dbT)" opacity="0.7"/>
            <path d="M10 28 Q20 24.5 30 28 L30 31 Q20 34.5 10 31Z" fill="url(#dbL)"/>
            <!-- tier 2 mid -->
            <ellipse cx="20" cy="24" rx="10" ry="3.5" fill="url(#dbT)" opacity="0.85"/>
            <path d="M10 20.5 Q20 17 30 20.5 L30 24 Q20 27.5 10 24Z" fill="url(#dbR)"/>
            <!-- tier 1 top -->
            <ellipse cx="20" cy="17" rx="10" ry="3.5" fill="url(#dbT)"/>
            <path d="M10 13.5 Q20 10 30 13.5 L30 17 Q20 20.5 10 17Z" fill="url(#dbL)"/>
            <!-- top cap -->
            <ellipse cx="20" cy="13.5" rx="10" ry="3.5" fill="#93c5fd"/>
            <!-- shine -->
            <ellipse cx="17" cy="12.5" rx="3" ry="1" fill="white" opacity="0.35"/>
          </g>
        </svg>`,

        // ── SERVER: isometric rack unit ──
        server: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="svT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#64748b"/></linearGradient>
            <linearGradient id="svF" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
            <linearGradient id="svS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#64748b"/></linearGradient>
            <filter id="ss"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#0f172a" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#ss)">
            <!-- top face -->
            <polygon points="8,14 20,8 32,14 20,20" fill="url(#svT)"/>
            <!-- left face -->
            <polygon points="8,14 8,28 20,34 20,20" fill="url(#svS)"/>
            <!-- right face -->
            <polygon points="20,20 20,34 32,28 32,14" fill="url(#svF)"/>
            <!-- LED dots on front -->
            <circle cx="23" cy="24" r="1.2" fill="#4ade80"/>
            <circle cx="26" cy="24" r="1.2" fill="#4ade80" opacity="0.6"/>
            <!-- rack lines -->
            <line x1="20" y1="22" x2="31" y2="16.5" stroke="#e2e8f0" stroke-width="0.8" opacity="0.5"/>
            <line x1="20" y1="26" x2="31" y2="20.5" stroke="#e2e8f0" stroke-width="0.8" opacity="0.5"/>
            <!-- shine -->
            <polygon points="10,14 20,9 24,11 14,16" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── FIREWALL / SHIELD: isometric shield block ──
        shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="shT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fca5a5"/><stop offset="100%" stop-color="#dc2626"/></linearGradient>
            <linearGradient id="shS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#991b1b"/><stop offset="100%" stop-color="#b91c1c"/></linearGradient>
            <filter id="shs"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#7f1d1d" flood-opacity="0.5"/></filter>
          </defs>
          <g filter="url(#shs)">
            <!-- shield body top face -->
            <polygon points="8,15 20,9 32,15 20,21" fill="url(#shT)"/>
            <!-- left side -->
            <polygon points="8,15 8,26 20,32 20,21" fill="url(#shS)"/>
            <!-- right side -->
            <polygon points="20,21 20,32 32,26 32,15" fill="#ef4444"/>
            <!-- check mark on top -->
            <polyline points="15,15 19,19 26,12" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
            <!-- shine -->
            <polygon points="10,15 20,10 24,12 14,17" fill="white" opacity="0.2"/>
          </g>
        </svg>`,

        // ── LOAD BALANCER / SHUFFLE: isometric arrows box ──
        shuffle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="lbT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fdba74"/><stop offset="100%" stop-color="#f97316"/></linearGradient>
            <linearGradient id="lbS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c2410c"/><stop offset="100%" stop-color="#ea580c"/></linearGradient>
            <filter id="lbs"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#7c2d12" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#lbs)">
            <polygon points="8,15 20,9 32,15 20,21" fill="url(#lbT)"/>
            <polygon points="8,15 8,27 20,33 20,21" fill="url(#lbS)"/>
            <polygon points="20,21 20,33 32,27 32,15" fill="#fb923c"/>
            <!-- arrows on top -->
            <polyline points="14,15 18,13 14,11" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
            <polyline points="26,17 22,15 26,13" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
            <line x1="14" y1="13" x2="22" y2="15" stroke="white" stroke-width="1" stroke-dasharray="2,1" opacity="0.7"/>
            <polygon points="10,15 20,10 24,12 14,17" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── WEB SERVER: isometric globe ──
        globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="glT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#059669"/></linearGradient>
            <linearGradient id="glS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#047857"/><stop offset="100%" stop-color="#065f46"/></linearGradient>
            <filter id="gls"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#064e3b" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#gls)">
            <!-- base cylinder stand -->
            <ellipse cx="20" cy="32" rx="5" ry="1.8" fill="#047857" opacity="0.7"/>
            <rect x="18.5" y="27" width="3" height="5" fill="#065f46"/>
            <!-- globe sphere (approximated with ellipses for 3D) -->
            <ellipse cx="20" cy="18" rx="11" ry="11" fill="url(#glT)"/>
            <!-- latitude lines -->
            <ellipse cx="20" cy="18" rx="11" ry="4" fill="none" stroke="#34d399" stroke-width="0.8" opacity="0.6"/>
            <ellipse cx="20" cy="18" rx="11" ry="8" fill="none" stroke="#34d399" stroke-width="0.6" opacity="0.4"/>
            <!-- meridian line -->
            <line x1="20" y1="7" x2="20" y2="29" stroke="#34d399" stroke-width="0.8" opacity="0.6"/>
            <!-- shine -->
            <ellipse cx="15" cy="13" rx="4" ry="2.5" fill="white" opacity="0.25" transform="rotate(-20,15,13)"/>
          </g>
        </svg>`,

        // ── APP SERVER / CPU: isometric chip ──
        cpu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="cpT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>
            <linearGradient id="cpS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#5b21b6"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
            <filter id="cps"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#2e1065" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#cps)">
            <!-- chip top -->
            <polygon points="8,15 20,9 32,15 20,21" fill="url(#cpT)"/>
            <!-- left -->
            <polygon points="8,15 8,26 20,32 20,21" fill="url(#cpS)"/>
            <!-- right -->
            <polygon points="20,21 20,32 32,26 32,15" fill="#8b5cf6"/>
            <!-- circuit lines on top -->
            <line x1="14" y1="13" x2="26" y2="13" stroke="#e9d5ff" stroke-width="0.8" opacity="0.7"/>
            <line x1="14" y1="16" x2="26" y2="16" stroke="#e9d5ff" stroke-width="0.8" opacity="0.5"/>
            <line x1="17" y1="10" x2="17" y2="19" stroke="#e9d5ff" stroke-width="0.8" opacity="0.5"/>
            <line x1="23" y1="10" x2="23" y2="19" stroke="#e9d5ff" stroke-width="0.8" opacity="0.5"/>
            <!-- core square -->
            <rect x="16.5" y="12" width="7" height="6" rx="0.5" fill="#4c1d95" opacity="0.8"/>
            <!-- pins left/right -->
            <line x1="8" y1="22" x2="5" y2="21" stroke="#c4b5fd" stroke-width="1"/>
            <line x1="8" y1="24" x2="5" y2="23" stroke="#c4b5fd" stroke-width="1"/>
            <line x1="32" y1="22" x2="35" y2="21" stroke="#c4b5fd" stroke-width="1"/>
            <line x1="32" y1="24" x2="35" y2="23" stroke="#c4b5fd" stroke-width="1"/>
            <polygon points="10,15 20,10 24,12 14,17" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── CACHE / REDIS: isometric lightning bolt ──
        zap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="zpT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
            <linearGradient id="zpS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#b45309"/><stop offset="100%" stop-color="#d97706"/></linearGradient>
            <filter id="zps"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#78350f" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#zps)">
            <!-- box base -->
            <polygon points="8,18 20,12 32,18 20,24" fill="url(#zpT)"/>
            <polygon points="8,18 8,28 20,34 20,24" fill="url(#zpS)"/>
            <polygon points="20,24 20,34 32,28 32,18" fill="#fbbf24"/>
            <!-- lightning bolt on top -->
            <polygon points="22,12 18,18 21,18 19,22 24,15 21,15" fill="white" opacity="0.9"/>
            <polygon points="10,18 20,13 24,15 14,20" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── MESSAGE QUEUE / LAYERS: isometric stacked discs ──
        layers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="lrT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#67e8f9"/><stop offset="100%" stop-color="#0891b2"/></linearGradient>
            <filter id="lrs"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#164e63" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#lrs)">
            <!-- disc 3 -->
            <ellipse cx="20" cy="30" rx="11" ry="4" fill="#0e7490" opacity="0.7"/>
            <path d="M9,26 Q20,22 31,26 L31,30 Q20,34 9,30Z" fill="#155e75"/>
            <!-- disc 2 -->
            <ellipse cx="20" cy="23" rx="11" ry="4" fill="url(#lrT)" opacity="0.85"/>
            <path d="M9,19 Q20,15 31,19 L31,23 Q20,27 9,23Z" fill="#0e7490"/>
            <!-- disc 1 top -->
            <ellipse cx="20" cy="16" rx="11" ry="4" fill="url(#lrT)"/>
            <path d="M9,12 Q20,8 31,12 L31,16 Q20,20 9,16Z" fill="#0891b2"/>
            <!-- top cap -->
            <ellipse cx="20" cy="12" rx="11" ry="4" fill="#a5f3fc"/>
            <ellipse cx="18" cy="11" rx="3.5" ry="1.2" fill="white" opacity="0.3"/>
          </g>
        </svg>`,

        // ── ROUTER: isometric box with antennas ──
        router: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="rtT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#16a34a"/></linearGradient>
            <linearGradient id="rtS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#14532d"/><stop offset="100%" stop-color="#15803d"/></linearGradient>
            <filter id="rts"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#052e16" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#rts)">
            <!-- antennas -->
            <line x1="16" y1="15" x2="14" y2="7" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="14" cy="6.5" r="1.2" fill="#4ade80"/>
            <line x1="24" y1="13" x2="26" y2="5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="26" cy="4.5" r="1.2" fill="#4ade80"/>
            <!-- box -->
            <polygon points="8,18 20,12 32,18 20,24" fill="url(#rtT)"/>
            <polygon points="8,18 8,28 20,34 20,24" fill="url(#rtS)"/>
            <polygon points="20,24 20,34 32,28 32,18" fill="#22c55e"/>
            <!-- LED strip right -->
            <circle cx="24" cy="26" r="1" fill="#bbf7d0"/>
            <circle cx="27" cy="24.5" r="1" fill="#bbf7d0" opacity="0.7"/>
            <polygon points="10,18 20,13 24,15 14,20" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── VPN / GATEWAY / LOCK: isometric lock ──
        lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="lkT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f9a8d4"/><stop offset="100%" stop-color="#db2777"/></linearGradient>
            <linearGradient id="lkS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#9d174d"/><stop offset="100%" stop-color="#be185d"/></linearGradient>
            <filter id="lks"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#500724" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#lks)">
            <!-- shackle -->
            <path d="M15,18 Q15,10 20,10 Q25,10 25,18" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round"/>
            <!-- box body -->
            <polygon points="8,20 20,14 32,20 20,26" fill="url(#lkT)"/>
            <polygon points="8,20 8,30 20,36 20,26" fill="url(#lkS)"/>
            <polygon points="20,26 20,36 32,30 32,20" fill="#ec4899"/>
            <!-- keyhole -->
            <circle cx="20" cy="20" r="2" fill="#9d174d"/>
            <rect x="19" y="20" width="2" height="2.5" rx="0.5" fill="#9d174d"/>
            <polygon points="10,20 20,15 24,17 14,22" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── API: isometric code brackets box ──
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="cdT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>
            <linearGradient id="cdS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#4c1d95"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
            <filter id="cds"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#2e1065" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#cds)">
            <polygon points="8,15 20,9 32,15 20,21" fill="url(#cdT)"/>
            <polygon points="8,15 8,27 20,33 20,21" fill="url(#cdS)"/>
            <polygon points="20,21 20,33 32,27 32,15" fill="#8b5cf6"/>
            <!-- < > brackets on top face -->
            <polyline points="14,13 11.5,15 14,17" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
            <polyline points="26,13 28.5,15 26,17" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
            <line x1="19" y1="12" x2="21" y2="18" stroke="white" stroke-width="1.2" opacity="0.7"/>
            <polygon points="10,15 20,10 24,12 14,17" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── AUTH / IDENTITY: isometric badge ──
        'user-check': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="ucT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#d97706"/></linearGradient>
            <linearGradient id="ucS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#92400e"/><stop offset="100%" stop-color="#b45309"/></linearGradient>
            <filter id="ucs"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#451a03" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#ucs)">
            <polygon points="8,16 20,10 32,16 20,22" fill="url(#ucT)"/>
            <polygon points="8,16 8,28 20,34 20,22" fill="url(#ucS)"/>
            <polygon points="20,22 20,34 32,28 32,16" fill="#f59e0b"/>
            <!-- person + check icon on top -->
            <circle cx="18" cy="13" r="2.5" fill="white" opacity="0.85"/>
            <polyline points="22,13 24,15 27,11" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
            <polygon points="10,16 20,11 24,13 14,18" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── ANALYTICS / DATA LAKE: isometric bar chart ──
        'bar-chart-2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="bcT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
            <filter id="bcs"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#064e3b" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#bcs)">
            <!-- base plate -->
            <polygon points="6,30 20,23 34,30 20,37" fill="#065f46" opacity="0.8"/>
            <!-- bar 1 (tall mid) -->
            <polygon points="16,16 20,13.5 24,16 20,18.5" fill="url(#bcT)"/>
            <polygon points="16,16 16,30 20,32.5 20,18.5" fill="#059669"/>
            <polygon points="20,18.5 20,32.5 24,30 24,16" fill="#34d399"/>
            <!-- bar 2 (short left) -->
            <polygon points="8,21 12,18.5 16,21 12,23.5" fill="url(#bcT)" opacity="0.8"/>
            <polygon points="8,21 8,30 12,32.5 12,23.5" fill="#047857"/>
            <polygon points="12,23.5 12,32.5 16,30 16,21" fill="#10b981" opacity="0.9"/>
            <!-- bar 3 (mid right) -->
            <polygon points="24,19 28,16.5 32,19 28,21.5" fill="url(#bcT)" opacity="0.9"/>
            <polygon points="24,19 24,30 28,32.5 28,21.5" fill="#059669"/>
            <polygon points="28,21.5 28,32.5 32,30 32,19" fill="#34d399"/>
          </g>
        </svg>`,

        // ── PORTAL / LAYOUT: isometric window ──
        layout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="lyT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>
            <linearGradient id="lyS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient>
            <filter id="lys"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#1e3a8a" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#lys)">
            <polygon points="8,16 20,10 32,16 20,22" fill="url(#lyT)"/>
            <polygon points="8,16 8,28 20,34 20,22" fill="url(#lyS)"/>
            <polygon points="20,22 20,34 32,28 32,16" fill="#60a5fa"/>
            <!-- window divisions on top -->
            <line x1="8" y1="13" x2="32" y2="13" stroke="white" stroke-width="1" opacity="0.6"/>
            <line x1="16" y1="10" x2="16" y2="22" stroke="white" stroke-width="0.8" opacity="0.5"/>
            <!-- traffic lights -->
            <circle cx="11" cy="12" r="1" fill="#f87171"/>
            <circle cx="14" cy="11" r="1" fill="#fbbf24"/>
            <polygon points="10,16 20,11 24,13 14,18" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── EHR / PATIENT: isometric activity ECG ──
        activity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="acT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fda4af"/><stop offset="100%" stop-color="#e11d48"/></linearGradient>
            <linearGradient id="acS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#9f1239"/><stop offset="100%" stop-color="#be123c"/></linearGradient>
            <filter id="acs"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#4c0519" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#acs)">
            <polygon points="8,16 20,10 32,16 20,22" fill="url(#acT)"/>
            <polygon points="8,16 8,28 20,34 20,22" fill="url(#acS)"/>
            <polygon points="20,22 20,34 32,28 32,16" fill="#f43f5e"/>
            <!-- ECG line on top -->
            <polyline points="10,15 14,15 16,11 18,19 20,15 22,15 24,13 26,17 30,15" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
            <polygon points="10,16 20,11 24,13 14,18" fill="white" opacity="0.15"/>
          </g>
        </svg>`,

        // ── FILE TEXT / LEDGER: isometric document ──
        'file-text': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="ftT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
            <linearGradient id="ftS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#64748b"/></linearGradient>
            <filter id="fts"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#0f172a" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#fts)">
            <polygon points="8,16 20,10 32,16 20,22" fill="url(#ftT)"/>
            <polygon points="8,16 8,30 20,36 20,22" fill="url(#ftS)"/>
            <polygon points="20,22 20,36 32,30 32,16" fill="#cbd5e1"/>
            <!-- lines on top (text lines) -->
            <line x1="11" y1="14" x2="23" y2="14" stroke="#64748b" stroke-width="1" opacity="0.7"/>
            <line x1="11" y1="16.5" x2="21" y2="16.5" stroke="#64748b" stroke-width="1" opacity="0.5"/>
            <line x1="11" y1="19" x2="19" y2="19" stroke="#64748b" stroke-width="1" opacity="0.5"/>
            <!-- folded corner -->
            <polygon points="27,10 32,10 32,15" fill="#94a3b8" opacity="0.5"/>
            <polygon points="10,16 20,11 24,13 14,18" fill="white" opacity="0.2"/>
          </g>
        </svg>`,

        // ── IMAGE / PACS: isometric picture frame ──
        image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="imT" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c7d2fe"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
            <linearGradient id="imS" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3730a3"/><stop offset="100%" stop-color="#4338ca"/></linearGradient>
            <filter id="ims"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#1e1b4b" flood-opacity="0.4"/></filter>
          </defs>
          <g filter="url(#ims)">
            <polygon points="8,16 20,10 32,16 20,22" fill="url(#imT)"/>
            <polygon points="8,16 8,28 20,34 20,22" fill="url(#imS)"/>
            <polygon points="20,22 20,34 32,28 32,16" fill="#818cf8"/>
            <!-- mountain scene on top -->
            <polygon points="11,19 16,13 21,19" fill="#4338ca" opacity="0.6"/>
            <polygon points="18,19 23,15 29,19" fill="#4338ca" opacity="0.4"/>
            <circle cx="26" cy="13" r="2" fill="#fde68a" opacity="0.8"/>
            <polygon points="10,16 20,11 24,13 14,18" fill="white" opacity="0.15"/>
          </g>
        </svg>`,
      };

      // Keyword → icon key mapping
      let iconKey = 'server';
      if (l.includes('firewall')) iconKey = 'shield';
      else if (l.includes('balancer') || l.includes('lb')) iconKey = 'shuffle';
      else if (l.includes('web')) iconKey = 'globe';
      else if (l.includes('app')) iconKey = 'cpu';
      else if (l.includes('database') || l.includes('db')) iconKey = 'database';
      else if (l.includes('cache') || l.includes('redis')) iconKey = 'zap';
      else if (l.includes('queue') || l.includes('mq')) iconKey = 'layers';
      else if (l.includes('router')) iconKey = 'router';
      else if (l.includes('vpn') || l.includes('gateway') || l.includes('gw')) iconKey = 'lock';
      else if (l.includes('portal')) iconKey = 'layout';
      else if (l.includes('api')) iconKey = 'code';
      else if (l.includes('ehr') || l.includes('patient') || l.includes('pacs') || l.includes('imaging')) iconKey = 'activity';
      else if (l.includes('auth') || l.includes('identity') || l.includes('waf')) iconKey = 'user-check';
      else if (l.includes('tax') || l.includes('ledger') || l.includes('citizen') || l.includes('file')) iconKey = 'file-text';
      else if (l.includes('analytics') || l.includes('lake')) iconKey = 'bar-chart-2';
      else if (l.includes('image') || l.includes('pacs')) iconKey = 'image';

      const svgStr = icons[iconKey] || icons['server'];
      return 'data:image/svg+xml;base64,' + btoa(svgStr);
    };

    const elements = [
      ...nodes.map((node) => ({
        data: {
          id: node.id,
          label: node.label,
          zone: node.zone,
          cvss: node.cvss,
          icon: getIconSvg(node.label)
        }
      })),
      ...edges.map((edge, i) => ({ data: { id: `e${i}`, source: edge.source, target: edge.target, attackPath: edge.attackPath ? 'yes' : 'no' } })),
    ];

    const cy = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            color: '#0a1628',
            'font-size': '11px',
            'font-family': 'DM Sans, sans-serif',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-margin-x': 18,
            shape: 'round-rectangle',
            width: 164, height: 52,
            'border-width': 1.5,
            'border-color': 'rgba(37,99,235,0.3)',
            'background-color': '#f0f4fa',
            'background-image': 'data(icon)',
            'background-height': '34px',
            'background-width': '34px',
            'background-position-x': '14px',
            'background-position-y': '50%',
          } as cytoscape.Css.Node,
        },
        {
          selector: 'node[zone = "PUBLIC"]',
          style: { 'background-color': '#fee2e2', 'border-color': '#dc2626', color: '#991b1b' } as cytoscape.Css.Node,
        },
        {
          selector: 'node[zone = "DMZ"]',
          style: { 'background-color': '#fef3c7', 'border-color': '#d97706', color: '#92400e' } as cytoscape.Css.Node,
        },
        {
          selector: 'node[zone = "PRIVATE"]',
          style: { 'background-color': '#dcfce7', 'border-color': '#16a34a', color: '#14532d' } as cytoscape.Css.Node,
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#94a3b8',
            width: 1.5,
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'vee',
            'arrow-scale': 1.2,
            'curve-style': 'bezier',
            opacity: 0.8,
          } as cytoscape.Css.Edge,
        },
        {
          selector: 'edge[attackPath = "yes"]',
          style: {
            'line-color': '#dc2626',
            width: 3,
            'target-arrow-color': '#dc2626',
            'target-arrow-shape': 'vee',
            'arrow-scale': 1.4,
            opacity: 1,
            'line-style': 'dashed',
            'line-dash-pattern': [6, 3],
            // Add a slight gradient-like shadow effect for critical paths
            'source-endpoint': 'inside-to-node',
          } as cytoscape.Css.Edge,
        },
        {
          selector: ':selected',
          style: { 'border-color': '#2563eb', 'border-width': 3 } as cytoscape.Css.Node,
        },
      ],
      layout: { name: 'breadthfirst', directed: true, spacingFactor: 1.6, padding: 40 },
      userZoomingEnabled: true,
      userPanningEnabled: true,
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNode({ id: node.id(), label: node.data('label'), zone: node.data('zone'), cvss: node.data('cvss') });
    });
    cy.on('tap', (evt) => { if (evt.target === cy) setSelectedNode(null); });

    return () => cy.destroy();
  }, [nodes, edges]);

  const nodeViolations = selectedNode ? violationDetails.filter(v => v.node === selectedNode.id) : [];

  return (
    <div style={{ display: 'flex', gap: 0, height: 520, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ padding: '12px 16px', background: '#f8faff', border: `1px solid ${C.border}`, borderRight: 'none', borderRadius: '8px 0 0 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textSub, letterSpacing: '0.08em', marginBottom: 8 }}>ZONES</div>
          {[['PUBLIC', '#dc2626'], ['DMZ', '#d97706'], ['PRIVATE', '#16a34a']].map(([zone, color]) => (
            <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ color: C.textMuted, fontSize: 12 }}>{zone}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 11, fontWeight: 600, color: C.textSub, letterSpacing: '0.08em', marginBottom: 8 }}>EDGES</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 20, height: 2, background: '#94a3b8' }} />
            <span style={{ color: C.textMuted, fontSize: 11 }}>Normal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 2, borderTop: '2px dashed #dc2626' }} />
            <span style={{ color: C.textMuted, fontSize: 11 }}>Attack Path</span>
          </div>
        </div>
      </div>

      {/* Graph canvas */}
      <div
        ref={cyRef}
        style={{
          flex: 1,
          background: '#f8faff',
          borderRadius: selectedNode ? '0' : '0 8px 8px 0',
          border: `1px solid ${C.border}`,
          borderLeft: 'none',
        }}
      />

      {/* Node details panel */}
      {selectedNode && (
        <div style={{
          width: 260,
          background: C.card,
          borderRadius: '0 8px 8px 0',
          border: `1px solid ${C.border}`,
          borderLeft: `1px solid ${C.border}`,
          overflowY: 'auto',
          flexShrink: 0,
          boxShadow: '2px 0 8px rgba(10,22,40,0.06)',
        }}>
          <div style={{ padding: '16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, fontSize: 14, marginBottom: 6 }}>
                {selectedNode.label}
              </div>
              <span style={{
                padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                background: `${ZONE_COLORS[selectedNode.zone]}18`,
                color: ZONE_COLORS[selectedNode.zone],
              }}>
                {selectedNode.zone}
              </span>
            </div>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', padding: 0 }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ padding: '14px 16px' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>CVSS SCORE</div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800,
                color: selectedNode.cvss >= 7 ? '#dc2626' : selectedNode.cvss >= 4 ? '#d97706' : '#16a34a',
              }}>
                {selectedNode.cvss === 0 ? 'N/A' : selectedNode.cvss.toFixed(1)}
              </div>
            </div>

            {nodeViolations.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>VIOLATIONS & REMEDIATION</div>
                {nodeViolations.map((v: any, i: number) => (
                  <div key={i} style={{ padding: '10px', background: 'rgba(220,38,38,0.04)', borderRadius: 8, border: '1px solid rgba(220,38,38,0.15)', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#dc2626', fontSize: 11, fontWeight: 700 }}>{v.severity}</span>
                      <span style={{ color: C.textSub, fontSize: 9 }}>{v.id}</span>
                    </div>
                    <div style={{ color: C.navy, fontSize: 12, fontWeight: 500, marginBottom: 8 }}>{v.mitreName !== '—' ? v.mitreName : 'Security Violation'}</div>
                    <div style={{ padding: '6px 8px', background: 'rgba(22,163,74,0.06)', borderRadius: 4, border: '1px solid rgba(22,163,74,0.2)' }}>
                      <span style={{ color: '#16a34a', fontSize: 11, lineHeight: 1.4, fontWeight: 500 }}>{v.remediation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
