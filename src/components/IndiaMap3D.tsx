import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  GeoJsonCollection,
  State3DData,
  buildStates3DData,
  buildNeighboringCountries3D,
  createWorldCanvasTexture,
  getEarthAlignmentQuaternion,
  getStateColors,
  VisualTheme,
  CULINARY_TOUR_STOPS,
  EARTH_RADIUS,
} from "../utils/map3dUtils";
import { SHORT_NAMES, STATE_EMOJIS, FOOD_DATA } from "../data/foodData";
import {
  Compass,
  Sun,
  Moon,
  Mountain,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Info,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface IndiaMap3DProps {
  selectedState: string | null;
  onSelectState: (stateName: string | null) => void;
  hoveredState: string | null;
  onHoverState: (stateName: string | null) => void;
  searchFilter?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

interface CameraAnimation {
  active: boolean;
  startTime: number;
  duration: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
}

const DEFAULT_CAM_POS = new THREE.Vector3(0, 31, 27);
const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0, 0);

export const IndiaMap3D: React.FC<IndiaMap3DProps> = ({
  selectedState,
  onSelectState,
  hoveredState,
  onHoverState,
  searchFilter = "",
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const { isLight } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States & References
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [theme, setTheme] = useState<VisualTheme>(isLight ? "relief" : "relief");
  const [statesData, setStatesData] = useState<State3DData[]>([]);
  const [neighborGeom, setNeighborGeom] = useState<THREE.BufferGeometry | null>(null);
  const [worldGeojson, setWorldGeojson] = useState<GeoJsonCollection | null>(null);
  const [tourActive, setTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [compassAngle, setCompassAngle] = useState(0);
  const [screenLabels, setScreenLabels] = useState<
    { name: string; shortName: string; emoji: string; x: number; y: number; visible: boolean; isSelected: boolean }[]
  >([]);

  // Synchronize 3D Earth theme whenever global isLight mode is toggled
  const prevIsLightRef = useRef(isLight);
  useEffect(() => {
    if (prevIsLightRef.current !== isLight) {
      prevIsLightRef.current = isLight;
      setTheme(isLight ? "relief" : "midnight");
    }
  }, [isLight]);

  // Three.js runtime references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const stateGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const stateMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const beaconRingsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const neighborMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const worldTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const waterUniformsRef = useRef<{
    uTime: { value: number };
    uTheme: { value: number };
    uIsLight: { value: number };
    uWorldMap: { value: THREE.CanvasTexture | null };
  }>({
    uTime: { value: 0 },
    uTheme: { value: 0 },
    uIsLight: { value: isLight ? 1 : 0 },
    uWorldMap: { value: null },
  });

  // Camera Animation
  const cameraAnimRef = useRef<CameraAnimation>({
    active: false,
    startTime: 0,
    duration: 1100,
    startPos: DEFAULT_CAM_POS.clone(),
    endPos: DEFAULT_CAM_POS.clone(),
    startTarget: DEFAULT_LOOK_AT.clone(),
    endTarget: DEFAULT_LOOK_AT.clone(),
  });

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-999, -999));
  const hoveredStateRef = useRef<string | null>(null);
  const selectedStateRef = useRef<string | null>(null);
  const isInteractingRef = useRef(false);

  hoveredStateRef.current = hoveredState;
  selectedStateRef.current = selectedState;

  // ─────────────────────────────────────────────
  // SMOOTH CAMERA TRANSITIONS
  // ─────────────────────────────────────────────
  const animateCameraTo = useCallback(
    (targetPos: THREE.Vector3, targetLookAt: THREE.Vector3, duration: number = 1100) => {
      if (!cameraRef.current || !controlsRef.current) return;
      cameraAnimRef.current = {
        active: true,
        startTime: performance.now(),
        duration,
        startPos: cameraRef.current.position.clone(),
        endPos: targetPos.clone(),
        startTarget: controlsRef.current.target.clone(),
        endTarget: targetLookAt.clone(),
      };
    },
    []
  );

  const resetCamera = useCallback(() => {
    animateCameraTo(DEFAULT_CAM_POS, DEFAULT_LOOK_AT, 1200);
  }, [animateCameraTo]);

  // Focus on a specific state
  const focusOnState = useCallback(
    (stateName: string) => {
      const stateObj = statesData.find((s) => s.name === stateName);
      if (!stateObj) return;

      const [cx, cy, cz] = stateObj.centroid;
      const targetLookAt = new THREE.Vector3(cx, cy + 0.3, cz);

      // Frame at cinematic 45° angle, closer for tiny states (e.g., Delhi, Goa)
      const isTiny = ["Delhi", "Goa", "Puducherry", "Sikkim", "Chandigarh"].includes(stateName);
      const dist = isTiny ? 7.5 : 12.5;
      const targetPos = new THREE.Vector3(cx, cy + dist * 0.75, cz + dist * 0.85);

      animateCameraTo(targetPos, targetLookAt, 1100);
    },
    [statesData, animateCameraTo]
  );

  // ─────────────────────────────────────────────
  // LOAD GEOJSON & GENERATE 3D SPHERICAL SUB-CONTINENT & WORLD
  // ─────────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;
    setLoadingProgress(20);

    async function loadMapData() {
      try {
        // 1. Load India GeoJSON
        let responseIndia: Response | null = null;
        try {
          responseIndia = await fetch("/india.geojson");
        } catch {
          // fallback
        }
        if (!responseIndia || !responseIndia.ok) {
          responseIndia = await fetch(
            "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/india.geojson"
          );
        }
        if (!responseIndia.ok) throw new Error("Failed to load India map boundaries");
        setLoadingProgress(50);

        const geojsonIndia: GeoJsonCollection = await responseIndia.json();
        if (isCancelled) return;

        // 2. Load World GeoJSON (other countries for globe completion)
        let responseWorld: Response | null = null;
        try {
          responseWorld = await fetch("/world.geojson");
        } catch {
          // fallback
        }
        if (!responseWorld || !responseWorld.ok) {
          responseWorld = await fetch(
            "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
          );
        }

        let geojsonWorld: GeoJsonCollection | null = null;
        if (responseWorld && responseWorld.ok) {
          geojsonWorld = await responseWorld.json();
        }

        if (isCancelled) return;
        setLoadingProgress(75);

        // Build India 3D States (interactive)
        const built = buildStates3DData(geojsonIndia);
        setStatesData(built);

        // Build Neighboring Countries (non-clickable 3D physical landmass)
        if (geojsonWorld) {
          setWorldGeojson(geojsonWorld);
          const neighbor3D = buildNeighboringCountries3D(geojsonWorld);
          setNeighborGeom(neighbor3D);
        }

        setLoadingProgress(100);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading India and World 3D map data:", err);
        setIsLoading(false);
      }
    }

    loadMapData();

    return () => {
      isCancelled = true;
    };
  }, []);

  // ─────────────────────────────────────────────
  // INITIALIZE THREE.JS SCENE WITH 3D EARTH SPHERE & OTHER COUNTRIES
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || statesData.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    let bgColor = 0x090f1d;
    if (isLight) {
      bgColor = theme === "midnight" ? 0x060911 : theme === "golden" ? 0xf8ede2 : 0xdde7f2;
    } else {
      bgColor = theme === "midnight" ? 0x060911 : theme === "golden" ? 0x150d09 : 0x090f1d;
    }
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, isLight ? 0.007 : 0.009);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.copy(DEFAULT_CAM_POS);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.15; // stay above the globe horizon
    controls.minPolarAngle = 0.2;
    controls.minDistance = 8;
    controls.maxDistance = 65;
    controls.target.copy(DEFAULT_LOOK_AT);
    controlsRef.current = controls;

    controls.addEventListener("start", () => {
      isInteractingRef.current = true;
      cameraAnimRef.current.active = false;
    });
    controls.addEventListener("end", () => {
      isInteractingRef.current = false;
    });

    // 5. Lighting
    // Directional Sunlight casting soft realistic shadows
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    sunLight.position.set(24, 38, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 95;
    sunLight.shadow.camera.left = -28;
    sunLight.shadow.camera.right = 28;
    sunLight.shadow.camera.top = 28;
    sunLight.shadow.camera.bottom = -28;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.radius = 2.5;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Atmosphere Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x071527, 0.75);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Focused Spotlight for selected/hovered state
    const spotLight = new THREE.SpotLight(0xf59e0b, 2.5, 38, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 20, 0);
    spotLight.visible = false;
    scene.add(spotLight);
    scene.add(spotLight.target);
    spotLightRef.current = spotLight;

    // ─────────────────────────────────────────────
    // 6. 3D EARTH GLOBE SPHERE WITH ALL CONTINENTS
    // ─────────────────────────────────────────────
    const earthGeom = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);

    // Generate World Canvas Texture with all other countries
    let worldTex: THREE.CanvasTexture | null = null;
    if (worldGeojson) {
      worldTex = createWorldCanvasTexture(worldGeojson, theme, isLight);
      worldTextureRef.current = worldTex;
    }

    const waterUniforms = {
      uTime: { value: 0 },
      uTheme: { value: theme === "midnight" ? 2 : theme === "golden" ? 1 : 0 },
      uIsLight: { value: isLight ? 1 : 0 },
      uWorldMap: { value: worldTex },
    };
    waterUniformsRef.current = waterUniforms;

    // Normal, simple, smooth wave shader + world continents
    const earthMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        uniform float uTime;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position;

          // Normal simple, gentle, smooth wave undulations
          float wave1 = sin(pos.x * 0.32 + uTime * 0.95) * cos(pos.z * 0.32 + uTime * 0.8) * 0.08;
          float wave2 = sin(pos.y * 0.35 + uTime * 0.6) * 0.04;
          pos += normal * (wave1 + wave2);

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uTheme;
        uniform float uIsLight;
        uniform sampler2D uWorldMap;

        void main() {
          float wave = 0.5 + 0.5 * sin(vWorldPosition.x * 0.32 + uTime * 0.95) * cos(vWorldPosition.z * 0.32 + uTime * 0.8);

          vec3 deep;
          vec3 shallow;

          if (uIsLight > 0.5) {
            // ── DAYLIGHT SUNLIT EARTH OCEAN ──
            if (uTheme > 1.5) {
              shallow = vec3(0.08, 0.18, 0.32);
              deep = vec3(0.02, 0.06, 0.12);
            } else if (uTheme > 0.5) {
              // Golden Hour Sunset Day
              shallow = vec3(0.85, 0.55, 0.28);
              deep = vec3(0.35, 0.18, 0.08);
            } else {
              // Brilliant Daytime Turquoise / Azure Ocean
              shallow = vec3(0.14, 0.62, 0.85); // Sunlit tropical coastal turquoise
              deep = vec3(0.05, 0.32, 0.62);    // Rich vibrant sunlit blue
            }
          } else {
            // ── NIGHT EARTH OCEAN ──
            if (uTheme > 1.5) {
              shallow = vec3(0.04, 0.12, 0.22);
              deep = vec3(0.015, 0.03, 0.07);
            } else if (uTheme > 0.5) {
              shallow = vec3(0.24, 0.16, 0.10);
              deep = vec3(0.10, 0.06, 0.12);
            } else {
              shallow = vec3(0.07, 0.36, 0.52);
              deep = vec3(0.02, 0.12, 0.26);
            }
          }

          vec3 oceanColor = mix(deep, shallow, wave * 0.42);

          // Sample other world countries from the texture
          vec4 landSample = texture2D(uWorldMap, vUv);
          vec3 baseColor = oceanColor;
          if (landSample.a > 0.1) {
            baseColor = mix(oceanColor, landSample.rgb, 0.95);
          }

          // Atmosphere limb Fresnel glow around curvature
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(0.0, dot(viewDir, normalize(vNormal))), 2.5);
          
          vec3 atmoGlow;
          if (uIsLight > 0.5) {
            if (uTheme > 0.5 && uTheme < 1.5) {
              atmoGlow = vec3(1.0, 0.65, 0.3) * fresnel * 0.45;
            } else {
              // Daytime sky Rayleigh scattering atmospheric rim
              atmoGlow = vec3(0.4, 0.75, 1.0) * fresnel * 0.55;
            }
          } else {
            atmoGlow = (uTheme > 0.5 && uTheme < 1.5) 
              ? vec3(0.9, 0.5, 0.2) * fresnel * 0.4
              : vec3(0.25, 0.55, 0.9) * fresnel * 0.45;
          }

          gl_FragColor = vec4(baseColor + atmoGlow, 1.0);
        }
      `,
      transparent: false,
    });

    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    // Center at (0, -EARTH_RADIUS, 0) so the apex is at y = 0
    earthMesh.position.set(0, -EARTH_RADIUS, 0);
    // Align so India is at top apex
    earthMesh.quaternion.copy(getEarthAlignmentQuaternion());
    earthMesh.receiveShadow = true;
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Atmosphere Outer Glow Shell
    const atmoGeom = new THREE.SphereGeometry(EARTH_RADIUS + 0.6, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.25, 0.55, 0.95, 1.0) * intensity * 0.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeom, atmoMat);
    atmoMesh.position.set(0, -EARTH_RADIUS, 0);
    scene.add(atmoMesh);

    // ─────────────────────────────────────────────
    // 7. ADD NON-CLICKABLE 3D SURROUNDING COUNTRIES
    // ─────────────────────────────────────────────
    if (neighborGeom) {
      let neighborColor = 0x334155;
      if (theme === "golden") neighborColor = 0x5c3a21;
      else if (theme === "midnight") neighborColor = 0x0f172a;

      const neighborMat = new THREE.MeshStandardMaterial({
        color: neighborColor,
        roughness: 0.8,
        metalness: 0.05,
      });

      const neighborMesh = new THREE.Mesh(neighborGeom, neighborMat);
      neighborMesh.name = "NeighborCountries";
      neighborMesh.receiveShadow = true;
      neighborMesh.castShadow = true;
      // Not added to raycaster target list, so non-clickable
      scene.add(neighborMesh);
      neighborMeshRef.current = neighborMesh;
    }

    // ─────────────────────────────────────────────
    // 8. ADD 3D INTERACTIVE INDIAN STATE MESHES
    // ─────────────────────────────────────────────
    stateGroupsRef.current.clear();
    stateMeshesRef.current.clear();
    beaconRingsRef.current.clear();

    const ringGeom = new THREE.RingGeometry(0.35, 0.75, 32);
    ringGeom.rotateX(-Math.PI / 2);

    for (const stateObj of statesData) {
      const stateGroup = new THREE.Group();
      stateGroup.name = stateObj.name;
      stateGroup.userData = { stateName: stateObj.name, elevation: stateObj.elevation };

      // Colors
      const colors = getStateColors(stateObj.name, theme);

      // State Solid Extruded & Curved Mesh
      const stateMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colors.top),
        roughness: colors.roughness,
        metalness: colors.metalness,
      });

      const mesh = new THREE.Mesh(stateObj.meshGeometry, stateMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { stateName: stateObj.name };
      stateGroup.add(mesh);
      stateMeshesRef.current.set(stateObj.name, mesh);

      // Floating Selection Aura Ring (hidden until selected)
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const beaconRing = new THREE.Mesh(ringGeom, beaconMat);
      const [cx, cy, cz] = stateObj.centroid;
      beaconRing.position.set(cx, cy + 0.08, cz);
      stateGroup.add(beaconRing);
      beaconRingsRef.current.set(stateObj.name, beaconRing);

      // Add to scene
      scene.add(stateGroup);
      stateGroupsRef.current.set(stateObj.name, stateGroup);
    }

    // 9. Animation & Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const elapsedTime = clock.getElapsedTime();
      waterUniforms.uTime.value = elapsedTime;

      // Handle Smooth Camera Transitions
      if (cameraAnimRef.current.active) {
        const anim = cameraAnimRef.current;
        const now = performance.now();
        const t = Math.min(1, (now - anim.startTime) / anim.duration);

        // Smooth cubic ease-in-out
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
        controls.target.lerpVectors(anim.startTarget, anim.endTarget, ease);

        if (t >= 1) {
          anim.active = false;
        }
      }

      controls.update();

      // Update Compass Heading
      const azimuth = controls.getAzimuthalAngle();
      setCompassAngle((-azimuth * 180) / Math.PI);

      // Update State Physical Elevations (Spring Lerp)
      for (const [name, stateGroup] of stateGroupsRef.current.entries()) {
        const isSelected = selectedStateRef.current === name;
        const isHovered = hoveredStateRef.current === name;
        const isMatchingSearch =
          searchFilter.trim().length > 0 &&
          (name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            FOOD_DATA[name]?.dishes.some(
              (d) =>
                d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                d.ingredients.some((ing) => ing.toLowerCase().includes(searchFilter.toLowerCase()))
            ));

        // Target lift height
        let targetY = 0;
        if (isSelected) targetY = 0.95;
        else if (isHovered) targetY = 0.45;
        else if (isMatchingSearch) targetY = 0.35 + Math.sin(elapsedTime * 4) * 0.1;

        stateGroup.position.y = THREE.MathUtils.lerp(stateGroup.position.y, targetY, 0.14);

        // Material highlight dynamics (clean emissive glow, no white splints)
        const mesh = stateMeshesRef.current.get(name);
        const beacon = beaconRingsRef.current.get(name);

        if (mesh) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (isSelected) {
            mat.emissive.set(0xea580c);
            mat.emissiveIntensity = 0.35;
          } else if (isHovered) {
            mat.emissive.set(0xf59e0b);
            mat.emissiveIntensity = 0.25;
          } else if (isMatchingSearch) {
            mat.emissive.set(0x10b981);
            mat.emissiveIntensity = 0.28;
          } else {
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
          }
        }

        // Pulse beacon ring on selected state
        if (beacon) {
          const ringMat = beacon.material as THREE.MeshBasicMaterial;
          if (isSelected) {
            const pulse = 1.0 + 0.35 * Math.sin(elapsedTime * 3.5);
            beacon.scale.set(pulse, pulse, pulse);
            ringMat.opacity = 0.5 + 0.4 * Math.sin(elapsedTime * 3.5);
          } else {
            ringMat.opacity = 0;
          }
        }
      }

      // Update spotlight position to track selected or hovered state
      const targetStateName = selectedStateRef.current || hoveredStateRef.current;
      if (spotLightRef.current) {
        if (targetStateName) {
          const stateObj = statesData.find((s) => s.name === targetStateName);
          if (stateObj) {
            const [cx, cy, cz] = stateObj.centroid;
            spotLightRef.current.visible = true;
            spotLightRef.current.position.set(cx, cy + 14, cz + 2);
            spotLightRef.current.target.position.set(cx, cy, cz);
            spotLightRef.current.target.updateMatrixWorld();
          }
        } else {
          spotLightRef.current.visible = false;
        }
      }

      // Project 3D state coordinates to 2D screen labels
      if (rendererRef.current && cameraRef.current) {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const labels = statesData.map((s) => {
            const stateGroup = stateGroupsRef.current.get(s.name);
            const currentY = stateGroup ? stateGroup.position.y : 0;
            const worldPos = new THREE.Vector3(s.centroid[0], s.centroid[1] + currentY + 0.3, s.centroid[2]);

            // Check if behind camera
            const cameraDir = new THREE.Vector3();
            cameraRef.current!.getWorldDirection(cameraDir);
            const toPoint = worldPos.clone().sub(cameraRef.current!.position).normalize();
            const isBehind = cameraDir.dot(toPoint) <= 0;

            worldPos.project(cameraRef.current!);
            const screenX = ((worldPos.x + 1) / 2) * rect.width;
            const screenY = ((-worldPos.y + 1) / 2) * rect.height;

            return {
              name: s.name,
              shortName: SHORT_NAMES[s.name] || s.name.slice(0, 2).toUpperCase(),
              emoji: STATE_EMOJIS[s.name] || "🍲",
              x: screenX,
              y: screenY,
              visible: !isBehind && screenX > 20 && screenX < rect.width - 20 && screenY > 20 && screenY < rect.height - 20,
              isSelected: selectedStateRef.current === s.name,
            };
          });
          setScreenLabels(labels);
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // 10. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      earthGeom.dispose();
      earthMat.dispose();
      atmoGeom.dispose();
      atmoMat.dispose();
      ringGeom.dispose();
      if (worldTex) worldTex.dispose();
    };
  }, [statesData, neighborGeom, worldGeojson, theme]);

  // ─────────────────────────────────────────────
  // THEME COLOR UPDATE
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!sceneRef.current) return;

    let bgColor = 0x090f1d;
    if (isLight) {
      bgColor = theme === "midnight" ? 0x060911 : theme === "golden" ? 0xf8ede2 : 0xdde7f2;
    } else {
      bgColor = theme === "midnight" ? 0x060911 : theme === "golden" ? 0x150d09 : 0x090f1d;
    }
    sceneRef.current.background = new THREE.Color(bgColor);
    sceneRef.current.fog = new THREE.FogExp2(bgColor, isLight ? 0.007 : 0.009);

    if (waterUniformsRef.current) {
      waterUniformsRef.current.uTheme.value = theme === "midnight" ? 2 : theme === "golden" ? 1 : 0;
      waterUniformsRef.current.uIsLight.value = isLight ? 1 : 0;
      if (worldGeojson) {
        if (worldTextureRef.current) worldTextureRef.current.dispose();
        const updatedTex = createWorldCanvasTexture(worldGeojson, theme, isLight);
        worldTextureRef.current = updatedTex;
        waterUniformsRef.current.uWorldMap.value = updatedTex;
      }
    }

    if (neighborMeshRef.current) {
      const neighborMat = neighborMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isLight) {
        if (theme === "golden") neighborMat.color.set(0xb46b38);
        else if (theme === "midnight") neighborMat.color.set(0x1e293b);
        else neighborMat.color.set(0x8fae85); // fertile green-sand daylight landmass
      } else {
        if (theme === "golden") neighborMat.color.set(0x5c3a21);
        else if (theme === "midnight") neighborMat.color.set(0x0f172a);
        else neighborMat.color.set(0x334155);
      }
    }

    if (sunLightRef.current) {
      if (isLight) {
        if (theme === "golden") {
          sunLightRef.current.color.set(0xfb923c);
          sunLightRef.current.intensity = 2.4;
          sunLightRef.current.position.set(30, 24, 25);
        } else if (theme === "midnight") {
          sunLightRef.current.color.set(0x38bdf8);
          sunLightRef.current.intensity = 1.0;
          sunLightRef.current.position.set(15, 30, 15);
        } else {
          // Midday Daytime Sun: bright clear white sunlight
          sunLightRef.current.color.set(0xffffff);
          sunLightRef.current.intensity = 2.4;
          sunLightRef.current.position.set(24, 40, 22);
        }
      } else {
        if (theme === "golden") {
          sunLightRef.current.color.set(0xfb923c);
          sunLightRef.current.intensity = 2.2;
          sunLightRef.current.position.set(30, 20, 25);
        } else if (theme === "midnight") {
          sunLightRef.current.color.set(0x38bdf8);
          sunLightRef.current.intensity = 0.8;
          sunLightRef.current.position.set(15, 30, 15);
        } else {
          sunLightRef.current.color.set(0xfff7ed);
          sunLightRef.current.intensity = 1.6;
          sunLightRef.current.position.set(24, 38, 22);
        }
      }
    }

    if (hemiLightRef.current) {
      if (isLight) {
        if (theme === "midnight") {
          hemiLightRef.current.color.set(0x1e293b);
          hemiLightRef.current.groundColor.set(0x020617);
          hemiLightRef.current.intensity = 0.5;
        } else if (theme === "golden") {
          hemiLightRef.current.color.set(0xfef3c7);
          hemiLightRef.current.groundColor.set(0x78350f);
          hemiLightRef.current.intensity = 1.1;
        } else {
          // Daylight atmosphere sky and ground bounce
          hemiLightRef.current.color.set(0xbae6fd);
          hemiLightRef.current.groundColor.set(0xdbeafe);
          hemiLightRef.current.intensity = 1.2;
        }
      } else {
        if (theme === "midnight") {
          hemiLightRef.current.color.set(0x1e293b);
          hemiLightRef.current.groundColor.set(0x020617);
          hemiLightRef.current.intensity = 0.45;
        } else if (theme === "golden") {
          hemiLightRef.current.color.set(0xfed7aa);
          hemiLightRef.current.groundColor.set(0x451a03);
          hemiLightRef.current.intensity = 0.85;
        } else {
          hemiLightRef.current.color.set(0xffedd5);
          hemiLightRef.current.groundColor.set(0x071527);
          hemiLightRef.current.intensity = 0.75;
        }
      }
    }

    // Refresh state meshes materials
    for (const [name, mesh] of stateMeshesRef.current.entries()) {
      const colors = getStateColors(name, theme, isLight);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.color.set(colors.top);
      mat.roughness = colors.roughness;
      mat.metalness = colors.metalness;
    }
  }, [theme, isLight, worldGeojson]);

  // ─────────────────────────────────────────────
  // SYNC CAMERA WITH SELECTED STATE
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedState) return;
    focusOnState(selectedState);
  }, [selectedState, focusOnState]);

  // ─────────────────────────────────────────────
  // MOUSE INTERACTION (RAYCASTING - ONLY INDIAN STATES ARE CLICKABLE)
  // ─────────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !cameraRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      // ONLY raycast against interactive Indian state meshes! (other countries are excluded)
      const meshes = Array.from(stateMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hitName = (intersects[0].object as THREE.Mesh).userData.stateName as string;
        if (hitName && hitName !== hoveredStateRef.current) {
          onHoverState(hitName);
          if (canvasRef.current) canvasRef.current.style.cursor = "pointer";
        }
      } else {
        if (hoveredStateRef.current !== null) {
          onHoverState(null);
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }
      }
    },
    [onHoverState]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !cameraRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
      // ONLY raycast against interactive Indian state meshes! (other countries are excluded)
      const meshes = Array.from(stateMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hitName = (intersects[0].object as THREE.Mesh).userData.stateName as string;
        if (hitName) {
          onSelectState(hitName);
        }
      } else {
        // Clicked ocean or other country - deselect
        onSelectState(null);
      }
    },
    [onSelectState]
  );

  const handlePointerLeave = useCallback(() => {
    onHoverState(null);
  }, [onHoverState]);

  // ─────────────────────────────────────────────
  // GUIDED CULINARY TOUR MODE
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!tourActive) return;

    const stop = CULINARY_TOUR_STOPS[tourIndex];
    if (stop) {
      onSelectState(stop.state);
    }

    const timer = setTimeout(() => {
      setTourIndex((prev) => (prev + 1) % CULINARY_TOUR_STOPS.length);
    }, 5500);

    return () => clearTimeout(timer);
  }, [tourActive, tourIndex, onSelectState]);

  // ─────────────────────────────────────────────
  // CAMERA PRESETS
  // ─────────────────────────────────────────────
  const setCameraPreset = (preset: "overview" | "north" | "south" | "west" | "east" | "topdown") => {
    setTourActive(false);
    if (!cameraRef.current || !controlsRef.current) return;

    switch (preset) {
      case "overview":
        animateCameraTo(DEFAULT_CAM_POS, DEFAULT_LOOK_AT, 1200);
        break;
      case "north":
        // Himalayan Mountains focus
        animateCameraTo(new THREE.Vector3(0, 22, 14), new THREE.Vector3(-2, 1.8, -9), 1100);
        break;
      case "south":
        // Southern Peninsular & Spice Coasts
        animateCameraTo(new THREE.Vector3(-2, 18, 22), new THREE.Vector3(-3, 0.8, 11), 1100);
        break;
      case "west":
        // Rajasthan & Gujarat Desert & Coast
        animateCameraTo(new THREE.Vector3(-14, 20, 16), new THREE.Vector3(-9, 1.0, 1), 1100);
        break;
      case "east":
        // Bengal & Northeast tea hills
        animateCameraTo(new THREE.Vector3(12, 21, 16), new THREE.Vector3(8, 1.0, -1), 1100);
        break;
      case "topdown":
        // Planar 2D Bird's eye view
        animateCameraTo(new THREE.Vector3(0, 42, 0.05), new THREE.Vector3(0, 0, 0), 1200);
        break;
    }
  };

  const currentTourStop = CULINARY_TOUR_STOPS[tourIndex];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-500 ${
        isLight ? "bg-[#dde7f2]" : "bg-slate-950"
      }`}
      style={{ touchAction: "none" }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md text-amber-50">
          <div className="w-16 h-16 relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-amber-100">Generating 3D Earth & Food Atlas</h2>
          <p className="text-xs text-amber-300/80 mt-1">Completing Earth globe continents & surrounding countries...</p>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── TOP CONTROLS BAR ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: View Mode / Themes */}
        <div
          className={`flex items-center gap-1.5 backdrop-blur-md p-1.5 rounded-2xl border pointer-events-auto transition-colors duration-300 ${
            isLight
              ? "bg-[#faf7f2]/90 border-amber-900/15 shadow-md text-slate-800"
              : "bg-slate-900/85 border-slate-700/60 shadow-xl text-slate-300"
          }`}
        >
          <button
            onClick={() => setTheme("relief")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              theme === "relief"
                ? isLight
                  ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md shadow-sky-900/30"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30"
                : isLight
                ? "text-slate-700 hover:text-slate-950 hover:bg-amber-100/70"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title={isLight ? "Daylight Sunlit Earth & Topographic Relief" : "Realistic Topographic Relief & Biomes"}
          >
            {isLight ? <Sun className="w-3.5 h-3.5 text-amber-200" /> : <Mountain className="w-3.5 h-3.5" />}
            <span>{isLight ? "Daylight Earth" : "Topographic"}</span>
          </button>

          <button
            onClick={() => setTheme("golden")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              theme === "golden"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-900/30"
                : isLight
                ? "text-slate-700 hover:text-slate-950 hover:bg-amber-100/70"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title="Golden Hour Sunset & Spice Glow"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Golden Spice</span>
          </button>

          <button
            onClick={() => setTheme("midnight")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              theme === "midnight"
                ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-indigo-900/30"
                : isLight
                ? "text-slate-700 hover:text-slate-950 hover:bg-amber-100/70"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title="Midnight Bioluminescent Atlas"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Midnight</span>
          </button>
        </div>

        {/* Right: Camera Presets & Tour Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Guided Tour Trigger */}
          <button
            onClick={() => {
              setTourActive(!tourActive);
              if (!tourActive) setTourIndex(0);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shadow-xl border ${
              tourActive
                ? "bg-rose-600 border-rose-400 text-white animate-pulse"
                : isLight
                ? "bg-[#faf7f2]/90 backdrop-blur-md text-amber-900 border-amber-900/15 hover:bg-amber-100/80 shadow-md"
                : "bg-slate-900/85 backdrop-blur-md text-amber-300 border-slate-700/60 hover:bg-slate-800 hover:text-amber-200"
            }`}
          >
            {tourActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{tourActive ? "Pause Tour" : "Culinary Tour"}</span>
          </button>

          {/* Camera Angles Menu */}
          <div
            className={`hidden sm:flex items-center gap-1 backdrop-blur-md p-1.5 rounded-2xl border transition-colors ${
              isLight
                ? "bg-[#faf7f2]/90 border-amber-900/15 shadow-md"
                : "bg-slate-900/85 border-slate-700/60 shadow-xl"
            }`}
          >
            {(
              [
                { id: "overview", label: "Overview", desc: "Full Subcontinent Overview" },
                { id: "north", label: "North", desc: "Northern Himalayan Range" },
                { id: "south", label: "South", desc: "Southern Coastal Belt" },
                { id: "west", label: "West", desc: "Western Deserts & Coast" },
                { id: "east", label: "East", desc: "Eastern & Northeastern Highlands" },
                { id: "topdown", label: "2D/3D", desc: "2D Top-Down View" },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                onClick={() => setCameraPreset(preset.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isLight
                    ? "text-slate-700 hover:text-slate-950 hover:bg-amber-100/70"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                title={preset.desc}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Toggle Full Screen / Sidebar */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-2 backdrop-blur-md rounded-2xl border shadow-xl transition-colors ${
                isLight
                  ? "bg-[#faf7f2]/90 border-amber-900/15 text-slate-700 hover:text-slate-950 hover:bg-amber-100/70 shadow-md"
                  : "bg-slate-900/85 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl"
              }`}
              title={isSidebarCollapsed ? "Show Food Panel" : "Maximize 3D Map"}
            >
              {isSidebarCollapsed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* ── 3D SCREEN-PROJECTED STATE BADGES (INDIA ONLY) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {screenLabels.map((lbl) => {
          if (!lbl.visible) return null;
          const isSelected = lbl.isSelected;
          const isHovered = hoveredState === lbl.name;

          return (
            <div
              key={lbl.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-auto cursor-pointer transition-transform duration-150 ${
                isSelected ? "scale-125 z-30" : isHovered ? "scale-110 z-20" : "scale-90 z-10 opacity-80 hover:opacity-100"
              }`}
              style={{
                left: `${lbl.x}px`,
                top: `${lbl.y}px`,
              }}
              onClick={() => onSelectState(lbl.name)}
              onMouseEnter={() => onHoverState(lbl.name)}
              onMouseLeave={() => onHoverState(null)}
            >
              <div
                className={`px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg text-[10px] font-bold border backdrop-blur-md transition-all ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-200 ring-2 ring-orange-400/50 shadow-orange-900/40"
                    : isHovered
                    ? "bg-amber-400 text-amber-950 border-amber-200 shadow-amber-900/30"
                    : isLight
                    ? "bg-[#fffdfa]/95 text-slate-800 border-amber-900/20 shadow-md"
                    : "bg-slate-900/85 text-slate-200 border-slate-700/60"
                }`}
              >
                <span>{lbl.emoji}</span>
                <span>{lbl.shortName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ACTIVE TOUR STORY CARD ── */}
      {tourActive && currentTourStop && (
        <div
          className={`absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-md w-11/12 backdrop-blur-lg border rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
            isLight
              ? "bg-[#faf7f2]/95 border-amber-600/40 text-slate-800 shadow-amber-950/20"
              : "bg-slate-900/90 border-amber-500/40 text-slate-100 shadow-2xl"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span
                className={`text-xs uppercase tracking-wider font-bold ${
                  isLight ? "text-amber-800" : "text-amber-400"
                }`}
              >
                Stop {tourIndex + 1} of {CULINARY_TOUR_STOPS.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setTourIndex((prev) => (prev - 1 + CULINARY_TOUR_STOPS.length) % CULINARY_TOUR_STOPS.length)
                }
                className={`p-1 rounded-lg transition-colors ${
                  isLight
                    ? "hover:bg-amber-100 text-slate-600 hover:text-slate-900"
                    : "hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTourIndex((prev) => (prev + 1) % CULINARY_TOUR_STOPS.length)}
                className={`p-1 rounded-lg transition-colors ${
                  isLight
                    ? "hover:bg-amber-100 text-slate-600 hover:text-slate-900"
                    : "hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <h3
            className={`text-base font-extrabold flex items-center gap-2 ${
              isLight ? "text-slate-950" : "text-white"
            }`}
          >
            <span>{STATE_EMOJIS[currentTourStop.state] || "🍲"}</span>
            <span>{currentTourStop.state}</span>
            <span
              className={`text-xs font-normal ${
                isLight ? "text-amber-800" : "text-amber-300/80"
              }`}
            >
              ({currentTourStop.caption})
            </span>
          </h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isLight ? "text-slate-700" : "text-slate-300"
            }`}
          >
            {currentTourStop.story}
          </p>
        </div>
      )}

      {/* ── BOTTOM LEFT: COMPASS & LEGEND ── */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2.5 pointer-events-none">
        {/* 3D Compass & Recenter */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={resetCamera}
            className={`w-10 h-10 rounded-2xl backdrop-blur-md border shadow-xl flex items-center justify-center transition-all group ${
              isLight
                ? "bg-[#faf7f2]/90 border-amber-900/15 text-amber-700 hover:text-amber-800 hover:bg-amber-100/70 shadow-md"
                : "bg-slate-900/85 border-slate-700/60 shadow-xl text-amber-400 hover:text-amber-300 hover:bg-slate-800"
            }`}
            title="Reset North & Overview Camera"
          >
            <Compass
              className="w-5 h-5 transition-transform duration-200"
              style={{ transform: `rotate(${compassAngle}deg)` }}
            />
          </button>

          <button
            onClick={resetCamera}
            className={`w-10 h-10 rounded-2xl backdrop-blur-md border shadow-xl flex items-center justify-center transition-all ${
              isLight
                ? "bg-[#faf7f2]/90 border-amber-900/15 text-slate-700 hover:text-slate-950 hover:bg-amber-100/70 shadow-md"
                : "bg-slate-900/85 border-slate-700/60 shadow-xl text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title="Reset Subcontinent Perspective"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (!cameraRef.current || !controlsRef.current) return;
              const dir = new THREE.Vector3();
              cameraRef.current.getWorldDirection(dir);
              cameraRef.current.position.addScaledVector(dir, 4);
              controlsRef.current.update();
            }}
            className={`w-10 h-10 rounded-2xl backdrop-blur-md border shadow-xl flex items-center justify-center transition-all ${
              isLight
                ? "bg-[#faf7f2]/90 border-amber-900/15 text-slate-700 hover:text-slate-950 hover:bg-amber-100/70 shadow-md"
                : "bg-slate-900/85 border-slate-700/60 shadow-xl text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (!cameraRef.current || !controlsRef.current) return;
              const dir = new THREE.Vector3();
              cameraRef.current.getWorldDirection(dir);
              cameraRef.current.position.addScaledVector(dir, -4);
              controlsRef.current.update();
            }}
            className={`w-10 h-10 rounded-2xl backdrop-blur-md border shadow-xl flex items-center justify-center transition-all ${
              isLight
                ? "bg-[#faf7f2]/90 border-amber-900/15 text-slate-700 hover:text-slate-950 hover:bg-amber-100/70 shadow-md"
                : "bg-slate-900/85 border-slate-700/60 shadow-xl text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Earth Globe Elevation & Interaction Legend */}
        <div
          className={`backdrop-blur-md rounded-2xl p-3 border pointer-events-auto text-xs max-w-[210px] transition-colors ${
            isLight
              ? "bg-[#faf7f2]/90 border-amber-900/15 shadow-md text-slate-700"
              : "bg-slate-900/85 border-slate-700/60 shadow-xl text-slate-300"
          }`}
        >
          <div
            className={`flex items-center justify-between mb-2 pb-1.5 border-b ${
              isLight ? "border-amber-900/15" : "border-slate-800"
            }`}
          >
            <span
              className={`font-bold flex items-center gap-1.5 ${
                isLight ? "text-slate-900" : "text-slate-100"
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-amber-500" />
              Complete Earth Globe
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className={isLight ? "text-slate-500" : "text-slate-400"}>Interactive</span>
              <span className={`font-semibold ${isLight ? "text-amber-800" : "text-amber-300"}`}>
                Indian States 3D
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isLight ? "text-slate-500" : "text-slate-400"}>Context Land</span>
              <span className={`font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                World Countries
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isLight ? "text-slate-500" : "text-slate-400"}>Oceans</span>
              <span className={`font-semibold ${isLight ? "text-teal-700" : "text-emerald-400"}`}>
                Gentle Waves
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM RIGHT: CONTROLS HINT ── */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div
          className={`hidden md:flex items-center gap-2 backdrop-blur-md px-3.5 py-2 rounded-2xl border text-xs shadow-xl transition-colors ${
            isLight
              ? "bg-[#faf7f2]/90 border-amber-900/15 text-slate-700 shadow-md"
              : "bg-slate-900/80 border-slate-700/60 text-slate-300 shadow-xl"
          }`}
        >
          <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>Left-Drag: Rotate Earth · Right-Drag: Pan · Scroll: Zoom · Click State to Explore</span>
        </div>
      </div>
    </div>
  );
};
