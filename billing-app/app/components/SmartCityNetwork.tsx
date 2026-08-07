"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node {
    index: number;
    position: THREE.Vector3;
    connections: number[];
    pulseOffset: number;
}

interface Pulse {
    progress: number;
    speed: number;
    nodeA: number;
    nodeB: number;
    mesh: THREE.Mesh;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GRID_SIZE = 18;
const GRID_SPACING = 2.2;
const NODE_RATIO = 0.12;
const CONNECTION_DISTANCE = 7.5;
const BUILDING_COUNT = GRID_SIZE * GRID_SIZE;

export default function SmartCityNetwork() {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        animFrameId: number;
    } | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;

        // ── 1. SCENE SETUP ────────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x141413, 0.022);

        const camera = new THREE.PerspectiveCamera(
            55,
            container.clientWidth / container.clientHeight,
            0.1,
            200
        );
        camera.position.set(0, 18, 28);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = false;
        container.appendChild(renderer.domElement);

        // ── 2. LIGHTING ───────────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0x0a1628, 2.5));
        const dirLight = new THREE.DirectionalLight(0x1a3a6e, 1.5);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // ── 3. NODE GRID POSITIONS ────────────────────────────────────────────────
        const buildingPositions: THREE.Vector3[] = [];
        const buildingHeights: number[] = [];

        const offset = ((GRID_SIZE - 1) * GRID_SPACING) / 2;
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const height = 0.4 + Math.pow(Math.random(), 1.5) * 3.8;
                const x = col * GRID_SPACING - offset;
                const z = row * GRID_SPACING - offset;
                buildingPositions.push(new THREE.Vector3(x, height / 2, z));
                buildingHeights.push(height);
            }
        }

        // ── 5. NODE DESIGNATION ───────────────────────────────────────────────────
        // Nodes are special buildings acting as network hubs
        const nodeCount = Math.floor(BUILDING_COUNT * NODE_RATIO);
        const nodeIndices = new Set<number>();
        while (nodeIndices.size < nodeCount) {
            nodeIndices.add(Math.floor(Math.random() * BUILDING_COUNT));
        }

        // Node glow spheres (rendered on top of buildings)
        const nodeGeo = new THREE.SphereGeometry(0.22, 8, 8);
        const nodeMat = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            emissive: 0x00aaff,
            emissiveIntensity: 1.8,
            roughness: 0.1,
            metalness: 0.8,
        });

        const nodes: Node[] = [];
        const nodeMeshes: THREE.Mesh[] = [];

        nodeIndices.forEach((ni) => {
            const pos = buildingPositions[ni].clone();
            pos.y = buildingHeights[ni] + 0.3;

            const sphere = new THREE.Mesh(nodeGeo, nodeMat.clone());
            sphere.position.copy(pos);
            scene.add(sphere);
            nodeMeshes.push(sphere);

            nodes.push({
                index: ni,
                position: pos,
                connections: [],
                pulseOffset: Math.random() * Math.PI * 2,
            });
        });

        // ── 6. CONNECTION LINES ───────────────────────────────────────────────────
        // Connect nearby nodes with glowing lines
        const connectionLines: THREE.Line[] = [];
        const connectionPairs: [number, number][] = [];

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = nodes[i].position.distanceTo(nodes[j].position);
                if (dist < CONNECTION_DISTANCE) {
                    nodes[i].connections.push(j);
                    nodes[j].connections.push(i);
                    connectionPairs.push([i, j]);

                    const points = [nodes[i].position, nodes[j].position];
                    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                    const lineMat = new THREE.LineBasicMaterial({
                        color: 0x0066aa,
                        transparent: true,
                        opacity: 0.0, // fades in via GSAP scroll
                    });
                    const line = new THREE.Line(lineGeo, lineMat);
                    scene.add(line);
                    connectionLines.push(line);
                }
            }
        }

        // ── 7. ENERGY PULSES ──────────────────────────────────────────────────────
        // Small spheres travelling along connection lines
        const pulseGeo = new THREE.SphereGeometry(0.09, 6, 6);
        const pulseMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 3.0,
        });

        const pulses: Pulse[] = [];
        connectionPairs.slice(0, 30).forEach(([a, b]) => {
            const mesh = new THREE.Mesh(pulseGeo, pulseMat.clone());
            mesh.visible = false;
            scene.add(mesh);
            pulses.push({
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.004,
                nodeA: a,
                nodeB: b,
                mesh,
            });
        });

        // ── 8. FLOATING PARTICLES ─────────────────────────────────────────────────
        const particleCount = 300;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 60;
            particlePositions[i * 3 + 1] = Math.random() * 20;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
        particleGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3)
        );
        const particleMat = new THREE.PointsMaterial({
            color: 0x004466,
            size: 0.08,
            transparent: true,
            opacity: 0.6,
        });
        scene.add(new THREE.Points(particleGeo, particleMat));

        // ── 9. GSAP IDLE ANIMATIONS ───────────────────────────────────────────────
        // Camera drift
        const camTarget = { x: 0, y: 18, z: 28 };
        gsap.to(camTarget, {
            x: 3,
            y: 19,
            z: 26,
            duration: 8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });

        // Node pulse — scale breathing
        nodeMeshes.forEach((mesh, i) => {
            gsap.to(mesh.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 1.4 + Math.random() * 1.2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: nodes[i].pulseOffset * 0.3,
            });
            // Emissive intensity pulse
            gsap.to((mesh.material as THREE.MeshStandardMaterial), {
                emissiveIntensity: 3.5,
                duration: 1.8 + Math.random(),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: nodes[i].pulseOffset * 0.4,
            });
        });

        // ── 10. SCROLL TRIGGER ────────────────────────────────────────────────────
        const scrollState = { progress: 0 };
        ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            onUpdate: (self) => {
                scrollState.progress = self.progress;
                // Fade in connections as user scrolls
                connectionLines.forEach((line, i) => {
                    const threshold = i / connectionLines.length;
                    const targetOpacity = self.progress > threshold * 0.5 ? 0.35 : 0.0;
                    (line.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(
                        (line.material as THREE.LineBasicMaterial).opacity,
                        targetOpacity,
                        0.1
                    );
                });
                // Activate more nodes
                nodeMeshes.forEach((mesh, i) => {
                    const threshold = i / nodeMeshes.length;
                    if (self.progress > threshold) {
                        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5;
                    }
                });
            },
        });

        // ── 11. MOUSE PARALLAX ────────────────────────────────────────────────────
        const mouse = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", handleMouseMove);

        // ── 12. RAYCASTING (node hover) ───────────────────────────────────────────
        const raycaster = new THREE.Raycaster();
        const mouseVec = new THREE.Vector2();
        let hoveredNodeIdx = -1;

        const handleClick = (e: MouseEvent) => {
            mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVec, camera);
            const hits = raycaster.intersectObjects(nodeMeshes);
            if (hits.length > 0) {
                const ni = nodeMeshes.indexOf(hits[0].object as THREE.Mesh);
                if (ni !== hoveredNodeIdx) {
                    // Reset previous
                    if (hoveredNodeIdx >= 0) {
                        gsap.to((nodeMeshes[hoveredNodeIdx].material as THREE.MeshStandardMaterial), {
                            emissiveIntensity: 1.8,
                            duration: 0.3,
                        });
                    }
                    hoveredNodeIdx = ni;
                    // Highlight
                    gsap.to((nodeMeshes[ni].material as THREE.MeshStandardMaterial), {
                        emissiveIntensity: 5.0,
                        duration: 0.2,
                    });
                }
            }
        };
        window.addEventListener("click", handleClick);

        // ── 13. RESIZE HANDLER ────────────────────────────────────────────────────
        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        // ── 14. RENDER LOOP ───────────────────────────────────────────────────────
        let animFrameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animFrameId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Camera: GSAP drift + mouse parallax
            camera.position.x = camTarget.x + mouse.x * 1.5;
            camera.position.y = camTarget.y - mouse.y * 1.0;
            camera.position.z = camTarget.z;
            camera.lookAt(0, 1, 0);

            // Scroll zoom
            camera.position.z = camTarget.z - scrollState.progress * 10;
            camera.position.y = camTarget.y - scrollState.progress * 4;

            // Energy pulses travel along connection lines
            pulses.forEach((pulse) => {
                pulse.progress += pulse.speed;
                if (pulse.progress > 1) {
                    pulse.progress = 0;
                    pulse.mesh.visible = Math.random() > 0.3;
                }
                const posA = nodes[pulse.nodeA].position;
                const posB = nodes[pulse.nodeB].position;
                pulse.mesh.position.lerpVectors(posA, posB, pulse.progress);
            });

            // Subtle particle drift
            const pos = particleGeo.attributes.position.array as Float32Array;
            for (let i = 1; i < particleCount * 3; i += 3) {
                pos[i] += Math.sin(elapsed * 0.3 + i) * 0.001;
            }
            particleGeo.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        sceneRef.current = { renderer, scene, camera, animFrameId:0 };

        // ── 15. CLEANUP ───────────────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((t) => t.kill());
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <section className="relative w-full h-full">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
        </section>
    );
}