/* Hero 3D: tijeras, navaja, máquina y peine modelados en código con three.js.
 *
 * No hay archivos de modelo ni texturas: toda la geometría y el entorno de
 * reflejos se generan aquí, así que el hero solo descarga three.js (≈140 KB).
 * Las piezas flotan y giran despacio solas; con «Reducir movimiento» quedan
 * quietas, y la animación se pausa cuando el hero no está en pantalla.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const canvas = document.getElementById('hero3d');
const hero = document.getElementById('scroll-hero');

if (canvas && hero) {
  try { iniciar(); } catch (err) { console.warn('Hero 3D no disponible:', err && err.message); }
}

function iniciar() {
  const QUIETO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  /* ── Reflejos: un «estudio» oscuro con paneles de luz, horneado con PMREM ── */
  function hornearEntorno() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    if (scene.environment) scene.environment.dispose();
    scene.environment = pmrem.fromScene(estudio(), 0.03).texture;
    pmrem.dispose();
  }
  hornearEntorno();

  // Luz de recorte que se mueve despacio para que los metales destellen
  const clave = new THREE.DirectionalLight(0xffffff, 2.2);
  clave.position.set(4, 5, 6);
  scene.add(clave);
  const contra = new THREE.DirectionalLight(0xb8c4d6, 1.2);
  contra.position.set(-6, -2, -4);
  scene.add(contra);

  /* ── Materiales ── */
  const M = {
    cromo: new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.12 }),
    acero: new THREE.MeshPhysicalMaterial({ color: 0xe6eaef, metalness: 1, roughness: 0.16 }),
    oro: new THREE.MeshPhysicalMaterial({ color: 0xd8ab5e, metalness: 1, roughness: 0.22 }),
    lacado: new THREE.MeshPhysicalMaterial({ color: 0x0d0d0d, metalness: 0.1, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.06 }),
    mate: new THREE.MeshPhysicalMaterial({ color: 0x151515, metalness: 0, roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
    caucho: new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0, roughness: 0.85 }),
  };

  const piezas = [
    { obj: tijeras(M), fase: 0.0, giro: 0.22 },
    { obj: navaja(M), fase: 1.7, giro: -0.18 },
    { obj: maquina(M), fase: 3.1, giro: 0.15 },
    { obj: peine(M), fase: 4.4, giro: -0.2 },
  ];
  piezas.forEach(function (p) { scene.add(p.obj); });

  /* Dónde va cada pieza: alrededor del texto, nunca encima del título.
     [x, y] en fracciones del medio ancho/alto visible, escala, inclinación base */
  const LAYOUT_ANCHO = [
    [-0.66, 0.26, 1.0, [0.35, 0.25, 0.55]],
    [0.66, 0.30, 0.95, [0.25, -0.3, -0.45]],
    [-0.64, -0.40, 0.85, [0.3, 0.45, -0.35]],
    [0.64, -0.44, 0.95, [0.45, -0.2, 0.3]],
  ];
  // En vertical: dos a los lados del logo y dos debajo de los botones
  const LAYOUT_ALTO = [
    [-0.58, 0.53, 0.4, [0.35, 0.25, 0.5]],
    [0.60, 0.55, 0.4, [0.25, -0.3, -0.6]],
    [-0.48, -0.50, 0.4, [0.3, 0.45, -0.5]],
    [0.50, -0.56, 0.42, [0.45, -0.2, 0.4]],
  ];

  function colocar() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    // En celular se limita la resolución: se ve nítido y no calienta el teléfono
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 820 ? 1.75 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const medioAlto = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const medioAncho = medioAlto * camera.aspect;
    const layout = camera.aspect < 1 ? LAYOUT_ALTO : LAYOUT_ANCHO;
    // La escala sigue al lado corto de la pantalla
    const base = Math.min(medioAncho, medioAlto) / 3.1;
    piezas.forEach(function (p, i) {
      const l = layout[i];
      p.x = l[0] * medioAncho; p.y = l[1] * medioAlto;
      p.obj.scale.setScalar(base * l[2] * (camera.aspect < 1 ? 1.9 : 1));
      p.rot = l[3];
    });
  }

  let t = 0, ultimo = performance.now(), activo = true, pedido = false;
  function pose(dt) {
    t += dt;
    piezas.forEach(function (p) {
      const s = t * 0.5 + p.fase;
      p.obj.position.set(p.x + Math.sin(s * 0.7) * 0.06, p.y + Math.sin(s) * 0.12, Math.sin(s * 0.6) * 0.3);
      p.obj.rotation.set(
        p.rot[0] + Math.sin(s * 0.8) * 0.18,
        p.rot[1] + Math.sin(t * p.giro * 2 + p.fase) * 0.8,   // balanceo: casi siempre de frente
        p.rot[2] + Math.sin(s * 0.5) * 0.08
      );
      if (p.obj.userData.animar) p.obj.userData.animar(t);
    });
    clave.position.set(Math.cos(t * 0.15) * 6, 5, Math.sin(t * 0.15) * 6 + 2);
  }

  function frame(ahora) {
    pedido = false;
    if (!activo) return;
    const dt = Math.min(0.05, (ahora - ultimo) / 1000);
    ultimo = ahora;
    pose(dt);
    renderer.render(scene, camera);
    if (!QUIETO) pedir();
  }
  function pedir() { if (!pedido) { pedido = true; requestAnimationFrame(frame); } }

  colocar();
  pose(0);
  renderer.render(scene, camera);
  if (!QUIETO) pedir();

  window.addEventListener('resize', function () { colocar(); pose(0); renderer.render(scene, camera); });

  // El celular puede quitarle la GPU a la pestaña (memoria, segundo plano). three.js
  // recupera el contexto, pero los reflejos horneados hay que volver a generarlos.
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); canvas.classList.remove('listo'); });
  canvas.addEventListener('webglcontextrestored', function () {
    hornearEntorno();
    pose(0);
    renderer.render(scene, camera);
    canvas.classList.add('listo');
    if (!QUIETO) { ultimo = performance.now(); pedir(); }
  });

  // Sin hero en pantalla no se dibuja nada
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      activo = e[0].isIntersecting;
      if (activo && !QUIETO) { ultimo = performance.now(); pedir(); }
    }).observe(hero);
  }
  canvas.classList.add('listo');
}

/* ════════ Entorno ════════ */
function estudio() {
  const s = new THREE.Scene();
  const sala = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 12), new THREE.MeshBasicMaterial({ color: 0x1c1c1c, side: THREE.BackSide }));
  s.add(sala);
  function panel(w, h, intensidad, x, y, z, ry, rx) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(intensidad, intensidad, intensidad), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0);
    s.add(m);
  }
  panel(8, 2.5, 14, 0, 3.9, 0, 0, Math.PI / 2);       // tira del techo
  panel(4, 6, 6, -5.9, 0.5, 0, Math.PI / 2);          // caja suave izquierda
  panel(2, 6, 10, 5.9, 0.5, -1, -Math.PI / 2);        // recorte derecho
  panel(8, 3, 3, 0, 0, 5.9, Math.PI);                 // relleno frontal
  panel(10, 1, 2, 0, -3.9, 0, 0, -Math.PI / 2);       // rebote del suelo
  return s;
}

/* ════════ Piezas ════════ */
function extruir(shape, prof, bisel, mat) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: prof, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel,
    bevelSegments: 4, curveSegments: 24,
  });
  g.translate(0, 0, -prof / 2);
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

function tijeras(M) {
  const grupo = new THREE.Group();
  function mitad(lado) {
    const h = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(-0.55, -0.05 * lado);
    s.lineTo(0, -0.085 * lado);
    s.quadraticCurveTo(0.9, -0.075 * lado, 1.75, 0.005 * lado);
    s.quadraticCurveTo(0.9, 0.03 * lado, 0, 0.075 * lado);
    s.lineTo(-0.55, 0.045 * lado);
    s.closePath();
    const hoja = extruir(s, 0.025, 0.012, M.cromo);
    h.add(hoja);
    const anillo = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.045, 24, 64), M.cromo);
    anillo.position.set(-0.78, -0.14 * lado, 0);
    anillo.scale.set(1.15, 0.9, 1);
    h.add(anillo);
    if (lado > 0) {   // apoyadedo
      const apoyo = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.28, 8, 16), M.cromo);
      apoyo.position.set(-0.98, 0.15, 0);
      apoyo.rotation.z = 0.9;
      h.add(apoyo);
    }
    h.position.z = 0.03 * lado;
    return h;
  }
  const a = mitad(1), b = mitad(-1);
  grupo.add(a, b);
  const tornillo = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 40), M.oro);
  tornillo.rotation.x = Math.PI / 2;
  grupo.add(tornillo);
  grupo.userData.animar = function (t) {
    const abre = 0.06 + 0.14 * (0.5 + 0.5 * Math.sin(t * 0.9));
    a.rotation.z = abre; b.rotation.z = -abre;
  };
  return grupo;
}

function navaja(M) {
  const grupo = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(-0.15, 0.1);
  s.lineTo(1.05, 0.19);
  s.quadraticCurveTo(1.24, 0.19, 1.24, 0.02);
  s.lineTo(1.22, -0.14);
  s.quadraticCurveTo(0.6, -0.2, 0.05, -0.07);
  s.lineTo(-0.15, -0.02);
  s.closePath();
  const hoja = extruir(s, 0.018, 0.01, M.acero);
  const filo = new THREE.Group();
  filo.add(hoja);
  filo.rotation.z = -0.18;
  grupo.add(filo);
  const c = new THREE.Shape();
  c.moveTo(-0.02, 0.11);
  c.quadraticCurveTo(-0.7, 0.2, -1.45, 0.1);
  c.quadraticCurveTo(-1.58, 0, -1.45, -0.1);
  c.quadraticCurveTo(-0.7, -0.15, -0.02, -0.09);
  c.quadraticCurveTo(0.08, 0.01, -0.02, 0.11);
  [-1, 1].forEach(function (lado) {
    const cacha = extruir(c, 0.03, 0.015, M.lacado);
    cacha.position.z = 0.04 * lado;
    grupo.add(cacha);
  });
  [[0, 0], [-1.36, 0]].forEach(function (p) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 32), M.oro);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(p[0], p[1], 0);
    grupo.add(pin);
  });
  grupo.position.x = 0.15;
  const centrado = new THREE.Group();
  centrado.add(grupo);
  return centrado;
}

function maquina(M) {
  const grupo = new THREE.Group();
  const perfil = [
    [0.0, -1.0], [0.2, -0.99], [0.27, -0.94], [0.3, -0.8], [0.32, -0.3],
    [0.35, 0.3], [0.39, 0.62], [0.41, 0.8], [0.4, 0.9], [0.34, 0.96], [0.0, 0.97],
  ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  const cuerpo = new THREE.Mesh(new THREE.LatheGeometry(perfil, 64), M.lacado);
  cuerpo.scale.z = 0.62;
  grupo.add(cuerpo);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.385, 0.022, 16, 64), M.oro);
  aro.rotation.x = Math.PI / 2;
  aro.scale.set(1, 0.62, 1);
  aro.position.y = 0.55;
  grupo.add(aro);
  // Cabezal: base de cromo y peine de cuchillas
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.12, 0.3), M.cromo);
  base.position.y = 1.0;
  grupo.add(base);
  const n = 22, diente = new THREE.BoxGeometry(0.024, 0.16, 0.06);
  const dientes = new THREE.InstancedMesh(diente, M.cromo, n);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    m4.makeTranslation(-0.4 + (0.8 * i) / (n - 1), 1.13, 0.08);
    dientes.setMatrixAt(i, m4);
  }
  grupo.add(dientes);
  const interruptor = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.16, 8, 16), M.cromo);
  interruptor.position.set(0, 0.2, 0.22);
  grupo.add(interruptor);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.28, 24), M.caucho);
  cable.position.y = -1.1;
  grupo.add(cable);
  grupo.scale.setScalar(0.95);
  return grupo;
}

function peine(M) {
  const grupo = new THREE.Group();
  const s = new THREE.Shape();
  const L = 1.9, H = 0.2, r = 0.08;
  s.moveTo(-L / 2 + r, 0);
  s.lineTo(L / 2 - r, 0);
  s.quadraticCurveTo(L / 2, 0, L / 2, r);
  s.lineTo(L / 2, H - r);
  s.quadraticCurveTo(L / 2, H, L / 2 - r, H);
  s.lineTo(-L / 2 + r, H);
  s.quadraticCurveTo(-L / 2, H, -L / 2, H - r);
  s.lineTo(-L / 2, r);
  s.quadraticCurveTo(-L / 2, 0, -L / 2 + r, 0);
  grupo.add(extruir(s, 0.04, 0.012, M.mate));
  // Dientes: la mitad gruesos y separados, la otra mitad finos
  const posiciones = [];
  for (let x = -0.86; x < 0; x += 0.075) posiciones.push([x, 0.034]);
  for (let x = 0.03; x <= 0.87; x += 0.045) posiciones.push([x, 0.022]);
  const g = new THREE.CylinderGeometry(1, 0.55, 1, 12);
  g.translate(0, -0.5, 0);
  const dientes = new THREE.InstancedMesh(g, M.mate, posiciones.length);
  const m4 = new THREE.Matrix4();
  posiciones.forEach(function (p, i) {
    m4.compose(new THREE.Vector3(p[0], 0.02, 0), new THREE.Quaternion(), new THREE.Vector3(p[1] / 2, 0.5, 0.022));
    dientes.setMatrixAt(i, m4);
  });
  grupo.add(dientes);
  grupo.position.y = 0.15;
  const centrado = new THREE.Group();
  centrado.add(grupo);
  return centrado;
}
