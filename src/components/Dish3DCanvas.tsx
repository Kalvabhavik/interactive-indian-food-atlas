import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HistoricalStage } from "../data/culinaryHistoryData";
import { Dish } from "../data/foodData";
import { useTheme } from "../context/ThemeContext";

interface Dish3DCanvasProps {
  dish: Dish;
  currentStage: HistoricalStage;
  currentStageIndex: number;
  scrollProgress?: number; // 0 to 1
  isMuted?: boolean;
}

export const Dish3DCanvas: React.FC<Dish3DCanvasProps> = ({
  dish,
  currentStage,
  currentStageIndex,
  scrollProgress = 0,
}) => {
  const { isLight } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References to keep across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Lighting & floor refs for theme switching
  const floorMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Model & dynamic groups
  const foodRigRef = useRef<{
    rootGroup: THREE.Group;
    stageGroups: THREE.Group[];
    steamParticles?: THREE.Points;
    spiceParticles?: THREE.Group;
    embersGroup?: THREE.Group;
    dosaGroup?: THREE.Group;
    biryaniGroup?: THREE.Group;
    universalGroup?: THREE.Group;
    doughSealMesh?: THREE.Mesh;
    handiLidMesh?: THREE.Mesh;
    dosaCrepeMesh?: THREE.Mesh;
    batterMesh?: THREE.Mesh;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    emberLight: THREE.PointLight;
  } | null>(null);

  // Target camera state for smooth lerp
  const targetCamPos = useRef(new THREE.Vector3(0, 3.2, 4.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    const initBg = isLight ? "#f6f2e9" : "#08090d";
    scene.background = new THREE.Color(initBg);
    scene.fog = new THREE.FogExp2(initBg, isLight ? 0.05 : 0.08);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 4.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.15 : 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below floor
    controls.minDistance = 1.8;
    controls.maxDistance = 8.5;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(isLight ? 0xfff7ed : 0xffecd2, isLight ? 0.95 : 0.6);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(isLight ? 0xfed7aa : 0x93c5fd, isLight ? 0.85 : 0.7);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const emberLight = new THREE.PointLight(0xf97316, 2.5, 6, 1.5);
    emberLight.position.set(0, -0.2, 0);
    scene.add(emberLight);

    // 6. Floor Pedestal / Slate Table
    const floorGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.2, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe7e0d3 : 0x12141a,
      roughness: 0.85,
      metalness: isLight ? 0.1 : 0.25,
    });
    floorMatRef.current = floorMat;
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle decorative concentric ring on table
    const ringGeo = new THREE.RingGeometry(2.4, 2.44, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.49;
    scene.add(ring);

    // 7. Master Root Group for Food Model
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Build the specific model rig depending on dish
    const isDosa = dish.id === "masala-dosa";
    const isBiryani = dish.id === "hyderabadi-biryani";

    let dosaGroup: THREE.Group | undefined;
    let biryaniGroup: THREE.Group | undefined;
    let universalGroup: THREE.Group | undefined;
    let doughSealMesh: THREE.Mesh | undefined;
    let handiLidMesh: THREE.Mesh | undefined;
    let dosaCrepeMesh: THREE.Mesh | undefined;
    let batterMesh: THREE.Mesh | undefined;

    if (isDosa) {
      const dosaRig = buildMasalaDosaRig();
      dosaGroup = dosaRig.group;
      dosaCrepeMesh = dosaRig.crepeMesh;
      batterMesh = dosaRig.batterMesh;
      rootGroup.add(dosaGroup);
    } else if (isBiryani) {
      const biryaniRig = buildHyderabadiBiryaniRig();
      biryaniGroup = biryaniRig.group;
      doughSealMesh = biryaniRig.doughSealMesh;
      handiLidMesh = biryaniRig.lidMesh;
      rootGroup.add(biryaniGroup);
    } else {
      const uniRig = buildUniversalFoodRig(dish);
      universalGroup = uniRig.group;
      rootGroup.add(universalGroup);
    }

    // 8. Dynamic Steam Particles
    const steamParticles = buildSteamParticleSystem();
    scene.add(steamParticles);

    // 9. Floating Spice Particles
    const spiceParticles = buildFloatingSpices();
    scene.add(spiceParticles);

    foodRigRef.current = {
      rootGroup,
      stageGroups: [],
      steamParticles,
      spiceParticles,
      dosaGroup,
      biryaniGroup,
      universalGroup,
      doughSealMesh,
      handiLidMesh,
      dosaCrepeMesh,
      batterMesh,
      keyLight,
      rimLight,
      emberLight,
    };

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera position interpolation towards target
      camera.position.lerp(targetCamPos.current, 0.05);
      controls.target.lerp(targetLookAt.current, 0.05);
      controls.update();

      // Gentle continuous ambient drift on root model
      if (rootGroup) {
        rootGroup.rotation.y += delta * 0.08;
      }

      // Animate floating spice particles
      if (spiceParticles) {
        spiceParticles.rotation.y += delta * 0.04;
        spiceParticles.children.forEach((spice, i) => {
          spice.rotation.x += delta * 0.3 * ((i % 2 === 0 ? 1 : -1));
          spice.rotation.z += delta * 0.2;
          spice.position.y += Math.sin(elapsedTime * 1.5 + i) * 0.0015;
        });
      }

      // Animate steam particles
      if (steamParticles) {
        const positions = steamParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += delta * 0.45; // rise upwards
          positions[i] += Math.sin(elapsedTime * 2 + positions[i + 1] * 3) * 0.002;
          // reset if too high
          if (positions[i + 1] > 2.5) {
            positions[i + 1] = 0.2 + Math.random() * 0.3;
            positions[i] = (Math.random() - 0.5) * 0.8;
            positions[i + 2] = (Math.random() - 0.5) * 0.8;
          }
        }
        steamParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse ember light
      if (emberLight) {
        emberLight.intensity = 2.0 + Math.sin(elapsedTime * 3.5) * 0.6;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      controls.dispose();
    };
  }, [dish.id]);

  // Update 3D Stage Transformations based on currentStage
  useEffect(() => {
    if (!foodRigRef.current || !sceneRef.current) return;

    const rig = foodRigRef.current;
    const stageIdx = currentStageIndex; // 0 to 6

    // Update target camera from stage data
    const [tx, ty, tz] = currentStage.threeSceneFocus.cameraTarget;
    const [cx, cy, cz] = currentStage.threeSceneFocus.cameraPosition;

    targetLookAt.current.set(tx, ty, tz);
    targetCamPos.current.set(cx, cy, cz);

    // Update background atmosphere
    const bgColor = isLight
      ? new THREE.Color("#f6f2e9").lerp(new THREE.Color("#fbf4e6"), currentStage.threeSceneFocus.ambientWarmth * 0.2)
      : new THREE.Color(currentStage.threeSceneFocus.atmosphereColor);
    sceneRef.current.background = bgColor;
    if (sceneRef.current.fog) {
      sceneRef.current.fog.color = bgColor;
      sceneRef.current.fog.density = isLight ? 0.05 : 0.08;
    }

    // Update lighting warmth
    rig.keyLight.intensity = isLight
      ? 1.9 + currentStage.threeSceneFocus.ambientWarmth * 0.6
      : 1.8 + currentStage.threeSceneFocus.ambientWarmth * 0.8;
    rig.rimLight.color.set(currentStageIndex >= 3 ? 0xf59e0b : 0xd97706);

    // ── MASALA DOSA SPECIFIC STAGE TRANSFORMATIONS ──
    if (rig.dosaGroup) {
      const isEarly = stageIdx < 2; // stage 1-2: raw grains / grinding
      const isBatter = stageIdx === 2 || stageIdx === 3; // batter on tawa
      const isCrispFolded = stageIdx >= 4; // folded golden crepe

      if (rig.batterMesh) {
        rig.batterMesh.visible = isBatter || isEarly;
        rig.batterMesh.scale.setScalar(stageIdx === 2 ? 0.75 : 1.05);
      }

      if (rig.dosaCrepeMesh) {
        rig.dosaCrepeMesh.visible = isCrispFolded;
        // Transform from semi-open to tightly rolled
        rig.dosaCrepeMesh.scale.set(
          stageIdx === 4 ? 0.9 : 1.0,
          stageIdx === 4 ? 0.85 : 1.0,
          1.0
        );
      }

      // Hide/show steam based on stage
      if (rig.steamParticles) {
        rig.steamParticles.visible = stageIdx >= 3;
      }
    }

    // ── HYDERABADI BIRYANI SPECIFIC STAGE TRANSFORMATIONS ──
    if (rig.biryaniGroup) {
      // Stage 1-3: Handi open, marinating / spices
      // Stage 4-5: Sealed with dough (dum)
      // Stage 6-7: Parda unsealed, steam release, golden rice top reveal
      const isSealed = stageIdx === 3 || stageIdx === 4;
      const isUnsealedFinished = stageIdx >= 5;

      if (rig.doughSealMesh) {
        rig.doughSealMesh.visible = isSealed;
      }

      if (rig.handiLidMesh) {
        rig.handiLidMesh.visible = isSealed;
        rig.handiLidMesh.position.y = isSealed ? 1.05 : 2.5;
        // Lift lid dramatically in stage 6
        if (isUnsealedFinished) {
          rig.handiLidMesh.visible = false;
        }
      }

      if (rig.steamParticles) {
        rig.steamParticles.visible = isUnsealedFinished || stageIdx === 3;
      }
    }
  }, [currentStage, currentStageIndex, isLight]);

  // Dynamically update Three.js background, fog, and floor colors when theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    if (isLight) {
      scene.background = new THREE.Color("#f6f2e9");
      scene.fog = new THREE.FogExp2("#f6f2e9", 0.05);
      if (floorMatRef.current) {
        floorMatRef.current.color.set(0xe7e0d3);
        floorMatRef.current.metalness = 0.1;
      }
      if (ambientLightRef.current) {
        ambientLightRef.current.color.set(0xfff7ed);
        ambientLightRef.current.intensity = 0.95;
      }
      if (fillLightRef.current) {
        fillLightRef.current.color.set(0xfed7aa);
        fillLightRef.current.intensity = 0.85;
      }
    } else {
      scene.background = new THREE.Color("#08090d");
      scene.fog = new THREE.FogExp2("#08090d", 0.08);
      if (floorMatRef.current) {
        floorMatRef.current.color.set(0x12141a);
        floorMatRef.current.metalness = 0.25;
      }
      if (ambientLightRef.current) {
        ambientLightRef.current.color.set(0xffecd2);
        ambientLightRef.current.intensity = 0.6;
      }
      if (fillLightRef.current) {
        fillLightRef.current.color.set(0x93c5fd);
        fillLightRef.current.intensity = 0.7;
      }
    }
  }, [isLight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] md:min-h-[580px] select-none cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-80" />

      {/* 3D Orbit Indicator Pill */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-[11px] font-medium tracking-wide shadow-xl transition-all ${
          isLight
            ? "bg-white/85 border border-amber-900/15 text-amber-950 shadow-amber-900/10"
            : "bg-black/60 border border-amber-500/30 text-amber-200/90"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Drag to orbit 3D model • Scroll to evolve story</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROCEDURAL 3D MODEL BUILDERS
// ─────────────────────────────────────────────

/**
 * Procedural 3D Rig for Masala Dosa
 * Features: Cast iron tawa, banana leaf, golden rolled crepe,
 * spiced potato core, brass chutney katoris, raw grains.
 */
function buildMasalaDosaRig() {
  const group = new THREE.Group();

  // 1. Cast Iron Tawa (Griddle)
  const tawaGeo = new THREE.CylinderGeometry(2.1, 2.15, 0.08, 64);
  const tawaMat = new THREE.MeshStandardMaterial({
    color: 0x1f2228,
    roughness: 0.8,
    metalness: 0.7,
  });
  const tawa = new THREE.Mesh(tawaGeo, tawaMat);
  tawa.position.y = -0.4;
  tawa.receiveShadow = true;
  group.add(tawa);

  // Tawa Brass Handle
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.85,
    roughness: 0.35,
  });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(2.6, -0.4, 0);
  group.add(handle);

  // 2. Fresh Banana Leaf Platter
  const leafShape = new THREE.Shape();
  leafShape.moveTo(-1.8, -0.9);
  leafShape.quadraticCurveTo(0, -1.2, 1.8, -0.9);
  leafShape.quadraticCurveTo(2.1, 0, 1.8, 0.9);
  leafShape.quadraticCurveTo(0, 1.2, -1.8, 0.9);
  leafShape.quadraticCurveTo(-2.1, 0, -1.8, -0.9);

  const leafGeo = new THREE.ShapeGeometry(leafShape);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x166534, // rich emerald green
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.rotation.x = -Math.PI / 2;
  leaf.position.set(0, -0.35, 0);
  leaf.receiveShadow = true;
  group.add(leaf);

  // 3. Spreading Batter Layer (Stage 2-3)
  const batterGeo = new THREE.CircleGeometry(1.65, 48);
  const batterMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.7,
    metalness: 0.05,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const batterMesh = new THREE.Mesh(batterGeo, batterMat);
  batterMesh.rotation.x = -Math.PI / 2;
  batterMesh.position.set(0, -0.34, 0);
  group.add(batterMesh);

  // 4. Golden Crisp Cylindrical Dosa Crepe (Stage 4-6)
  // Formed as an open curved rolled cylinder
  const crepeCurve = new THREE.CylinderGeometry(0.38, 0.38, 2.7, 36, 1, true, 0, Math.PI * 1.75);
  const crepeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // golden brown roasted hue
    roughness: 0.65,
    metalness: 0.15,
    side: THREE.DoubleSide,
  });
  const crepeMesh = new THREE.Mesh(crepeCurve, crepeMat);
  crepeMesh.rotation.z = Math.PI / 2;
  crepeMesh.rotation.y = 0.2;
  crepeMesh.position.set(0, -0.05, 0);
  crepeMesh.castShadow = true;
  group.add(crepeMesh);

  // 5. Spiced Potato Filling Core (Yellow-gold chunks inside crepe)
  const potatoCoreGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.2, 16);
  const potatoCoreMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, // turmeric spiced potato yellow
    roughness: 0.9,
    metalness: 0.05,
  });
  const potatoCore = new THREE.Mesh(potatoCoreGeo, potatoCoreMat);
  potatoCore.rotation.z = Math.PI / 2;
  potatoCore.position.set(0, -0.06, 0);
  group.add(potatoCore);

  // 6. Brass Katoris (Bowls for Chutney and Sambar)
  const katoriGeo = new THREE.CylinderGeometry(0.4, 0.28, 0.25, 24);
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.9,
    roughness: 0.3,
  });

  // Chutney Bowl 1: White Coconut Chutney
  const bowl1 = new THREE.Mesh(katoriGeo, brassMat);
  bowl1.position.set(-1.1, -0.22, 1.0);
  group.add(bowl1);

  const chutneyGeo = new THREE.CircleGeometry(0.36, 24);
  const chutneyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
  });
  const chutney = new THREE.Mesh(chutneyGeo, chutneyMat);
  chutney.rotation.x = -Math.PI / 2;
  chutney.position.set(-1.1, -0.1, 1.0);
  group.add(chutney);

  // Chutney Bowl 2: Red Sambar
  const bowl2 = new THREE.Mesh(katoriGeo, brassMat);
  bowl2.position.set(1.1, -0.22, 1.0);
  group.add(bowl2);

  const sambarMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // rich red sambar
    roughness: 0.35,
  });
  const sambar = new THREE.Mesh(chutneyGeo, sambarMat);
  sambar.rotation.x = -Math.PI / 2;
  sambar.position.set(1.1, -0.1, 1.0);
  group.add(sambar);

  return { group, crepeMesh, batterMesh };
}

/**
 * Procedural 3D Rig for Hyderabadi Dum Biryani
 * Features: Heavy copper/brass Handi (Degchi), glowing charcoal coals,
 * dough seal (parda), brass lid, glistening two-toned basmati rice mound,
 * fried onions (birista), whole spices.
 */
function buildHyderabadiBiryaniRig() {
  const group = new THREE.Group();

  // 1. Traditional Copper Handi (Degchi)
  // Lathe-style profile using points
  const points = [];
  points.push(new THREE.Vector2(0.9, -0.45)); // base
  points.push(new THREE.Vector2(1.5, -0.2));  // wide belly
  points.push(new THREE.Vector2(1.65, 0.2));  // upper belly
  points.push(new THREE.Vector2(1.2, 0.7));   // narrow neck
  points.push(new THREE.Vector2(1.4, 0.9));   // flared rim
  points.push(new THREE.Vector2(1.35, 0.95)); // inner rim lip

  const handiGeo = new THREE.LatheGeometry(points, 48);
  const handiMat = new THREE.MeshStandardMaterial({
    color: 0xb45309, // hammered copper
    metalness: 0.88,
    roughness: 0.35,
  });
  const handiMesh = new THREE.Mesh(handiGeo, handiMat);
  handiMesh.castShadow = true;
  handiMesh.receiveShadow = true;
  group.add(handiMesh);

  // 2. Glowing Charcoal Embers Base
  const embersGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.15, 24);
  const embersMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.95,
    emissive: 0xea580c,
    emissiveIntensity: 0.8,
  });
  const embersMesh = new THREE.Mesh(embersGeo, embersMat);
  embersMesh.position.y = -0.52;
  group.add(embersMesh);

  // 3. Rice Mound Inside Handi
  const riceMoundGeo = new THREE.SphereGeometry(1.3, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const riceMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a, // saffron yellow with white flecks
    roughness: 0.75,
    metalness: 0.1,
  });
  const riceMound = new THREE.Mesh(riceMoundGeo, riceMat);
  riceMound.position.y = 0.55;
  group.add(riceMound);

  // 4. Caramelized Fried Onions (Birista) & Garnish Flecks
  const garnishGeo = new THREE.RingGeometry(0.3, 1.1, 24);
  const garnishMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // dark caramelized brown
    roughness: 0.9,
    side: THREE.DoubleSide,
  });
  const garnish = new THREE.Mesh(garnishGeo, garnishMat);
  garnish.rotation.x = -Math.PI / 2;
  garnish.position.set(0, 0.85, 0);
  group.add(garnish);

  // 5. Whole Spices (Star Anise & Cinnamon Bark)
  // Star Anise in center
  const starGeo = new THREE.ConeGeometry(0.12, 0.28, 8);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.8,
  });
  for (let i = 0; i < 6; i++) {
    const starPetal = new THREE.Mesh(starGeo, starMat);
    starPetal.rotation.z = (i * Math.PI) / 3;
    starPetal.position.set(0, 0.92, 0);
    group.add(starPetal);
  }

  // Cinnamon bark rolls
  const cinnamonGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.8, 12);
  const cinnamonMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85,
  });
  const cinnamon1 = new THREE.Mesh(cinnamonGeo, cinnamonMat);
  cinnamon1.rotation.set(0.3, 0.5, 1.2);
  cinnamon1.position.set(0.4, 0.88, 0.2);
  group.add(cinnamon1);

  // 6. Dough Seal Ring (Parda)
  const doughGeo = new THREE.TorusGeometry(1.36, 0.07, 16, 48);
  const doughMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a, // pale raw wheat atta dough
    roughness: 0.85,
  });
  const doughSealMesh = new THREE.Mesh(doughGeo, doughMat);
  doughSealMesh.rotation.x = Math.PI / 2;
  doughSealMesh.position.y = 0.92;
  doughSealMesh.visible = false; // toggled by stage
  group.add(doughSealMesh);

  // 7. Heavy Brass Handi Lid
  const lidPoints = [];
  lidPoints.push(new THREE.Vector2(0, 0.3));    // center knob
  lidPoints.push(new THREE.Vector2(0.15, 0.25));
  lidPoints.push(new THREE.Vector2(0.1, 0.15));
  lidPoints.push(new THREE.Vector2(1.38, 0.02)); // flared outer rim
  const lidGeo = new THREE.LatheGeometry(lidPoints, 48);
  const lidMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // polished brass
    metalness: 0.9,
    roughness: 0.28,
  });
  const lidMesh = new THREE.Mesh(lidGeo, lidMat);
  lidMesh.position.y = 0.95;
  lidMesh.visible = false; // toggled by stage
  group.add(lidMesh);

  return { group, doughSealMesh, lidMesh };
}

/**
 * Universal Procedural 3D Rig for all other 64 dishes
 * Adapts geometry according to culinary category (curry, bread, steamed, dessert).
 */
function buildUniversalFoodRig(dish: Dish) {
  const group = new THREE.Group();

  if (dish.category === "curry-stew") {
    // Earthen/Brass Kadai with simmering curry
    const kadaiPoints = [];
    kadaiPoints.push(new THREE.Vector2(0.6, -0.3));
    kadaiPoints.push(new THREE.Vector2(1.4, 0.1));
    kadaiPoints.push(new THREE.Vector2(1.6, 0.5));
    kadaiPoints.push(new THREE.Vector2(1.7, 0.55));
    const kadaiGeo = new THREE.LatheGeometry(kadaiPoints, 36);
    const kadaiMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.75,
      roughness: 0.4,
    });
    const kadai = new THREE.Mesh(kadaiGeo, kadaiMat);
    group.add(kadai);

    // Curry Liquid Surface
    const liquidGeo = new THREE.CircleGeometry(1.48, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: dish.tasteProfile.toLowerCase().includes("fiery") ? 0xb91c1c : 0xd97706,
      roughness: 0.35,
      metalness: 0.1,
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 0.42;
    group.add(liquid);

    // Garnish swirl
    const garnishGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 24);
    const garnishMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const garnish = new THREE.Mesh(garnishGeo, garnishMat);
    garnish.rotation.x = Math.PI / 2;
    garnish.position.y = 0.44;
    group.add(garnish);
  } else if (dish.category === "grain-bread" || dish.category === "snack") {
    // Stone Platter with golden baked breads / dumplings
    const platterGeo = new THREE.CylinderGeometry(1.8, 1.85, 0.1, 36);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.7,
      metalness: 0.3,
    });
    const platter = new THREE.Mesh(platterGeo, platterMat);
    platter.position.y = -0.35;
    group.add(platter);

    // Three golden bread/dumpling spheres or flat discs
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const breadGeo = new THREE.SphereGeometry(0.42, 24, 16);
      const breadMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.85,
        metalness: 0.1,
      });
      const bread = new THREE.Mesh(breadGeo, breadMat);
      bread.scale.set(1.2, 0.65, 1.2);
      bread.position.set(Math.cos(angle) * 0.75, -0.15, Math.sin(angle) * 0.75);
      bread.castShadow = true;
      group.add(bread);
    }
  } else {
    // Steamed/Sweet Terracotta Bowl
    const bowlGeo = new THREE.CylinderGeometry(1.2, 0.7, 0.65, 32);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412, // terracotta red
      roughness: 0.9,
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.y = -0.15;
    group.add(bowl);

    const sweetGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.1, 32);
    const sweetMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.45,
    });
    const sweet = new THREE.Mesh(sweetGeo, sweetMat);
    sweet.position.y = 0.15;
    group.add(sweet);
  }

  return { group };
}

/**
 * High-performance procedural steam particle system
 */
function buildSteamParticleSystem() {
  const particleCount = 140;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 0.8;
    positions[i + 1] = Math.random() * 2.2;
    positions[i + 2] = (Math.random() - 0.5) * 0.8;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffedd5,
    size: 0.22,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Floating Spices particle cluster
 */
function buildFloatingSpices() {
  const group = new THREE.Group();

  const spiceGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const pepperMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
  const cardamomMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.6 });

  for (let i = 0; i < 18; i++) {
    const isCardamom = i % 3 === 0;
    const mesh = new THREE.Mesh(spiceGeo, isCardamom ? cardamomMat : pepperMat);
    if (isCardamom) mesh.scale.set(1.5, 2.2, 1.5);

    const radius = 1.4 + Math.random() * 1.2;
    const theta = Math.random() * Math.PI * 2;
    mesh.position.set(Math.cos(theta) * radius, 0.3 + Math.random() * 1.5, Math.sin(theta) * radius);
    group.add(mesh);
  }

  return group;
}
