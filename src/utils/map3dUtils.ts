import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface GeoJsonGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface GeoJsonFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: GeoJsonGeometry;
}

export interface GeoJsonCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export interface State3DData {
  id: string;
  name: string;
  canonicalName: string;
  centroid: [number, number, number]; // [x, y, z] in 3D world space
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  elevation: number;
  meshGeometry: THREE.BufferGeometry;
}

// Map center: Indian Subcontinent center around Madhya Pradesh
export const MAP_CENTER_LON = 82.8;
export const MAP_CENTER_LAT = 22.5;
export const MAP_SCALE = 1.0;

// Earth Sphere Radius
export const EARTH_RADIUS = 50.0;

const centerRad = (MAP_CENTER_LAT * Math.PI) / 180;
const centerMercatorY = Math.log(Math.tan(Math.PI / 4 + centerRad / 2));

export function projectLonLat(lon: number, lat: number): [number, number] {
  const x = (lon - MAP_CENTER_LON) * MAP_SCALE;
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const rad = (clampedLat * Math.PI) / 180;
  const mercatorY = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  const y = (mercatorY - centerMercatorY) * MAP_SCALE * (180 / Math.PI);
  return [x, y];
}

// Calculate the spherical drop-off for any (x, z) point on the sphere surface
export function getSphereSurfaceY(x: number, z: number, radius: number = EARTH_RADIUS): number {
  const r2 = x * x + z * z;
  if (r2 >= radius * radius) return -radius;
  return Math.sqrt(radius * radius - r2) - radius;
}

// Quaternion to rotate the Earth sphere so (MAP_CENTER_LON, MAP_CENTER_LAT) sits at the top apex (0, 0, 0)
export function getEarthAlignmentQuaternion(): THREE.Quaternion {
  const phi = (90 - MAP_CENTER_LAT) * (Math.PI / 180);
  const theta = (MAP_CENTER_LON + 180) * (Math.PI / 180);
  const pCenter = new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  );
  const qAlign = new THREE.Quaternion().setFromUnitVectors(pCenter, new THREE.Vector3(0, 1, 0));
  const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  return qY.multiply(qAlign);
}

export function normalizeStateName(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[.']/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getFeatureStateName(properties: Record<string, unknown>): string {
  const keys = [
    "st_nm",
    "ST_NM",
    "state",
    "STATE",
    "state_name",
    "STATE_NAME",
    "name",
    "NAME",
    "NAME_1",
    "State_Name",
  ];
  for (const k of keys) {
    const val = properties[k];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return "";
}

// Realistic topographic relief elevations (in world height units)
export const STATE_ELEVATIONS: Record<string, number> = {
  // High Himalayas (snow-capped mountain wall)
  Ladakh: 2.5,
  "Jammu and Kashmir": 2.3,
  "Himachal Pradesh": 2.1,
  Uttarakhand: 1.9,
  Sikkim: 2.1,
  "Arunachal Pradesh": 2.0,

  // North-eastern hill ranges
  Meghalaya: 1.5,
  Nagaland: 1.5,
  Manipur: 1.4,
  Mizoram: 1.4,
  Tripura: 0.9,
  Assam: 0.8,

  // Deccan Plateau & Central highlands
  Maharashtra: 1.3,
  Karnataka: 1.2,
  "Madhya Pradesh": 1.2,
  Telangana: 1.1,
  Chhattisgarh: 1.1,
  Jharkhand: 1.1,

  // Western Desert & Aravalli
  Rajasthan: 1.0,

  // Coastal belts & Gangetic alluvial river valleys
  Gujarat: 0.8,
  "Andhra Pradesh": 0.8,
  "Tamil Nadu": 0.8,
  Odisha: 0.8,
  "West Bengal": 0.65,
  Kerala: 0.75,
  Goa: 0.6,
  Punjab: 0.7,
  Haryana: 0.7,
  Delhi: 0.7,
  "Uttar Pradesh": 0.65,
  Bihar: 0.65,

  // Islands & UTs
  "Andaman and Nicobar Islands": 0.5,
  Puducherry: 0.5,
  Chandigarh: 0.7,
  Lakshadweep: 0.5,
  "Dadra and Nagar Haveli and Daman and Diu": 0.6,
};

export type VisualTheme = "relief" | "golden" | "midnight";

export interface StateThemeColors {
  base: string;
  top: string;
  side: string;
  roughness: number;
  metalness: number;
}

// Palette for realistic physical terrain
export const RELIEF_COLORS: Record<string, { base: string; top: string; side: string }> = {
  // Northern snow & mountain rock
  Ladakh: { base: "#64748b", top: "#e2e8f0", side: "#475569" },
  "Jammu and Kashmir": { base: "#475569", top: "#cbd5e1", side: "#334155" },
  "Himachal Pradesh": { base: "#334155", top: "#94a3b8", side: "#1e293b" },
  Uttarakhand: { base: "#334155", top: "#94a3b8", side: "#1e293b" },
  Sikkim: { base: "#475569", top: "#cbd5e1", side: "#334155" },
  "Arunachal Pradesh": { base: "#1e3a2b", top: "#3b7a57", side: "#14281e" },

  // Desert golden sandstone
  Rajasthan: { base: "#b45309", top: "#f59e0b", side: "#78350f" },
  Gujarat: { base: "#b45309", top: "#d97706", side: "#78350f" },

  // Deccan Plateau terracotta / volcanic basalt
  Maharashtra: { base: "#854d0e", top: "#ca8a04", side: "#713f12" },
  Karnataka: { base: "#78350f", top: "#b45309", side: "#451a03" },
  "Madhya Pradesh": { base: "#9a3412", top: "#ea580c", side: "#7c2d12" },
  Telangana: { base: "#9a3412", top: "#c2410c", side: "#7c2d12" },
  Chhattisgarh: { base: "#166534", top: "#22c55e", side: "#14532d" },
  Jharkhand: { base: "#166534", top: "#15803d", side: "#14532d" },

  // Lush Western Ghats & Coastal Emeralds
  Kerala: { base: "#14532d", top: "#16a34a", side: "#052e16" },
  Goa: { base: "#15803d", top: "#22c55e", side: "#14532d" },
  "Tamil Nadu": { base: "#78350f", top: "#b45309", side: "#451a03" },
  "Andhra Pradesh": { base: "#9a3412", top: "#d97706", side: "#7c2d12" },
  Odisha: { base: "#15803d", top: "#22c55e", side: "#14532d" },

  // Fertile Gangetic Plains
  Punjab: { base: "#65a30d", top: "#84cc16", side: "#3f6212" },
  Haryana: { base: "#65a30d", top: "#84cc16", side: "#3f6212" },
  Delhi: { base: "#ca8a04", top: "#eab308", side: "#854d0e" },
  "Uttar Pradesh": { base: "#4d7c0f", top: "#65a30d", side: "#365314" },
  Bihar: { base: "#4d7c0f", top: "#65a30d", side: "#365314" },
  "West Bengal": { base: "#15803d", top: "#22c55e", side: "#14532d" },

  // North-eastern Tea Hills & Rainforests
  Assam: { base: "#064e3b", top: "#059669", side: "#022c22" },
  Meghalaya: { base: "#064e3b", top: "#10b981", side: "#022c22" },
  Nagaland: { base: "#1e3a2b", top: "#22c55e", side: "#14281e" },
  Manipur: { base: "#1e3a2b", top: "#16a34a", side: "#14281e" },
  Mizoram: { base: "#1e3a2b", top: "#22c55e", side: "#14281e" },
  Tripura: { base: "#15803d", top: "#22c55e", side: "#14532d" },

  // Islands & UTs
  "Andaman and Nicobar Islands": { base: "#0d9488", top: "#2dd4bf", side: "#115e59" },
  Puducherry: { base: "#d97706", top: "#f59e0b", side: "#92400e" },
};

export function getStateColors(stateName: string, theme: VisualTheme, isLight: boolean = false): StateThemeColors {
  if (theme === "golden") {
    // Saffron, Turmeric, Cardamom warm twilight glow
    return {
      base: isLight ? "#c25e00" : "#b45309",
      top: isLight ? "#fbbf24" : "#f59e0b",
      side: isLight ? "#853b00" : "#78350f",
      roughness: isLight ? 0.4 : 0.35,
      metalness: isLight ? 0.1 : 0.15,
    };
  }

  if (theme === "midnight") {
    // Sleek dark cyberpunk/bioluminescent spice mode
    return {
      base: "#0f172a",
      top: "#1e293b",
      side: "#090d16",
      roughness: 0.25,
      metalness: 0.4,
    };
  }

  // Realistic relief (Natural Daylight when isLight is true)
  const relief = RELIEF_COLORS[stateName] || { base: "#854d0e", top: "#b45309", side: "#451a03" };
  return {
    base: relief.base,
    top: relief.top,
    side: relief.side,
    roughness: isLight ? 0.55 : 0.65,
    metalness: isLight ? 0.04 : 0.08,
  };
}

export function buildStates3DData(geojson: GeoJsonCollection): State3DData[] {
  const byStateName = new Map<string, GeoJsonFeature[]>();

  for (const feature of geojson.features) {
    const rawName = getFeatureStateName(feature.properties);
    if (!rawName) continue;
    let canonical = rawName;
    if (normalizeStateName(rawName) === "ladakh") {
      canonical = "Ladakh";
    }

    if (!byStateName.has(canonical)) {
      byStateName.set(canonical, []);
    }
    byStateName.get(canonical)!.push(feature);
  }

  const result: State3DData[] = [];

  for (const [stateName, features] of byStateName.entries()) {
    const elevation = STATE_ELEVATIONS[stateName] ?? 0.8;
    const extrudeGeometries: THREE.BufferGeometry[] = [];

    let sumX = 0;
    let sumZ = 0;
    let ptCount = 0;
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (const f of features) {
      const geom = f.geometry;
      const polys = geom.type === "Polygon" ? [geom.coordinates as number[][][]] : (geom.coordinates as number[][][][]);

      for (const poly of polys) {
        if (!poly || !poly[0] || poly[0].length < 3) continue;

        const outerRing = poly[0];
        const shape = new THREE.Shape();

        // Outer ring
        for (let i = 0; i < outerRing.length; i++) {
          const [lon, lat] = outerRing[i];
          const [px, py] = projectLonLat(lon, lat);

          const worldX = px;
          const worldZ = -py;

          sumX += worldX;
          sumZ += worldZ;
          ptCount++;

          if (worldX < minX) minX = worldX;
          if (worldX > maxX) maxX = worldX;
          if (worldZ < minZ) minZ = worldZ;
          if (worldZ > maxZ) maxZ = worldZ;

          if (i === 0) shape.moveTo(px, py);
          else shape.lineTo(px, py);
        }

        // Holes
        for (let h = 1; h < poly.length; h++) {
          const holeRing = poly[h];
          if (!holeRing || holeRing.length < 3) continue;
          const holePath = new THREE.Path();
          for (let i = 0; i < holeRing.length; i++) {
            const [lon, lat] = holeRing[i];
            const [px, py] = projectLonLat(lon, lat);
            if (i === 0) holePath.moveTo(px, py);
            else holePath.lineTo(px, py);
          }
          shape.holes.push(holePath);
        }

        try {
          const extrudeGeom = new THREE.ExtrudeGeometry(shape, {
            depth: elevation,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.05,
            bevelThickness: 0.05,
          });

          extrudeGeom.rotateX(-Math.PI / 2);
          extrudeGeometries.push(extrudeGeom);
        } catch (e) {
          console.warn("Could not extrude geometry for", stateName, e);
        }
      }
    }

    if (extrudeGeometries.length === 0) continue;

    const mergedMeshGeom = mergeGeometries(extrudeGeometries, false);

    // Apply 3D Earth spherical curvature to all vertices
    const posAttr = mergedMeshGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const sphereY = getSphereSurfaceY(vx, vz, EARTH_RADIUS);
      posAttr.setY(i, vy + sphereY);
    }
    posAttr.needsUpdate = true;
    mergedMeshGeom.computeVertexNormals();

    for (const g of extrudeGeometries) g.dispose();

    const cx = ptCount > 0 ? sumX / ptCount : 0;
    const cz = ptCount > 0 ? sumZ / ptCount : 0;
    const sphereCentroidY = getSphereSurfaceY(cx, cz, EARTH_RADIUS);
    const cy = elevation + sphereCentroidY;

    result.push({
      id: stateName,
      name: stateName,
      canonicalName: stateName,
      centroid: [cx, cy, cz],
      bounds: { minX, maxX, minZ, maxZ },
      elevation,
      meshGeometry: mergedMeshGeom,
    });
  }

  return result;
}

// ─────────────────────────────────────────────
// BUILD NON-CLICKABLE SURROUNDING COUNTRY 3D LANDMASSES
// ─────────────────────────────────────────────
export function buildNeighboringCountries3D(worldGeojson: GeoJsonCollection): THREE.BufferGeometry | null {
  const geoms: THREE.BufferGeometry[] = [];

  for (const feature of worldGeojson.features) {
    const name = (feature.properties.NAME || feature.properties.ADMIN || "") as string;
    if (name === "India") continue;

    const polys =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates as number[][][]]
        : (feature.geometry.coordinates as number[][][][]);

    for (const poly of polys) {
      if (!poly || !poly[0] || poly[0].length < 3) continue;

      // Keep within regional view around South Asia / Indian Ocean
      let inRegion = false;
      for (const [lon, lat] of poly[0]) {
        const [px, py] = projectLonLat(lon, lat);
        if (Math.abs(px) < 32 && Math.abs(py) < 32) {
          inRegion = true;
          break;
        }
      }
      if (!inRegion) continue;

      const projected: [number, number][] = [];
      let valid = true;
      for (const [lon, lat] of poly[0]) {
        const [px, py] = projectLonLat(lon, lat);
        if (Math.abs(px) > 36 || Math.abs(py) > 36) {
          valid = false;
          break;
        }
        projected.push([px, py]);
      }
      if (!valid || projected.length < 3) continue;

      const shape = new THREE.Shape();
      projected.forEach(([px, py], i) => {
        if (i === 0) shape.moveTo(px, py);
        else shape.lineTo(px, py);
      });

      try {
        const eg = new THREE.ExtrudeGeometry(shape, {
          depth: 0.35,
          bevelEnabled: true,
          bevelSegments: 1,
          bevelSize: 0.03,
          bevelThickness: 0.03,
        });
        eg.rotateX(-Math.PI / 2);
        const pos = eg.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const vz = pos.getZ(i);
          pos.setY(i, vy + getSphereSurfaceY(vx, vz, EARTH_RADIUS));
        }
        eg.computeVertexNormals();
        geoms.push(eg);
      } catch {
        // skip invalid
      }
    }
  }

  if (geoms.length === 0) return null;
  const merged = mergeGeometries(geoms, false);
  for (const g of geoms) g.dispose();
  return merged;
}

// ─────────────────────────────────────────────
// DRAW FULL WORLD COUNTRIES ON EARTH CANVAS TEXTURE
// ─────────────────────────────────────────────
export function createWorldCanvasTexture(
  worldGeojson: GeoJsonCollection,
  theme: VisualTheme,
  isLight: boolean = false
): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Clear transparent
  ctx.clearRect(0, 0, width, height);

  // Styling based on theme and day/night mode
  let landFill = "rgba(45, 60, 48, 0.95)";
  let strokeColor = "rgba(75, 95, 80, 0.45)";

  if (isLight) {
    if (theme === "midnight") {
      landFill = "rgba(30, 41, 59, 0.95)";
      strokeColor = "rgba(51, 65, 85, 0.5)";
    } else if (theme === "golden") {
      landFill = "rgba(215, 145, 95, 0.96)"; // warm golden hour day continent
      strokeColor = "rgba(165, 95, 55, 0.55)";
    } else {
      // Natural Daylight Earth continents (lush physical terrain)
      landFill = "rgba(156, 188, 148, 0.96)";
      strokeColor = "rgba(110, 145, 100, 0.55)";
    }
  } else {
    if (theme === "golden") {
      landFill = "rgba(65, 42, 25, 0.95)"; // warm dusk continent
      strokeColor = "rgba(95, 65, 40, 0.4)";
    } else if (theme === "midnight") {
      landFill = "rgba(15, 23, 42, 0.95)"; // dark slate continent
      strokeColor = "rgba(30, 41, 59, 0.5)";
    }
  }

  ctx.fillStyle = landFill;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.0;

  for (const feature of worldGeojson.features) {
    const name = (feature.properties.NAME || feature.properties.ADMIN || "") as string;
    // Don't draw India on the 2D sphere texture since India has 3D high-relief interactive states
    if (name === "India") continue;

    const polys =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates as number[][][]]
        : (feature.geometry.coordinates as number[][][][]);

    for (const poly of polys) {
      if (!poly || !poly[0] || poly[0].length < 3) continue;

      ctx.beginPath();
      for (let i = 0; i < poly[0].length; i++) {
        const [lon, lat] = poly[0][i];
        // Standard Equirectangular projection to canvas UV space
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Guided Tour Iconic Stops
export const CULINARY_TOUR_STOPS = [
  {
    state: "Kerala",
    caption: "The Spice Coast of Malabar",
    story: "Home to black gold (pepper), cardamom hill air, crispy lace appams, and coconut-infused seafood curries.",
  },
  {
    state: "Tamil Nadu",
    caption: "Dosa Dawn & Temple Kitchens",
    story: "Crisp golden dosas, fiery Chettinad pepper chicken, aromatic filter kaapi, and fermented sambar heritage.",
  },
  {
    state: "Andhra Pradesh",
    caption: "Land of Fire & Spice",
    story: "India's fiercest chilli peppers, tangy gongura mutton, and royal dum biryanis sealed with aromatic dough.",
  },
  {
    state: "Maharashtra",
    caption: "Street Legends & Konkan Coast",
    story: "Irresistible buttery pav bhaji, spicy vada pav, puran poli, and fiery Kolhapuri mutton gravies.",
  },
  {
    state: "Gujarat",
    caption: "Sweet Balance & Farsan Mastery",
    story: "Spongy saffron dhoklas, spiral khandvi rolls, and the grand festive winter delicacy Undhiyu.",
  },
  {
    state: "Rajasthan",
    caption: "Royal Rajputana Feasts",
    story: "Smoky dal baati churma baked in camel-dung coals, royal lal maas infused with Mathania chillies, and ghevar.",
  },
  {
    state: "Punjab",
    caption: "Golden Fields & Dhaba Feasts",
    story: "Clay tandoor flatbreads, sarson ka saag with white makhan, makki di roti, and rich slow-simmered butter chicken.",
  },
  {
    state: "Jammu and Kashmir",
    caption: "The Royal Wazwan & Saffron Valleys",
    story: "A 36-course royal banquet featuring rogan josh, velvety gushtaba, and warm saffron kehwa in brass samovars.",
  },
  {
    state: "Ladakh",
    caption: "High Himalayan Mountain Soul",
    story: "Steaming skyu pasta stew, wholesome tingmo, sourdough khambir, and salty churned yak butter tea.",
  },
  {
    state: "West Bengal",
    caption: "Sweet Symphony & Fish Heritage",
    story: "Mustard-sauced shorshe ilish, tender mutton kosha mangsho, and melt-in-mouth spongy rosogollas.",
  },
  {
    state: "Assam",
    caption: "Brahmaputra Mist & Fermented Flavors",
    story: "Tangy masor tenga fish curry, aromatic pitha rice cakes, elephant apple, and tender bamboo shoot delicacies.",
  },
];
