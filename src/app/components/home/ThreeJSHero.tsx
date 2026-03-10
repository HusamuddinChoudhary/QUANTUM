import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeJSHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = 560;
    const H = 560;

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 7;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Group for rotation
    const group = new THREE.Group();
    scene.add(group);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x9a7d0a, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x9a7d0a, 3, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const blueLight = new THREE.PointLight(0x1a3a7a, 2, 20);
    blueLight.position.set(-5, -3, 3);
    scene.add(blueLight);

    // Node positions on sphere using Fibonacci spiral
    const nodeCount = 32;
    const radius = 3.2;
    const nodePositions: THREE.Vector3[] = [];
    const nodeColors = [0x2a7a2a, 0x2a7a2a, 0xc97a2a, 0xb03a2e]; // mostly green

    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      nodePositions.push(new THREE.Vector3(x, y, z));

      const colorIndex = Math.floor(Math.random() * nodeColors.length);
      const color = nodeColors[colorIndex];
      const geo = new THREE.SphereGeometry(0.09, 8, 8);
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.2, // Increased glow
        shininess: 120,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      group.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Edges
    const edgePositions: number[] = [];
    const attackEdgePositions: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 2.4) {
          const isAttack = Math.random() < 0.08;
          const arr = isAttack ? attackEdgePositions : edgePositions;
          arr.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    if (edgePositions.length > 0) {
      const edgeGeo = new THREE.BufferGeometry();
      edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x6b7fa3, opacity: 0.35, transparent: true });
      group.add(new THREE.LineSegments(edgeGeo, edgeMat));
    }

    if (attackEdgePositions.length > 0) {
      const attackGeo = new THREE.BufferGeometry();
      attackGeo.setAttribute('position', new THREE.Float32BufferAttribute(attackEdgePositions, 3));
      const attackMat = new THREE.LineBasicMaterial({ color: 0xb03a2e, opacity: 0.85, transparent: true });
      group.add(new THREE.LineSegments(attackGeo, attackMat));
    }

    // Outer wireframe sphere
    const sphereGeo = new THREE.IcosahedronGeometry(3.4, 1);
    const sphereWire = new THREE.WireframeGeometry(sphereGeo);
    const sphereMat = new THREE.LineBasicMaterial({ color: 0x2563eb, opacity: 0.15, transparent: true });
    group.add(new THREE.LineSegments(sphereWire, sphereMat));
    // Scroll-based rotation scoped to the entire document
    let currentScroll = 0;
    let targetScroll = 0;
    let isVisible = true;

    const onScroll = () => {
      // Look at the scroll position relative to the entire page body
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Calculate a normalized value from 0 (top) to 1 (bottom of the page)
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      targetScroll = scrollPercent * 1000;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Trigger initial calculation
    onScroll();

    // Animation
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause rendering if tab inactive

      t++;

      // Smooth interpolation for scroll
      currentScroll += (targetScroll - currentScroll) * 0.05;

      // Base slow rotation + scroll-based rotation
      const scrollRotation = currentScroll * 0.003;
      group.rotation.y = (t * 0.001) + scrollRotation;
      group.rotation.x = (t * 0.0005) + (currentScroll * 0.001);

      // Slight scale effect on scroll
      const scale = Math.max(0.7, 1 - (currentScroll * 0.00015));
      group.scale.set(scale, scale, scale);

      // Vertical parallax effect
      group.position.y = -(currentScroll * 0.0015);

      // Pulse red nodes periodically, but faster when scrolling
      if (t % 45 === 0) {
        nodeMeshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshPhongMaterial;
          if (mat.color.getHex() === 0xb03a2e) {
            mat.emissiveIntensity = mat.emissiveIntensity > 0.5 ? 0.1 : 1.2;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: 560,
        height: 560,
        filter: 'drop-shadow(0 4px 24px rgba(37,99,235,0.15))',
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
}
