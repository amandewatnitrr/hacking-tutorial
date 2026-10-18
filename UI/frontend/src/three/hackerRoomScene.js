import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Models and baked textures in public/hacker-room/ are Bruno Simon's actual
// room scene (brunosimon/my-room-in-3d, used with permission — see
// public/hacker-room/ATTRIBUTION.txt): one baked mesh for the whole room,
// lit by mixing three pre-rendered (day/night/neutral) lightmaps in a
// shader, plus small accent models sharing that material or layering a
// glow on top. This module is adapted from an existing internal Remotion
// video build of the same scene (ad-studio/src/projects/hacker-room) —
// same shaders and geometry, with the video-timeline camera/beat system
// replaced by a live idle loop (auto-orbit + mouse parallax) and the
// day/night mix driven by this site's own theme toggle instead of time.

const asset = (file) => `/hacker-room/${file}`;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(asset('draco/'));
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const loadGLB = (name) =>
  new Promise((resolve, reject) => {
    gltfLoader.load(asset(`${name}.glb`), (gltf) => resolve(gltf.scene.children[0]), undefined, reject);
  });

const applyMaterial = (object, material) => {
  object.traverse((child) => {
    if (child.isMesh) child.material = material;
  });
};

const textureLoader = new THREE.TextureLoader();
const loadTexture = (file) =>
  new Promise((resolve, reject) => {
    textureLoader.load(asset(file), resolve, undefined, reject);
  });

const bakedVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
  }
`;

const bakedFragmentShader = /* glsl */ `
  uniform sampler2D uBakedDayTexture;
  uniform sampler2D uBakedNightTexture;
  uniform sampler2D uBakedNeutralTexture;
  uniform sampler2D uLightMapTexture;
  uniform float uNightMix;
  uniform float uNeutralMix;
  uniform vec3 uLightTvColor;
  uniform float uLightTvStrength;
  uniform vec3 uLightDeskColor;
  uniform float uLightDeskStrength;
  uniform vec3 uLightPcColor;
  uniform float uLightPcStrength;
  varying vec2 vUv;

  vec3 blendLighten(vec3 base, vec3 blendColor, float opacity) {
    vec3 lightened = max(blendColor, base);
    return lightened * opacity + base * (1.0 - opacity);
  }

  void main() {
    vec3 bakedDayColor = texture2D(uBakedDayTexture, vUv).rgb;
    vec3 bakedNightColor = texture2D(uBakedNightTexture, vUv).rgb;
    vec3 bakedNeutralColor = texture2D(uBakedNeutralTexture, vUv).rgb;
    vec3 bakedColor = mix(mix(bakedDayColor, bakedNightColor, uNightMix), bakedNeutralColor, uNeutralMix);
    vec3 lightMapColor = texture2D(uLightMapTexture, vUv).rgb;

    bakedColor = blendLighten(bakedColor, uLightTvColor, lightMapColor.r * uLightTvStrength);
    bakedColor = blendLighten(bakedColor, uLightPcColor, lightMapColor.b * uLightPcStrength);
    bakedColor = blendLighten(bakedColor, uLightDeskColor, lightMapColor.g * uLightDeskStrength);

    gl_FragColor = vec4(bakedColor, 1.0);
    #include <colorspace_fragment>
  }
`;

const perlin2dGlsl = /* glsl */ `
  vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float perlin2d(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
  }
`;

const steamVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  ${perlin2dGlsl}
  void main() {
    vec3 newPosition = position;
    vec2 displacementUv = uv * 5.0;
    displacementUv.y -= uTime * 0.0002;
    float displacementStrength = pow(uv.y * 3.0, 2.0);
    float perlin = perlin2d(displacementUv) * displacementStrength;
    newPosition.y += perlin * 0.1;
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
  }
`;

const steamFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  ${perlin2dGlsl}
  void main() {
    vec2 uv = vUv * vec2(4.0, 5.0);
    uv.y -= uTime * 0.0004;
    float borderAlpha = min(vUv.x * 4.0, (1.0 - vUv.x) * 4.0);
    borderAlpha *= (1.0 - vUv.y);
    float perlin = perlin2d(uv) * borderAlpha * 0.6;
    perlin = min(perlin, 1.0);
    gl_FragColor = vec4(uColor, perlin);
    #include <colorspace_fragment>
  }
`;

const buildScreen = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { canvas, ctx, texture };
};

const typedChars = (elapsedSec, cps) => Math.max(0, Math.floor(elapsedSec * cps));

const drawTyped = (screen, lines, t, cps, color) => {
  const { ctx, canvas } = screen;
  ctx.fillStyle = '#030402';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '18px "Fira Code", "Consolas", monospace';
  ctx.textBaseline = 'top';
  const lineH = 24;
  const blinkOn = Math.floor(t * 2) % 2 === 0;
  let remaining = typedChars(t, cps);
  let y = 14;
  for (const line of lines) {
    const show = Math.min(line.length, Math.max(0, remaining));
    const shown = line.slice(0, show);
    ctx.fillStyle = color;
    ctx.fillText(shown, 14, y);
    const after = remaining - (line.length + 1);
    if (remaining > 0 && after <= 0 && blinkOn) {
      ctx.fillRect(14 + ctx.measureText(shown).width + 2, y, 10, 16);
    }
    remaining = after;
    y += lineH;
  }
};

const PALETTE = { tvPink: '#ff115e', deskOrange: '#ff6700', pcBlue: '#0082ff' };

const TERMINAL_LINES = [
  '$ nmap -sV target.lab',
  'scanning 1000 ports...',
  'port 443/tcp  open   https',
  'port 22/tcp   open   ssh',
  'vuln scan complete',
  'loading next lesson...',
];
const COMMIT_LINES = ['$ git log --oneline', 'a1b2c3d fix auth bypass', 'f4e5d6c harden session', 'ready to learn'];

// Spherical camera around a look target, matching the original scene's own
// default framing (radius 30, phi 0.35π, theta -0.25π, target (0,2,0)).
const sphericalToPos = (radius, phi, theta, target) => {
  const sinPhiRadius = Math.sin(phi) * radius;
  return new THREE.Vector3(
    sinPhiRadius * Math.sin(theta) + target[0],
    Math.cos(phi) * radius + target[1],
    sinPhiRadius * Math.cos(theta) + target[2],
  );
};

/**
 * Builds the scene's geometry/materials. Call once; returns refs consumed
 * by frame(). All assets load from /hacker-room/ (public/).
 */
export async function buildHackerRoom(scene) {
  const [
    roomMesh,
    pcScreenMesh,
    macScreenMesh,
    topChairGroup,
    coffeeSteamMesh,
    elgatoLightMesh,
    googleLedsGroup,
    bakedDayTexture,
    bakedNightTexture,
    bakedNeutralTexture,
    lightMapTexture,
    ledMaskTexture,
  ] = await Promise.all([
    loadGLB('roomModel'),
    loadGLB('pcScreenModel'),
    loadGLB('macScreenModel'),
    loadGLB('topChairModel'),
    loadGLB('coffeeSteamModel'),
    loadGLB('elgatoLightModel'),
    loadGLB('googleHomeLedsModel'),
    loadTexture('bakedDay.jpg'),
    loadTexture('bakedNight.jpg'),
    loadTexture('bakedNeutral.jpg'),
    loadTexture('lightMap.jpg'),
    loadTexture('googleHomeLedMask.png'),
  ]);

  for (const tex of [bakedDayTexture, bakedNightTexture, bakedNeutralTexture]) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
  }
  lightMapTexture.flipY = false;

  const bakedMaterial = new THREE.ShaderMaterial({
    vertexShader: bakedVertexShader,
    fragmentShader: bakedFragmentShader,
    uniforms: {
      uBakedDayTexture: { value: bakedDayTexture },
      uBakedNightTexture: { value: bakedNightTexture },
      uBakedNeutralTexture: { value: bakedNeutralTexture },
      uLightMapTexture: { value: lightMapTexture },
      uNightMix: { value: 1 },
      uNeutralMix: { value: 0 },
      uLightTvColor: { value: new THREE.Color(PALETTE.tvPink) },
      uLightTvStrength: { value: 1.47 },
      uLightDeskColor: { value: new THREE.Color(PALETTE.deskOrange) },
      uLightDeskStrength: { value: 1.9 },
      uLightPcColor: { value: new THREE.Color(PALETTE.pcBlue) },
      uLightPcStrength: { value: 1.4 },
    },
  });

  applyMaterial(roomMesh, bakedMaterial);
  scene.add(roomMesh);
  applyMaterial(topChairGroup, bakedMaterial);
  scene.add(topChairGroup);

  const pcScreen = buildScreen();
  applyMaterial(pcScreenMesh, new THREE.MeshBasicMaterial({ map: pcScreen.texture }));
  scene.add(pcScreenMesh);

  const macScreen = buildScreen();
  applyMaterial(macScreenMesh, new THREE.MeshBasicMaterial({ map: macScreen.texture }));
  scene.add(macScreenMesh);

  const steamMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: steamVertexShader,
    fragmentShader: steamFragmentShader,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#d2958a') } },
  });
  applyMaterial(coffeeSteamMesh, steamMaterial);
  scene.add(coffeeSteamMesh);

  applyMaterial(elgatoLightMesh, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  scene.add(elgatoLightMesh);

  const ledColors = ['#196aff', '#ff0000', '#ff5d00', '#7db81b'];
  const ledMeshes = [...googleLedsGroup.children].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const ledMaterials = ledMeshes.map((mesh, i) => {
    const material = new THREE.MeshBasicMaterial({
      color: ledColors[i % ledColors.length],
      transparent: true,
      alphaMap: ledMaskTexture,
    });
    applyMaterial(mesh, material);
    scene.add(mesh);
    return material;
  });

  const allMeshes = [roomMesh, pcScreenMesh, macScreenMesh, topChairGroup, coffeeSteamMesh, elgatoLightMesh, googleLedsGroup];
  const allTextures = [bakedDayTexture, bakedNightTexture, bakedNeutralTexture, lightMapTexture, ledMaskTexture, pcScreen.texture, macScreen.texture];
  const allMaterials = [bakedMaterial, steamMaterial, ...ledMaterials];

  return {
    bakedMaterial,
    steamMaterial,
    pcScreen,
    macScreen,
    topChairGroup,
    ledMaterials,
    sphericalToPos,
    dispose() {
      allMeshes.forEach((obj) => obj.traverse((child) => child.isMesh && child.geometry?.dispose()));
      allMaterials.forEach((mat) => mat.dispose());
      allTextures.forEach((tex) => tex.dispose());
    },
  };
}

/** Advances the scene's time-based animation for one frame. */
export function updateHackerRoom(refs, t, targetNightMix) {
  const current = refs.bakedMaterial.uniforms.uNightMix.value;
  refs.bakedMaterial.uniforms.uNightMix.value = current + (targetNightMix - current) * 0.04;

  drawTyped(refs.pcScreen, TERMINAL_LINES, t * 0.6, 11, '#39FF88');
  refs.pcScreen.texture.needsUpdate = true;

  drawTyped(refs.macScreen, COMMIT_LINES, Math.max(0, t * 0.6 - 4), 9, '#8FD6FF');
  refs.macScreen.texture.needsUpdate = true;

  refs.steamMaterial.uniforms.uTime.value = t * 1000;
  refs.topChairGroup.rotation.y = Math.sin(t * 0.3) * 0.4;
  refs.ledMaterials.forEach((mat, i) => {
    mat.opacity = Math.sin(t * 2 - i * 0.5) * 0.5 + 0.5;
  });
}
