import * as THREE from "three";

(function initBackgroundScene() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  );
  cam.position.z = 12;

  scene.add(new THREE.AmbientLight(0xffffff, 0.24));
  const pl = new THREE.PointLight(0xffe000, 1.1, 60);
  pl.position.set(5, 5, 6);
  scene.add(pl);
  
  window.accentMaterials = window.accentMaterials || [];
  window.accentMaterials.push(pl);

  const shapes = [];
  const wmat = new THREE.MeshBasicMaterial({
    color: 0xffe000,
    wireframe: true,
    transparent: true,
    opacity: 0.09,
  });

  const crystalConfigs = [
    { geo: new THREE.OctahedronGeometry(0.95, 0), pos: [-8.5, -2.8, -5.5] },
    { geo: new THREE.IcosahedronGeometry(0.75, 0), pos: [8.2, 2.4, -6.5] },
    { geo: new THREE.TetrahedronGeometry(1.1, 0), pos: [0.8, -4.8, -7.5] },
    { geo: new THREE.OctahedronGeometry(0.65, 0), pos: [-2.5, 4.4, -8.5] },
  ];
  crystalConfigs.forEach((cfg, i) => {
    const mesh = new THREE.Mesh(cfg.geo, wmat.clone());
    mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    mesh.rotation.set(i * 0.5, i * 0.7, i * 0.3);
    mesh.userData = {
      rx: 0.0012 + i * 0.0002,
      ry: i % 2 ? -0.0014 : 0.001,
      drift: 0.0012 + i * 0.00012,
      baseY: cfg.pos[1],
      phase: i * 1.3,
    };
    scene.add(mesh);
    shapes.push(mesh);
    window.accentMaterials.push(mesh.material);
  });

  const tmat = new THREE.MeshBasicMaterial({
    color: 0xffe000,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  [
    { size: 3.2, pos: [-5.8, -1.2, -9], rot: [1.3, 0.2, 0.8] },
    { size: 2.4, pos: [6.5, 3, -8], rot: [1.1, 0.8, 0.1] },
    { size: 1.8, pos: [2.2, -3.8, -10], rot: [0.9, 0.1, 1.2] },
  ].forEach((cfg, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.size, 0.03, 10, 90),
      tmat.clone(),
    );
    ring.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    ring.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    ring.userData = {
      rx: i % 2 ? -0.0007 : 0.0008,
      ry: 0.0011,
      drift: 0.0008,
      baseY: cfg.pos[1],
      phase: i * 1.6,
    };
    scene.add(ring);
    shapes.push(ring);
    window.accentMaterials.push(ring.material);
  });

  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 220;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const stride = i * 3;
    dustPos[stride] = (Math.random() - 0.5) * 40;
    dustPos[stride + 1] = (Math.random() - 0.5) * 24;
    dustPos[stride + 2] = -12 + Math.random() * 6;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  scene.add(
    new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xffe680,
        size: 0.05,
        transparent: true,
        opacity: 0.22,
      }),
    ),
  );

  let mouseX = 0,
    mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  function bgRender() {
    requestAnimationFrame(bgRender);
    const t = performance.now() * 0.001;
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.position.y =
        s.userData.baseY + Math.sin(t * 0.45 + s.userData.phase) * 0.55;
      s.position.x += Math.sin(t * 0.12 + s.userData.phase) * s.userData.drift;
    });
    cam.position.x += (mouseX - cam.position.x) * 0.04;
    cam.position.y += (mouseY - cam.position.y) * 0.04;
    cam.lookAt(0, 0, -6);
    renderer.render(scene, cam);
  }
  bgRender();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
  });
})();
