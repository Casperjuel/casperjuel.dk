/* casperjuel.dk — hero scene.
   A random-but-nice shape, displaced with noise, rendered at a deliberately
   low resolution and dithered with a Bayer matrix. The low-res trick is just
   renderer.setPixelRatio() plus `image-rendering: pixelated` on the canvas.
*/
import * as THREE from 'three';

export function createScene(canvas, opts = {}) {
  const settings = {
    pixel: 0.22,            // fraction of device resolution (lower = chunkier)
    dither: 4,              // 2 or 4 or 8 — Bayer matrix size
    speed: 1,
    wobble: 0.35,
    offsetX: 1.2,           // world units to the right on wide screens
    ...opts,
  };
  const offset = new THREE.Vector3();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(settings.pixel);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const uniforms = {
    uTime: { value: 0 },
    uWobble: { value: settings.wobble },
    uSeed: { value: Math.random() * 100 },
    uDither: { value: settings.dither },
    uFg: { value: new THREE.Color(css('--scene-ink') || css('--fg') || '#000') },
    uBg: { value: new THREE.Color(css('--bg') || '#fff') },
    uAccent: { value: new THREE.Color(css('--accent') || '#0b00ff') },
    uLight: { value: new THREE.Vector3(0.6, 0.8, 1).normalize() },
  };

  const vert = /* glsl */`
    uniform float uTime, uWobble, uSeed;
    varying vec3 vNormal; varying vec3 vPos;

    // Ashima / Stefan Gustavson 3D simplex noise
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      float n = snoise(position * 1.2 + uSeed + uTime * 0.25);
      vec3 p = position + normal * n * uWobble;
      // cheap normal re-estimate: nudge along tangent-ish axes
      float e = 0.02;
      vec3 t = normalize(cross(normal, vec3(0.0,1.0,0.0) + 0.001));
      vec3 b = cross(normal, t);
      float n1 = snoise((position + t*e) * 1.2 + uSeed + uTime * 0.25);
      float n2 = snoise((position + b*e) * 1.2 + uSeed + uTime * 0.25);
      vec3 p1 = position + t*e + normal * n1 * uWobble;
      vec3 p2 = position + b*e + normal * n2 * uWobble;
      vec3 nn = normalize(cross(p1 - p, p2 - p));
      vNormal = normalize(normalMatrix * nn);
      vPos = p;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;

  const frag = /* glsl */`
    precision highp float;
    uniform vec3 uFg, uBg, uAccent, uLight; uniform float uDither;
    varying vec3 vNormal; varying vec3 vPos;

    float bayer2(vec2 p){ p = floor(mod(p, 2.0)); return mod(p.x*2.0 + p.y*3.0, 4.0) / 4.0; }
    float bayer4(vec2 p){ return bayer2(p*0.5) * 0.25 + bayer2(p); }
    float bayer8(vec2 p){ return bayer4(p*0.5) * 0.25 + bayer2(p); }

    void main(){
      float l = dot(normalize(vNormal), uLight) * 0.5 + 0.5;
      l = pow(l, 1.4);
      vec2 px = gl_FragCoord.xy;
      float t = uDither <= 2.0 ? bayer2(px) : (uDither <= 4.0 ? bayer4(px) : bayer8(px));
      float on = step(t, l);
      // rim: accent on the silhouette
      float rim = 1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0)));
      vec3 col = mix(uFg, uBg, on);
      col = mix(col, uAccent, step(0.82, rim) * step(t, rim));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag });
  let mesh = null;

  const geometries = [
    () => new THREE.TorusKnotGeometry(1.1, 0.34, 220, 32, rnd(1, 4) | 0, rnd(2, 6) | 0),
    () => new THREE.IcosahedronGeometry(1.7, 24),
    () => new THREE.TorusGeometry(1.3, 0.5, 48, 120),
    () => new THREE.CapsuleGeometry(0.8, 1.6, 24, 48),
    () => new THREE.SphereGeometry(1.7, 96, 96),
    () => new THREE.OctahedronGeometry(1.9, 16),
    () => new THREE.CylinderGeometry(1.2, 1.2, 2.2, 64, 32),
  ];
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function regenerate() {
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); }
    const geo = geometries[(Math.random() * geometries.length) | 0]();
    mesh = new THREE.Mesh(geo, material);
    mesh.rotation.set(rnd(0, Math.PI), rnd(0, Math.PI), 0);
    scene.add(mesh);
    uniforms.uSeed.value = Math.random() * 100;
    uniforms.uWobble.value = settings.wobble * rnd(0.6, 1.6);
  }
  regenerate();

  function recolor() {
    uniforms.uFg.value.set(css('--scene-ink') || css('--fg'));
    uniforms.uBg.value.set(css('--bg'));
    uniforms.uAccent.value.set(css('--accent'));
  }

  /* ---- pointer: drag to rotate, hover to tilt ---- */
  const target = { x: 0, y: 0 };
  let dragging = false, last = null;
  const onDown = (e) => { dragging = true; last = { x: e.clientX, y: e.clientY }; };
  const onMove = (e) => {
    if (dragging && last) {
      target.y += (e.clientX - last.x) * 0.01;
      target.x += (e.clientY - last.y) * 0.01;
      last = { x: e.clientX, y: e.clientY };
    } else {
      const r = canvas.getBoundingClientRect();
      target.y = ((e.clientX - r.left) / r.width - 0.5) * 0.8;
      target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.8;
    }
  };
  const onUp = () => { dragging = false; last = null; };
  canvas.addEventListener('pointerdown', onDown);
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerup', onUp);
  addEventListener('pointercancel', onUp);

  /* ---- resize ---- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // keep the shape roughly the same visual size on narrow screens
    camera.position.z = w < h ? 9 : 7;
    // push the shape to the right so the headline has room (wide screens only)
    const wide = w / h > 1.2;
    offset.set(wide ? settings.offsetX : 0, wide ? 0.4 : 1.2, 0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* ---- loop (pauses when off screen) ---- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  const clock = new THREE.Clock();
  let drift = 0;
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    uniforms.uTime.value += dt * settings.speed * (reduced ? 0.2 : 1);
    if (!dragging) drift += dt * 0.15 * (reduced ? 0 : 1);
    mesh.rotation.x += (target.x + drift * 0.5 - mesh.rotation.x) * 0.05;
    mesh.rotation.y += (target.y + drift - mesh.rotation.y) * 0.05;
    mesh.position.lerp(offset, 0.08);
    renderer.render(scene, camera);
  }
  tick();

  return {
    regenerate, recolor, uniforms, settings,
    setPixel(p) { settings.pixel = p; renderer.setPixelRatio(p); resize(); },
  };
}

/* Auto-boot on the main page */
const canvas = document.getElementById('scene');
if (canvas && !canvas.dataset.manual) {
  try {
    const s = createScene(canvas);
    document.addEventListener('regen', s.regenerate);
    document.addEventListener('themechange', s.recolor);
  } catch (err) {
    // No WebGL? Fine. The page works without it.
    canvas.remove();
    console.warn('scene skipped:', err);
  }
}
