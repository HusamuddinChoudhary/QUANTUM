import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useGraphContext } from '../../hooks/useGraphContext';

/* ═══════════════════════════════════════════
   TYPES & STYLING
   ═══════════════════════════════════════════ */

const NODE_COLORS = {
    webserver: { main: '#1d6bff', glow: '#3b82f6', emissive: new THREE.Color(0x1d4ed8) },
    appserver: { main: '#8b3dff', glow: '#a855f7', emissive: new THREE.Color(0x6d28d9) },
    database: { main: '#00c97a', glow: '#10b981', emissive: new THREE.Color(0x059669) },
} as const;

const EVENT_STYLE: Record<string, { bg: string; dot: string; textColor: string }> = {
    attack: { bg: 'rgba(239,68,68,0.12)', dot: '#f87171', textColor: '#f87171' },
    patch: { bg: 'rgba(74,222,128,0.10)', dot: '#4ade80', textColor: '#4ade80' },
    scan: { bg: 'rgba(96,165,250,0.10)', dot: '#60a5fa', textColor: '#60a5fa' },
    alert: { bg: 'rgba(251,146,60,0.10)', dot: '#fb923c', textColor: '#fb923c' },
    login: { bg: 'rgba(167,139,250,0.10)', dot: '#a78bfa', textColor: '#a78bfa' },
};

/* ═══════════════════════════════════════════
   CANVAS HELPERS
   ═══════════════════════════════════════════ */
function makeTextSprite(text: string, color: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 384; canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 384, 80);
    ctx.font = 'bold 26px DM Sans, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillText(text, 192, 40);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.0, 0.65, 1);
    return sprite;
}

function makeGlowSprite(hex: string, size: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, hex + 'ff');
    g.addColorStop(0.3, hex + '88');
    g.addColorStop(1, hex + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const s = new THREE.Sprite(mat);
    s.scale.setScalar(size);
    return s;
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export function ThreeDGraph() {
    const { nodes: rawNodes, edges: rawEdges, scores, violations } = useGraphContext();
    const mountRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<string | null>(null);
    const hoveredRef = useRef<string | null>(null);

    const [hovered, setHovered] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => { selectedRef.current = selected; }, [selected]);
    useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

    const handleNodeClick = useCallback((id: string) => {
        setSelected(prev => prev === id ? null : id);
    }, []);

    // Scene Construction
    useEffect(() => {
        if (!mountRef.current || rawNodes.length === 0) return;
        const W = mountRef.current.clientWidth || 900;
        const H = 560;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x040c1a, 1);
        mountRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x040c1a, 0.042);
        const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
        camera.position.set(0, 1.5, 14);

        scene.add(new THREE.AmbientLight(0x1a2a4a, 1.4));
        const pL1 = new THREE.PointLight(0x3b82f6, 3.5, 22); pL1.position.set(0, 5, 4); scene.add(pL1);

        const gridMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30, 30, 30),
            new THREE.MeshBasicMaterial({ color: 0x1a4a8a, wireframe: true, transparent: true, opacity: 0.16 })
        );
        gridMesh.rotation.x = -Math.PI / 2;
        gridMesh.position.y = -5.8;
        scene.add(gridMesh);

        // Process Nodes
        const meshMap: Record<string, THREE.Mesh> = {};
        const glowMap: Record<string, THREE.Sprite> = {};

        rawNodes.forEach((n, i) => {
            const typeLower = (n.type || 'appserver').toLowerCase();
            const type = (typeLower.includes('web') ? 'webserver' : typeLower.includes('database') ? 'database' : 'appserver') as 'webserver' | 'database' | 'appserver';
            const col = NODE_COLORS[type];
            const mat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(col.main),
                emissive: col.emissive.clone(),
                emissiveIntensity: 0.85,
                shininess: 130, transparent: true, opacity: 0.93,
            });

            let geo: THREE.BufferGeometry;
            if (type === 'webserver') geo = new THREE.SphereGeometry(0.68, 32, 32);
            else if (type === 'appserver') geo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
            else geo = new THREE.CylinderGeometry(0.52, 0.52, 1.2, 32);

            const mesh = new THREE.Mesh(geo, mat);
            const angle = (i / rawNodes.length) * Math.PI * 2;
            const radius = 6;
            const x = n.position?.[0] ?? Math.cos(angle) * radius;
            const y = n.position?.[1] ?? (Math.random() - 0.5) * 4;
            const z = n.position?.[2] ?? Math.sin(angle) * radius;

            mesh.position.set(x, y, z);
            mesh.userData = { id: n.id, type, baseY: y };
            scene.add(mesh);
            meshMap[n.id] = mesh;

            const glow = makeGlowSprite(col.glow, 3.2);
            glow.position.copy(mesh.position);
            scene.add(glow);
            glowMap[n.id] = glow;

            const label = makeTextSprite(n.label || n.id, col.glow);
            label.position.set(x, y + 1.35, z);
            scene.add(label);
        });

        // Process Edges
        type AttackMesh = THREE.Mesh & { userData: { mat: THREE.MeshBasicMaterial; phase: number } };
        const attackMeshes: AttackMesh[] = [];

        rawEdges.forEach((e) => {
            const sn = meshMap[e.source];
            const tn = meshMap[e.target];
            if (!sn || !tn) return;

            const fp = sn.position.clone();
            const tp = tn.position.clone();
            const isAttack = e.riskLevel === 'CRITICAL' || e.riskLevel === 'HIGH';

            if (!isAttack) {
                const geo = new THREE.BufferGeometry().setFromPoints([fp, tp]);
                const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
                    color: 0x4a6a9a, transparent: true, opacity: 0.4,
                    blending: THREE.AdditiveBlending,
                }));
                scene.add(line);
            } else {
                const mid = fp.clone().lerp(tp, 0.5).add(new THREE.Vector3(0.5, 0.2, 0.3));
                const curve = new THREE.CatmullRomCurve3([fp, mid, tp]);
                const tubMat = new THREE.MeshBasicMaterial({
                    color: 0xff2244, transparent: true, opacity: 0.75,
                    blending: THREE.AdditiveBlending,
                });
                const tub = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.04, 6, false), tubMat) as unknown as AttackMesh;
                tub.userData.mat = tubMat;
                tub.userData.phase = Math.random() * Math.PI * 2;
                scene.add(tub);
                attackMeshes.push(tub);
            }
        });

        const raycaster = new THREE.Raycaster();
        const mouse2D = new THREE.Vector2();
        const allMeshes = Object.values(meshMap);

        const onMouseMove = (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            setMousePos({ x: e.clientX, y: e.clientY });
            raycaster.setFromCamera(mouse2D, camera);
            const hit = raycaster.intersectObjects(allMeshes)[0];
            const newH = hit ? (hit.object.userData.id as string) : null;
            setHovered(newH);
            renderer.domElement.style.cursor = newH ? 'pointer' : 'default';
        };
        const onClick = () => { if (hoveredRef.current) handleNodeClick(hoveredRef.current); };

        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('click', onClick);

        let isDrag = false, pMX = 0, pMY = 0, azimuth = 0, elevation = 0.12;
        renderer.domElement.addEventListener('mousedown', (e) => { isDrag = true; pMX = e.clientX; pMY = e.clientY; });
        renderer.domElement.addEventListener('mouseup', () => { isDrag = false; });
        renderer.domElement.addEventListener('mousemove', (e) => {
            if (!isDrag) return;
            azimuth -= (e.clientX - pMX) * 0.007; elevation -= (e.clientY - pMY) * 0.003;
            elevation = Math.max(-0.45, Math.min(0.75, elevation));
            pMX = e.clientX; pMY = e.clientY;
        });

        let animId: number; let t = 0;
        const animate = () => {
            animId = requestAnimationFrame(animate); t += 0.016;
            if (!isDrag) azimuth += 0.0018;
            const dist = camera.position.length();
            camera.position.x = dist * Math.sin(azimuth) * Math.cos(elevation);
            camera.position.y = dist * Math.sin(elevation) + 1.5;
            camera.position.z = dist * Math.cos(azimuth) * Math.cos(elevation);
            camera.lookAt(0, 0, 0);

            rawNodes.forEach((n, i) => {
                const mesh = meshMap[n.id];
                if (!mesh) return;
                const glow = glowMap[n.id];
                const mat = mesh.material as THREE.MeshPhongMaterial;
                const isSel = selectedRef.current === n.id;
                const isHov = hoveredRef.current === n.id;

                const floatY = (mesh.userData.baseY || 0) + Math.sin(t * 0.75 + i * 1.3) * 0.12;
                mesh.position.y = floatY; glow.position.y = floatY;
                mat.emissiveIntensity = isSel ? 1.5 + Math.sin(t * 5) * 0.4 : isHov ? 1.3 : 0.7 + Math.sin(t * 1.4 + i) * 0.18;
                const gs = isSel ? 1.7 + Math.sin(t * 5) * 0.3 : isHov ? 1.45 : 1.05 + Math.sin(t * 1.2 + i) * 0.07;
                glow.scale.setScalar(3.2 * gs);
                const ts = isSel ? 1.22 : isHov ? 1.14 : 1.0;
                mesh.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.12);
                if (mesh.userData.type === 'appserver') { mesh.rotation.y = t * 0.38; mesh.rotation.x = t * 0.18; }
            });

            attackMeshes.forEach((m) => {
                const isSel = !!selectedRef.current;
                const pulse = isSel ? 0.5 + Math.sin(t * 7 + m.userData.phase) * 0.45 : 0.4 + Math.sin(t * 3 + m.userData.phase) * 0.28;
                m.userData.mat.opacity = Math.max(0.1, Math.min(1, pulse));
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            renderer.domElement.removeEventListener('click', onClick);
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) mountRef.current.removeChild(renderer.domElement);
        };
    }, [rawNodes, rawEdges, handleNodeClick]);

    const selNode = selected ? rawNodes.find(n => n.id === selected) : null;
    const nodeViolations = violations.filter(v => v.node_id === selected);

    return (
        <div style={{ display: 'flex', gap: 0, fontFamily: "'DM Sans', sans-serif", background: '#040c1a', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <div ref={mountRef} style={{ width: '100%', height: 560, display: 'block' }} />

                <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(4,12,26,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.28)', borderRadius: 10, padding: '12px 16px', minWidth: 185 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#4a8fe8', letterSpacing: '0.14em', marginBottom: 8 }}>SECURITY OVERVIEW</div>
                    <Stat label="Security Score" value={`${Math.round(scores.zeroTrust || 0)} / 100`} color="#4ade80" />
                    <Stat label="Attack Paths" value={`${rawEdges.filter(e => e.riskLevel === 'CRITICAL').length} Detected`} color="#f87171" />
                    <Stat label="Total Violations" value={violations.length.toString()} color="#f97316" />
                </div>

                {selected && selNode && (
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 300, background: 'rgba(6,15,32,0.95)', borderLeft: '1px solid rgba(59,130,246,0.2)', padding: 20, overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#ffffff' }}>{selNode.label || selNode.id}</div>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>NODE TYPE</div>
                            <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 600 }}>{selNode.type?.toUpperCase()}</div>
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 700, color: '#4a8fe8', marginBottom: 12 }}>ACTIVE VIOLATIONS ({nodeViolations.length})</div>
                        {nodeViolations.map((v, i) => (
                            <div key={i} style={{ marginBottom: 12, padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>{v.severity}</span>
                                    <span style={{ fontSize: 9, color: '#94a3b8' }}>{v.rule_id}</span>
                                </div>
                                <div style={{ fontSize: 11, color: '#e2e8f0' }}>{v.remediation}</div>
                            </div>
                        ))}
                        {nodeViolations.length === 0 && <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: 20 }}>No active violations found for this node.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color }}>{value}</span>
        </div>
    );
}
