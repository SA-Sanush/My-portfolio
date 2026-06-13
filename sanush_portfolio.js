/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
const cur = document.getElementById("cur");
const curRing = document.getElementById("cur-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + "px";
  cur.style.top = my + "px";
});
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  curRing.style.left = rx + "px";
  curRing.style.top = ry + "px";
  requestAnimationFrame(animRing);
}
animRing();
document
  .querySelectorAll("a,button,.sk-card,.edu-card,.about-card,.resume-cta")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => curRing.classList.add("big"));
    el.addEventListener("mouseleave", () => curRing.classList.remove("big"));
  });

/* ═══════════════════════════════════════
   LOADER — Three.js spinning logo
═══════════════════════════════════════ */
(function () {
  const lc = document.getElementById("loader-canvas");
  const bar = document.getElementById("lbar");
  const pct = document.getElementById("lpct");
  let p = 0;
  let lAnim = 0;
  let renderer = null;
  const iv = setInterval(() => {
    p += p < 85 ? Math.random() * 3 + 1 : Math.random() * 0.5;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      finish();
    }
    bar.style.width = p + "%";
    pct.textContent = Math.floor(p) + "%";
  }, 60);

  function finish() {
    setTimeout(() => {
      document.getElementById("loader").classList.add("done");
      document.getElementById("app").classList.add("show");
      if (lAnim) cancelAnimationFrame(lAnim);
      if (renderer) renderer.dispose();
    }, 600);
  }

  if (!window.THREE || !lc) return;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: lc,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    cam.position.set(0, 0.2, 6.5);

    const setLoaderSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      lc.width = width;
      lc.height = height;
      renderer.setSize(width, height);
      cam.aspect = width / height;
      cam.updateProjectionMatrix();
    };
    setLoaderSize();

    scene.add(new THREE.AmbientLight(0xf8f3d0, 0.8));
    const keyLight = new THREE.DirectionalLight(0xffe000, 2.2);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xffffff, 1.2, 18);
    fillLight.position.set(-5, -1, 4);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0xffd24a, 1, 20);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe0bb18,
      metalness: 0.92,
      roughness: 0.18,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x171717,
      metalness: 0.45,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92,
    });
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xffe000,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    window.accentMaterials = window.accentMaterials || [];
    window.accentMaterials.push(goldMat, lineMat, keyLight, rimLight);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const loaderRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.18, 24, 96),
      goldMat,
    );
    loaderRing.rotation.x = Math.PI / 2.6;
    loaderRing.rotation.y = Math.PI / 5;
    sculpture.add(loaderRing);

    const loaderCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.82, 0),
      darkMat,
    );
    sculpture.add(loaderCore);

    const loaderCoreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.95, 0),
      lineMat,
    );
    sculpture.add(loaderCoreWire);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.028, 8, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffe000,
        transparent: true,
        opacity: 0.35,
      }),
    );
    halo.rotation.x = Math.PI / 2.05;
    halo.rotation.y = Math.PI / 8;
    sculpture.add(halo);

    const accentRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.08, 16, 64),
      goldMat,
    );
    accentRing.position.set(0.8, -0.55, 0.45);
    accentRing.rotation.x = Math.PI / 3;
    accentRing.rotation.y = Math.PI / 4;
    sculpture.add(accentRing);

    const pgeo = new THREE.BufferGeometry();
    const pcount = 180;
    const ppos = new Float32Array(pcount * 3);
    for (let i = 0; i < pcount; i++) {
      const stride = i * 3;
      const spread = 18;
      ppos[stride] = (Math.random() - 0.5) * spread;
      ppos[stride + 1] = (Math.random() - 0.5) * spread;
      ppos[stride + 2] = (Math.random() - 0.5) * spread;
    }
    pgeo.setAttribute("position", new THREE.BufferAttribute(ppos, 3));
    scene.add(
      new THREE.Points(
        pgeo,
        new THREE.PointsMaterial({
          color: 0xffe680,
          size: 0.045,
          transparent: true,
          opacity: 0.35,
        }),
      ),
    );

    const resizeLoaderSculpture = () => {
      const isMobile = window.innerWidth < 720;
      const isSmallPhone = window.innerWidth < 480;
      sculpture.scale.setScalar(isSmallPhone ? 0.62 : isMobile ? 0.74 : 1);
      sculpture.position.set(
        isSmallPhone ? 1.8 : isMobile ? 1.15 : 1.35,
        isSmallPhone ? -2.45 : isMobile ? -1.65 : -0.2,
        isSmallPhone ? -1.4 : isMobile ? -0.95 : -0.5,
      );
      cam.position.set(
        isSmallPhone ? -0.05 : isMobile ? -0.02 : -0.1,
        isSmallPhone ? 0.18 : isMobile ? 0.1 : 0.2,
        isSmallPhone ? 8.2 : isMobile ? 7.6 : 6.5,
      );
    };
    resizeLoaderSculpture();

    function lRender() {
      lAnim = requestAnimationFrame(lRender);
      const t = performance.now() * 0.001;
      sculpture.rotation.y = t * 0.5;
      sculpture.rotation.x = Math.sin(t * 0.8) * 0.12;
      loaderCore.rotation.x = -t * 0.5;
      loaderCore.rotation.y = t * 0.7;
      loaderCoreWire.rotation.copy(loaderCore.rotation);
      loaderRing.rotation.z = t * 0.45;
      accentRing.rotation.z = -t * 0.8;
      halo.scale.setScalar(1 + Math.sin(t * 2.2) * 0.025);
      const mobileShift = window.innerWidth < 720;
      const smallPhoneShift = window.innerWidth < 480;
      cam.position.x +=
        (((smallPhoneShift ? -0.02 : mobileShift ? 0.02 : -0.1) +
          Math.sin(t * 0.7) * (smallPhoneShift ? 0.03 : 0.08)) -
          cam.position.x) *
        0.04;
      cam.position.y +=
        (((smallPhoneShift ? 0.18 : mobileShift ? 0.1 : 0.2) +
          Math.cos(t * 0.9) * (smallPhoneShift ? 0.02 : 0.05)) -
          cam.position.y) *
        0.04;
      cam.lookAt(
        smallPhoneShift ? 0.08 : mobileShift ? 0.14 : 0.55,
        smallPhoneShift ? 0.42 : mobileShift ? 0.18 : -0.05,
        0,
      );
      renderer.render(scene, cam);
    }
    lRender();

    window.addEventListener("resize", () => {
      setLoaderSize();
      resizeLoaderSculpture();
    });
  } catch (error) {
    console.warn("Loader 3D scene skipped:", error);
  }
})();

/* BG CANVAS */
(function () {
  const canvas = document.getElementById("bg-canvas");
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

/* SHOWCASE CANVAS */
(function () {
  const canvas = document.getElementById("showcase-canvas");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x090909, 12, 26);
  const cam = new THREE.PerspectiveCamera(
    55,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    200,
  );
  cam.position.set(0, 2.2, 12.5);

  scene.add(new THREE.AmbientLight(0xf5eed2, 0.85));
  const dirL = new THREE.DirectionalLight(0xffe000, 2.6);
  dirL.position.set(6, 11, 9);
  dirL.castShadow = true;
  scene.add(dirL);
  const pl2 = new THREE.PointLight(0xffffff, 1.85, 32);
  pl2.position.set(-4.5, 3.5, 8);
  scene.add(pl2);
  const pl3 = new THREE.PointLight(0xffd54d, 1.25, 24);
  pl3.position.set(1.5, -1.2, 7.5);
  scene.add(pl3);

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2ba17,
    metalness: 1,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  const satinMat = new THREE.MeshStandardMaterial({
    color: 0x191919,
    metalness: 0.88,
    roughness: 0.16,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0d0d0d,
    metalness: 0.12,
    roughness: 0.02,
    transparent: true,
    opacity: 0.92,
    transmission: 0.4,
    thickness: 1.5,
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffe000,
    wireframe: true,
    transparent: true,
    opacity: 0.24,
  });

  const grid = new THREE.GridHelper(30, 32, 0x8f7d0c, 0x171717);
  grid.material.opacity = 0.22;
  grid.material.transparent = true;
  grid.position.y = -3;
  scene.add(grid);

  const floorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 0.12, 7.2),
    new THREE.MeshStandardMaterial({
      color: 0x0d0d0d,
      metalness: 0.78,
      roughness: 0.32,
    }),
  );
  floorPlate.position.set(0, -2.94, 0.4);
  scene.add(floorPlate);

  const room = new THREE.Group();
  room.position.set(0, -0.35, 0);
  scene.add(room);

  const mobileRig = new THREE.Group();
  mobileRig.visible = false;
  scene.add(mobileRig);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.16, 2),
    satinMat,
  );
  deskTop.position.set(0, -0.8, 0.4);
  room.add(deskTop);

  [
    [-2.1, -1.95, -0.25],
    [2.1, -1.95, -0.25],
    [-2.1, -1.95, 1.05],
    [2.1, -1.95, 1.05],
  ].forEach((pos) => {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 2.2, 0.14),
      goldMat,
    );
    leg.position.set(pos[0], pos[1], pos[2]);
    room.add(leg);
  });

  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.25, 1.32, 0.1),
    satinMat,
  );
  monitorFrame.position.set(0, 0.2, -0.15);
  room.add(monitorFrame);

  const monitorScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.02),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.95,
    }),
  );
  monitorScreen.position.set(0, 0.2, -0.09);
  room.add(monitorScreen);

  const monitorStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.72, 0.16),
    goldMat,
  );
  monitorStand.position.set(0, -0.48, -0.05);
  room.add(monitorStand);

  const monitorBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.68, 0.08, 48),
    satinMat,
  );
  monitorBase.position.set(0, -0.82, 0.15);
  monitorBase.rotation.x = Math.PI / 2;
  room.add(monitorBase);

  const monitorGlow = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.03, 10, 120),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.24,
    }),
  );
  monitorGlow.position.set(0, 0.12, -0.4);
  monitorGlow.rotation.x = Math.PI / 2.35;
  room.add(monitorGlow);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.08, 0.48),
    satinMat,
  );
  keyboard.position.set(0, -0.68, 0.95);
  keyboard.rotation.x = -0.18;
  room.add(keyboard);

  const mousePad = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.02, 0.54),
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.2,
      roughness: 0.85,
    }),
  );
  mousePad.position.set(1.28, -0.73, 0.92);
  room.add(mousePad);

  const mouse = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 20, 20),
    goldMat,
  );
  mouse.scale.set(1, 0.48, 1.4);
  mouse.position.set(1.28, -0.64, 0.92);
  room.add(mouse);

  [-1.9, 1.9].forEach((x) => {
    const speaker = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 1.18, 0.48),
      satinMat,
    );
    speaker.position.set(x, -0.08, 0.08);
    room.add(speaker);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.03, 12, 70),
      new THREE.MeshBasicMaterial({
        color: 0xffe000,
        transparent: true,
        opacity: 0.55,
      }),
    );
    ring.position.set(x, 0.08, 0.34);
    ring.rotation.x = Math.PI / 2;
    room.add(ring);
  });

  const pcBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 2.05, 1.72),
    satinMat,
  );
  pcBody.position.set(3.22, -0.22, 0.08);
  room.add(pcBody);

  const pcGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1.68),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.14,
    }),
  );
  pcGlass.position.set(2.66, -0.12, 0.08);
  pcGlass.rotation.y = Math.PI / 2;
  room.add(pcGlass);

  const fanRingTop = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.03, 10, 72),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.42,
    }),
  );
  fanRingTop.position.set(2.67, 0.38, 0.08);
  fanRingTop.rotation.y = Math.PI / 2;
  room.add(fanRingTop);

  const fanRingBottom = fanRingTop.clone();
  fanRingBottom.position.y = -0.48;
  room.add(fanRingBottom);

  const chair = new THREE.Group();
  chair.position.set(0, -0.58, 2.15);
  room.add(chair);

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.18, 1.05),
    goldMat,
  );
  seat.position.set(0, -0.45, 0);
  chair.add(seat);

  const backRest = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 1.6, 0.2),
    satinMat,
  );
  backRest.position.set(0, 0.38, -0.38);
  backRest.rotation.x = -0.14;
  chair.add(backRest);

  const chairFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.04, 12, 90),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.24,
    }),
  );
  chairFrame.position.set(0, 0.24, -0.28);
  chairFrame.rotation.x = Math.PI / 2.15;
  chair.add(chairFrame);

  const chairStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.95, 20),
    goldMat,
  );
  chairStem.position.set(0, -1.02, 0);
  chair.add(chairStem);

  const chairBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.64, 0.2, 0.08, 6),
    satinMat,
  );
  chairBase.position.set(0, -1.48, 0);
  chairBase.rotation.y = Math.PI / 6;
  chair.add(chairBase);

  const leftPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 3.4, 4.8),
    new THREE.MeshStandardMaterial({
      color: 0x0b0b0b,
      metalness: 0.45,
      roughness: 0.7,
      transparent: true,
      opacity: 0.9,
    }),
  );
  leftPanel.position.set(-4.85, -0.5, -0.2);
  room.add(leftPanel);

  const rightPanel = leftPanel.clone();
  rightPanel.position.x = 4.85;
  room.add(rightPanel);

  const panelLineLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(0.02, 3),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.35,
    }),
  );
  panelLineLeft.position.set(-4.77, -0.35, 1.2);
  room.add(panelLineLeft);

  const panelLineRight = panelLineLeft.clone();
  panelLineRight.position.x = 4.77;
  room.add(panelLineRight);

  const phoneShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.92, 3.68, 0.2),
    satinMat,
  );
  phoneShell.position.set(0, 0.1, 0);
  mobileRig.add(phoneShell);

  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.56, 3.12),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.9,
    }),
  );
  phoneScreen.position.set(0, 0.12, 0.105);
  mobileRig.add(phoneScreen);

  const phoneGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.62, 3.18),
    glassMat,
  );
  phoneGlass.position.set(0, 0.12, 0.112);
  mobileRig.add(phoneGlass);

  const phoneBezelLine = new THREE.Mesh(
    new THREE.TorusGeometry(1.36, 0.02, 12, 120),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.28,
    }),
  );
  phoneBezelLine.scale.set(0.66, 1.28, 1);
  phoneBezelLine.position.set(0, 0.12, 0.01);
  mobileRig.add(phoneBezelLine);

  const cameraDot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.03, 24),
    goldMat,
  );
  cameraDot.rotation.x = Math.PI / 2;
  cameraDot.position.set(0, 1.48, 0.11);
  mobileRig.add(cameraDot);

  const phoneGlow = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.035, 12, 140),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.2,
    }),
  );
  phoneGlow.scale.set(0.84, 1.42, 1);
  phoneGlow.position.set(0, 0.12, -0.18);
  mobileRig.add(phoneGlow);

  const mobileStand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.75, 1.95, 0.12, 6),
    new THREE.MeshStandardMaterial({
      color: 0x0f0f0f,
      metalness: 0.76,
      roughness: 0.34,
    }),
  );
  mobileStand.position.set(0, -2.34, 0.28);
  mobileStand.rotation.y = Math.PI / 6;
  mobileRig.add(mobileStand);

  const mobileAura = new THREE.Mesh(
    new THREE.TorusGeometry(2.55, 0.03, 10, 120),
    new THREE.MeshBasicMaterial({
      color: 0xffe000,
      transparent: true,
      opacity: 0.22,
    }),
  );
  mobileAura.position.set(0, -0.18, -0.55);
  mobileAura.rotation.x = Math.PI / 2.18;
  mobileRig.add(mobileAura);

  const mobileCards = [];
  [
    { size: [0.88, 1.18, 0.08], pos: [-1.85, 0.92, -0.68], rot: [0.22, 0.72, -0.16] },
    { size: [0.76, 1.02, 0.08], pos: [1.82, 0.18, -0.6], rot: [-0.16, -0.68, 0.14] },
    { size: [0.66, 0.88, 0.08], pos: [-1.34, -1.18, -0.46], rot: [-0.2, 0.48, 0.18] },
  ].forEach((cfg) => {
    const card = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.size[0], cfg.size[1], cfg.size[2]),
      satinMat,
    );
    card.add(body);

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(cfg.size[0] * 0.76, cfg.size[1] * 0.72),
      new THREE.MeshBasicMaterial({
        color: 0xffe000,
        transparent: true,
        opacity: 0.72,
      }),
    );
    face.position.z = cfg.size[2] * 0.58;
    card.add(face);

    card.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    card.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    mobileRig.add(card);
    mobileCards.push({
      mesh: card,
      baseY: cfg.pos[1],
      baseZ: cfg.pos[2],
      baseRotZ: cfg.rot[2],
    });
  });

  const pGeo = new THREE.BufferGeometry();
  const pCount = 260;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const stride = i * 3;
    pPos[stride] = (Math.random() - 0.5) * 24;
    pPos[stride + 1] = (Math.random() - 0.5) * 14;
    pPos[stride + 2] = (Math.random() - 0.5) * 18;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  scene.add(
    new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xffe680,
        size: 0.05,
        transparent: true,
        opacity: 0.4,
      }),
    ),
  );

  let isDragging = false,
    prevMX = 0,
    prevMY = 0,
    theta = 0,
    phi = 0.3,
    radius = 12;
  let cameraLift = 1;
  let lookAtX = 0.34;
  let lookAtY = -0.16;

  const setShowcaseView = () => {
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 900;

    if (isMobile) {
      room.visible = false;
      mobileRig.visible = true;
      mobileRig.position.set(0, -0.18, 0.45);
      mobileRig.scale.setScalar(0.96);
      grid.position.y = -2.55;
      floorPlate.position.y = -2.48;
      radius = 7.1;
      phi = Math.max(-0.12, Math.min(phi, 0.22));
      cameraLift = 0.44;
      lookAtX = 0;
      lookAtY = -0.18;
      return;
    }

    room.visible = true;
    mobileRig.visible = false;
    room.scale.setScalar(isTablet ? 0.88 : 0.84);
    room.position.set(
      isTablet ? 0.12 : 0,
      isTablet ? 0.05 : -1.22,
      isTablet ? 0.18 : 0,
    );
    grid.position.y = isTablet ? -2.7 : -3;
    floorPlate.position.y = isTablet ? -2.62 : -2.94;
    radius = isTablet ? 10 : 11.4;
    phi = Math.max(-0.15, Math.min(phi, isTablet ? 0.22 : 0.1));
    cameraLift = isTablet ? 0.82 : 0.42;
    lookAtX = isTablet ? 0.08 : 0;
    lookAtY = isTablet ? -0.1 : -1.02;
    if (!isTablet) {
      theta = 0;
    }
  };
  setShowcaseView();

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMX = e.clientX;
    prevMY = e.clientY;
  });
  window.addEventListener("mouseup", () => (isDragging = false));
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    theta -= (e.clientX - prevMX) * 0.007;
    phi -= (e.clientY - prevMY) * 0.004;
    phi = Math.max(-0.4, Math.min(1.2, phi));
    prevMX = e.clientX;
    prevMY = e.clientY;
  });
  canvas.addEventListener("wheel", (e) => {
    radius += e.deltaY * 0.02;
    radius = Math.max(6, Math.min(20, radius));
  });

  canvas.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      isDragging = true;
      prevMX = touch.clientX;
      prevMY = touch.clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      if (!touch) return;
      theta -= (touch.clientX - prevMX) * 0.007;
      phi -= (touch.clientY - prevMY) * 0.004;
      phi = Math.max(-0.4, Math.min(1.2, phi));
      prevMX = touch.clientX;
      prevMY = touch.clientY;
    },
    { passive: true },
  );

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Raycasting Setup for 3D Interactions
  const raycaster = new THREE.Raycaster();
  const rayMouse = new THREE.Vector2(-9999, -9999);
  let hoveredObj = null;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    rayMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    rayMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  canvas.addEventListener("mouseleave", () => {
    rayMouse.set(-9999, -9999);
  });

  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvas.getBoundingClientRect();
    rayMouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    rayMouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
  }, { passive: true });

  canvas.addEventListener("click", () => {
    if (hoveredObj) {
      const target = document.getElementById("projects");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  let t = 0;
  function scRender() {
    requestAnimationFrame(scRender);
    t += 0.01;
    if (mobileRig.visible) {
      mobileRig.rotation.y = Math.sin(t * 0.4) * 0.18;
      mobileRig.rotation.x = Math.cos(t * 0.32) * 0.04;
      mobileRig.position.y = -0.18 + Math.sin(t * 0.8) * 0.12;
      phoneGlow.rotation.z += 0.006;
      mobileAura.rotation.z -= 0.004;
      phoneScreen.material.opacity = 0.78 + Math.sin(t * 1.7) * 0.16;
      mobileCards.forEach((card, index) => {
        const offset = t * (0.9 + index * 0.18) + index * 1.4;
        card.mesh.position.y = card.baseY + Math.sin(offset) * 0.14;
        card.mesh.position.z = card.baseZ + Math.cos(offset) * 0.08;
        card.mesh.rotation.z = card.baseRotZ + Math.sin(offset) * 0.08;
      });
    } else {
      room.rotation.y = Math.sin(t * 0.22) * 0.08;
      monitorGlow.rotation.z += 0.004;
      fanRingTop.rotation.z += 0.05;
      fanRingBottom.rotation.z -= 0.05;
      chair.position.y = -0.58 + Math.sin(t * 0.9) * 0.08;
      chair.rotation.y = Math.sin(t * 0.55) * 0.08;
      mouse.position.y = -0.64 + Math.sin(t * 2.4) * 0.025;
      keyboard.rotation.x = -0.18 + Math.sin(t * 1.2) * 0.015;
      monitorScreen.material.opacity = 0.82 + Math.sin(t * 1.8) * 0.13;
    }
    cam.position.x = radius * Math.sin(theta) * Math.cos(phi);
    cam.position.y = radius * Math.sin(phi) + cameraLift;
    cam.position.z = radius * Math.cos(theta) * Math.cos(phi);
    cam.lookAt(lookAtX, lookAtY, 0.35);

    // Raycast calculations for hover interaction
    raycaster.setFromCamera(rayMouse, cam);
    let intersects = [];
    if (mobileRig.visible) {
      intersects = raycaster.intersectObject(phoneScreen);
    } else {
      intersects = raycaster.intersectObject(monitorScreen);
    }

    const curRing = document.getElementById("cur-ring");
    if (intersects.length > 0) {
      hoveredObj = intersects[0].object;
      if (curRing) {
        curRing.classList.add("cur-hover-3d");
      }
      if (mobileRig.visible) {
        phoneScreen.material.color.setHex(0xffffff);
      } else {
        monitorScreen.material.color.setHex(0xffffff);
      }
    } else {
      if (hoveredObj) {
        const accentHex = window.currentAccentColor || "#ffe000";
        const threeColor = new THREE.Color(accentHex);
        monitorScreen.material.color.copy(threeColor);
        phoneScreen.material.color.copy(threeColor);
        hoveredObj = null;
      }
      if (curRing) {
        curRing.classList.remove("cur-hover-3d");
      }
    }

    renderer.render(scene, cam);
  }
  scRender();

  window.addEventListener("resize", () => {
    const w = canvas.offsetWidth,
      h = canvas.offsetHeight;
    renderer.setSize(w, h);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    setShowcaseView();
  });

  // Traverse and collect all yellow/gold/accent materials in showcase scene
  window.accentMaterials = window.accentMaterials || [];
  scene.traverse(node => {
    if (node.isMesh && node.material) {
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach(mat => {
        if (mat.color) {
          const hex = mat.color.getHex();
          if (hex === 0xffe000 || hex === 0xe2ba17 || hex === 0xe0bb18 || hex === 0x8f7d0c || hex === 0xffd24a || hex === 0xffd54d) {
            if (!window.accentMaterials.includes(mat)) {
              window.accentMaterials.push(mat);
            }
          }
        }
      });
    } else if (node.isLight) {
      const hex = node.color.getHex();
      if (hex === 0xffe000 || hex === 0xffd24a || hex === 0xffd54d) {
        if (!window.accentMaterials.includes(node)) {
          window.accentMaterials.push(node);
        }
      }
    }
  });
})();

/* ═══════════════════════════════════════
   SKILLS CARDS
═══════════════════════════════════════ */
const skills = [
  {
    icon: "https://cdn.simpleicons.org/html5/FFE000",
    name: "HTML5",
    pct: 90,
  },
  {
    icon: "https://cdn.simpleicons.org/css/FFE000",
    name: "CSS3",
    pct: 85,
  },
  {
    icon: "https://cdn.simpleicons.org/javascript/FFE000",
    name: "JavaScript",
    pct: 78,
  },
  {
    icon: "https://cdn.simpleicons.org/react/FFE000",
    name: "React JS",
    pct: 72,
  },
  {
    icon: "https://cdn.simpleicons.org/nextdotjs/FFE000",
    name: "Next JS",
    pct: 65,
  },
  {
    icon: "https://cdn.simpleicons.org/tailwindcss/FFE000",
    name: "Tailwind CSS",
    pct: 80,
  },
  {
    icon: "https://cdn.simpleicons.org/threedotjs/FFE000",
    name: "Three JS",
    pct: 60,
  },
  {
    icon: "https://cdn.simpleicons.org/bootstrap/FFE000",
    name: "Bootstrap",
    pct: 82,
  },
  {
    icon: "https://cdn.simpleicons.org/figma/FFE000",
    name: "Figma",
    pct: 75,
  },
  {
    icon: "https://cdn.simpleicons.org/python/FFE000",
    name: "Python",
    pct: 68,
  },
  {
    icon: "https://cdn.simpleicons.org/flask/FFE000",
    name: "Flask",
    pct: 70,
  },
  {
    icon: "https://cdn.simpleicons.org/mysql/FFE000",
    name: "MySQL",
    pct: 65,
  },
  {
    icon: "https://cdn.simpleicons.org/git/FFE000",
    name: "Git",
    pct: 74,
  },
  {
    icon: "https://cdn.simpleicons.org/github/FFE000",
    name: "GitHub",
    pct: 74,
  },
];
const grid = document.getElementById("skills-grid");
skills.forEach((s, i) => {
  grid.innerHTML += `
  <div class="sk-card reveal" style="transition-delay:${i * 0.06}s">
    <div class="sk-icon">
      <img src="${s.icon}" alt="${s.name} logo" loading="lazy" />
    </div>
    <div class="sk-name">${s.name}</div>
    <div class="sk-bar-wrap"><div class="sk-bar" data-w="${s.pct}"></div></div>
    <div class="sk-pct">${s.pct}%</div>
  </div>`;
});

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal,.reveal-l,.reveal-r")
  .forEach((el) => revObs.observe(el));

// Skill bars
const barObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".sk-bar").forEach((b) => {
          const w = b.dataset.w;
          b.style.width = "0";
          setTimeout(() => {
            b.style.width = w + "%";
          }, 200);
        });
        barObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 },
);
const sg2 = document.getElementById("skills-grid");
if (sg2) barObs.observe(sg2);

const nav = document.querySelector("nav");
let lastScrollY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    if (!nav) return;
    const currentY = window.scrollY;
    nav.classList.toggle("nav-scrolled", currentY > 18);
    if (window.innerWidth <= 768) {
      nav.classList.remove("nav-hidden");
      lastScrollY = currentY;
      return;
    }
    const scrollingDown = currentY > lastScrollY;
    nav.classList.toggle("nav-hidden", scrollingDown && currentY > 120);
    lastScrollY = currentY;
  },
  { passive: true },
);

/* ═══════════════════════════════════════
   SPINNING RINGS (CSS keyframe)
═══════════════════════════════════════ */
const style = document.createElement("style");
style.textContent = `@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`;
document.head.appendChild(style);

/* ══════════════════════════════════════════
   PORTFOLIO ADDONS & BENTO PROJECTS LOGIC
   ══════════════════════════════════════════ */
(function() {
  // 1. Typewriter Hero Effect (Disabled to prevent clutter with main hero typing loop)

  // 2. Animated Stats Counter
  const stats = document.querySelectorAll(".stat-num");
  const statsData = [];
  
  stats.forEach((el) => {
    const txt = el.textContent.trim();
    let val = parseFloat(txt);
    let suffix = txt.replace(/[0-9.]/g, "");
    let decimals = (txt.split(".")[1] || "").replace(/[^0-9]/g, "").length;
    
    statsData.push({
      el,
      target: val,
      suffix,
      decimals,
      current: 0
    });
    el.textContent = (0).toFixed(decimals) + suffix;
  });
  
  function animateStats() {
    statsData.forEach((stat) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.target / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        stat.current += increment;
        step++;
        if (step >= steps) {
          stat.current = stat.target;
          clearInterval(timer);
        }
        stat.el.textContent = stat.current.toFixed(stat.decimals) + stat.suffix;
      }, duration / steps);
    });
  }
  
  const statsBar = document.querySelector(".stats-bar");
  if (statsBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsBar);
  }

  // 3. Scroll-Spy Navigation
  const spySections = document.querySelectorAll("section, #hero");
  const navLinks = document.querySelectorAll(".nav-link, .nav-home");
  
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          const href = link.getAttribute("href");
          if (href === `#${id}` || (href === "#hero" && id === "hero")) {
            link.classList.add("active");
          }
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  
  spySections.forEach(sec => spyObserver.observe(sec));

  // 4. Floating Resume Button (CV FAB)
  const resumeFab = document.getElementById("resume-fab");
  window.addEventListener("scroll", () => {
    if (!resumeFab) return;
    if (window.scrollY > 500) {
      resumeFab.classList.add("show");
    } else {
      resumeFab.classList.remove("show");
    }
  }, { passive: true });

  // 5. Contact Form Submission
  window.handleFormSubmit = function() {
    const toast = document.getElementById("form-toast");
    const form = document.getElementById("portfolio-contact-form");
    if (toast) {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 5000);
    }
    if (form) {
      form.reset();
    }
  };

  // Add cursor enter/leave hover binds for form elements & bento elements
  document.querySelectorAll("input, textarea, .filter-btn, .bento-card, .t-tab, .mood-box").forEach((el) => {
    el.addEventListener("mouseenter", () => curRing.classList.add("big"));
    el.addEventListener("mouseleave", () => curRing.classList.remove("big"));
  });

  // 6. Projects Category Filter
  const filterBtns = document.querySelectorAll(".project-filters .filter-btn");
  const projectCards = document.querySelectorAll(".bento-grid .bento-card");
  
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hide");
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  // 7. Travel UI Tab Interactions
  const travelVisual = document.querySelector(".travel-visual");
  const travelTabs = document.querySelectorAll(".travel-tabs .t-tab");
  const previewLoc = document.querySelector(".travel-preview-card .p-loc");
  const previewPrice = document.querySelector(".travel-preview-card .p-price");
  
  const travelData = {
    "Kerala": { bgAccent: true, loc: "Exploring Kerala, IN", price: "$299/day" },
    "Pune": { bg: "linear-gradient(135deg, #00C6FF, #0072FF)", loc: "Visiting Pune City, IN", price: "$199/day" },
    "Paris": { bg: "linear-gradient(135deg, #f857a6, #ff5858)", loc: "Sightseeing Paris, FR", price: "$499/day" }
  };
  
  travelTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      travelTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const dest = tab.textContent.trim();
      const data = travelData[dest];
      if (data && travelVisual) {
        if (data.bgAccent) {
          const accent = getComputedStyle(document.documentElement).getPropertyValue('--y').trim() || '#ffe000';
          const warm = `color-mix(in srgb, ${accent} 60%, #ff5500)`;
          travelVisual.style.background = `linear-gradient(135deg, ${warm}, ${accent})`;
        } else {
          travelVisual.style.background = data.bg;
        }
        if (previewLoc) previewLoc.textContent = data.loc;
        if (previewPrice) previewPrice.textContent = data.price;
      }
    });
  });

  // Apply initial Kerala accent gradient
  (function() {
    const activeTab = document.querySelector(".t-tab.active[data-bg-accent]");
    if (activeTab && travelVisual) {
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--y').trim() || '#ffe000';
      const warm = `color-mix(in srgb, ${accent} 60%, #ff5500)`;
      travelVisual.style.background = `linear-gradient(135deg, ${warm}, ${accent})`;
    }
  })();

  // 8. DayTone Mood Grid Hover Interaction
  const moodLabel = document.querySelector(".mood-label");
  const moodBoxes = document.querySelectorAll(".mood-grid .mood-box");
  
  moodBoxes.forEach(box => {
    box.addEventListener("mouseenter", () => {
      const mood = box.dataset.mood;
      if (moodLabel) {
        moodLabel.textContent = `Logged Mood: ${mood}`;
        moodLabel.style.color = box.style.background;
      }
    });
    box.addEventListener("mouseleave", () => {
      if (moodLabel) {
        moodLabel.textContent = "Hover cells to log mood";
        moodLabel.style.color = "var(--dim)";
      }
    });
  });
})();

/* ═══════════════════════════════════════
   FEATURE SET 2 — MAXIMUM INTERACTIVITY
═══════════════════════════════════════ */
(function() {
  /* ── 1. SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = Math.min((scrolled / total) * 100, 100) + "%";
    }, { passive: true });
  }

  /* ── 2. TYPING HERO EFFECT ── */
  const typingEl = document.getElementById("typing-text");
  const phrases = [
    "pixel-perfect interfaces",
    "AI-powered tools",
    "3D web experiences",
    "interactive animations",
    "responsive UIs",
    "creative front-ends"
  ];
  let pIdx = 0, cIdx = 0, deleting = false;
  function typeLoop() {
    if (!typingEl) return;
    const current = phrases[pIdx];
    if (!deleting) {
      typingEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 60);
    } else {
      typingEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 30);
    }
  }
  setTimeout(typeLoop, 2800);

  /* ── 3. BENTO CARD 3D TILT EFFECT ── */
  document.querySelectorAll(".bento-card, .about-card, .gh-stat-card, .gh-repo-card, .edu-card, .c-card, .msg-card").forEach(card => {
    const MAX = 8;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = "transform 0.1s ease";
      card.style.transform = `perspective(800px) rotateY(${x * MAX}deg) rotateX(${-y * MAX}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    });
  });

  /* ── 4. GITHUB CONTRIBUTION HEATMAP ── */
  const heatmap = document.getElementById("gh-heatmap");
  if (heatmap) {
    const activity = [
      0,0,1,1,0,2,0, 1,1,0,0,2,1,0, 0,0,3,2,0,1,0,
      0,1,1,2,0,0,1, 2,0,0,1,1,0,2, 1,0,2,0,3,1,0,
      0,0,1,2,0,0,1, 3,2,1,0,0,2,1, 0,1,0,2,1,0,0,
      2,1,0,1,3,0,1, 0,2,1,0,2,0,1, 1,0,0,2,1,3,0,
      0,1,2,0,1,0,2, 0,0,3,2,1,0,0, 1,2,0,0,1,2,0,
      0,3,1,0,2,1,0, 1,0,2,0,0,3,1, 2,0,1,0,2,1,0,
      0,0,1,2,1,0,2, 0,1,0,2,1,3,0, 1,0,2,1,0,0,2,
      0,2,1,3,0,1,0, 2,1,0,1,0,2,1, 3,0,0,2,1,0,1
    ];
    window._ghHeatmapActivity = activity; // store for live theme refresh
    const tooltips = ["No activity","1-2 commits","3-4 commits","5-6 commits","7+ commits"];
    function buildHeatmapColors(accentHex) {
      return ["#1a1a1a",
        `color-mix(in srgb, ${accentHex} 15%, transparent)`,
        `color-mix(in srgb, ${accentHex} 40%, transparent)`,
        `color-mix(in srgb, ${accentHex} 75%, transparent)`,
        accentHex];
    }
    function renderHeatmap(accentHex) {
      heatmap.innerHTML = "";
      const colors = buildHeatmapColors(accentHex);
      activity.forEach((level) => {
        const cell = document.createElement("div");
        cell.className = "gh-cell";
        cell.style.background = colors[Math.min(level, 4)];
        cell.title = tooltips[Math.min(level, 4)];
        heatmap.appendChild(cell);
      });
    }
    const initialAccent = getComputedStyle(document.documentElement).getPropertyValue('--y').trim() || '#ffe000';
    renderHeatmap(initialAccent);
    window._renderHeatmap = renderHeatmap; // expose for live updates
  }

  /* ── 5. PROJECT MODALS ── */
  const projectData = {
    jarvis: {
      title: "J.A.R.V.I.S — AI Desktop Assistant",
      tags: ["Python","Electron","ChromaDB","Whisper STT","AI Agent","LLM"],
      visual: `<div style="text-align:left;font-family:monospace;font-size:13px;color:#00f7ff;line-height:2;padding:8px 0">
        <div>&gt; Initializing JARVIS core...</div>
        <div>&gt; Voice engine: Whisper STT [active]</div>
        <div>&gt; Long-term memory: ChromaDB vector DB</div>
        <div>&gt; LLM fallback chain: 9 providers</div>
        <div style="color:var(--y)">&gt; STATUS: ONLINE ✦ All systems nominal</div>
      </div>`,
      desc: "A cross-platform AI desktop voice assistant that combines the power of 9 LLM APIs with ChromaDB-powered vector memory for persistent context, offline wake-word activation, and full OS-level voice control.",
      features: [
        "Offline wake-word activation with local speech detection",
        "ChromaDB vector memory for long-term context recall",
        "Auto-fallback across 9 LLM APIs (GPT-4, Gemini, Claude, Mistral, etc.)",
        "Multi-source web search via Tavily, Brave, Serper, DuckDuckGo",
        "Full OS-level voice control — launch apps, control settings",
        "Text-to-Speech output with voice style selection",
        "Electron desktop shell for cross-platform deployment"
      ],
      github: "https://github.com/SA-Sanush/Jarvis-AI-Assistant"
    },
    portfolio: {
      title: "My Portfolio Website",
      tags: ["HTML5", "CSS3", "JavaScript", "Three.js"],
      visual: `<div style="text-align:center;padding:12px 0">
        <div style="font-size:13px;color:rgba(245,245,240,0.45);margin-bottom:12px">Interactive Chatbot Assistant</div>
        <div style="background:#111;border-radius:8px;padding:12px;font-size:12px;text-align:left;line-height:2">
          <div style="color:#27ae60">Visitor: "Hey, what are Sanush's skills?"</div>
          <div style="color:var(--y)">Chatbot: "Sanush is skilled in Front End Development, UI/UX Design, and AI &amp; Python..."</div>
          <div style="color:var(--y)">&gt; Live Status: Online and Ready ✦</div>
        </div>
      </div>`,
      desc: "A personal portfolio website built with HTML, CSS, JavaScript, and Three.js — features 3D visuals, smooth animations, and an AI-powered chatbot assistant.",
      features: [
        "Interactive 3D particle background using Three.js",
        "AI Chatbot assistant responding to visitor questions",
        "Standardized glassmorphic card design (Bento Grid)",
        "Vanilla JS mouse-tilt perspective effect on all cards",
        "Responsive timeline certifications with LinkedIn verification links"
      ],
      github: "https://github.com/SA-Sanush/My-portfolio"
    },
    daytone: {
      title: "DayTone — Mood Tracker & Analyser",
      tags: ["Flask","Python","Random Forest","VADER NLP","Scikit-learn"],
      visual: `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
        <span style="background:rgba(0,247,255,0.7);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">😊 Productive</span>
        <span style="background:rgba(111,207,151,0.7);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">😌 Calm</span>
        <span style="background:color-mix(in srgb, var(--y) 70%, transparent);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">⚡ Energetic</span>
        <span style="background:rgba(255,100,100,0.7);border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600">😰 Stressed</span>
        <span style="width:100%;text-align:center;color:var(--y);font-size:13px;margin-top:8px">Burnout risk: LOW — Keep it up! ✦</span>
      </div>`,
      desc: "An AI-driven wellness assistant using ensemble ML models (Random Forest, Decision Trees) and VADER sentiment analytics to track daily mental health logs, predict burnout levels, and generate actionable analytics reports.",
      features: [
        "Random Forest + Decision Tree ensemble for mood prediction",
        "VADER NLP for real-time journal sentiment analysis",
        "Burnout risk scoring with personalized recommendations",
        "Daily log tracking with trend visualization",
        "PDF/CSV report generation for mental health analytics",
        "Flask REST API backend with responsive web dashboard"
      ],
      github: "https://github.com/SA-Sanush/DayTone-Mood-Analyser"
    },
    tas: {
      title: "Talent Acquisition System",
      tags: ["Flask","spaCy NLP","SQLite","Python","PDF Parser"],
      visual: `<div style="text-align:center">
        <div style="font-size:13px;color:rgba(245,245,240,0.45);margin-bottom:12px">Resume Matching Engine</div>
        <div style="background:#111;border-radius:8px;padding:12px;font-size:12px;text-align:left;line-height:2">
          <div style="color:var(--y)">📄 resume_sanush.pdf → Parsing...</div>
          <div style="color:#27ae60">✓ Skills extracted: [Python, React, Flask, SQL]</div>
          <div style="color:#27ae60">✓ Experience: 2 years</div>
          <div style="color:var(--y)">⚡ JD Match Score: <b style="font-size:16px">92%</b></div>
        </div>
      </div>`,
      desc: "An intelligent recruitment matching dashboard that automatically parses PDF and Word resumes using spaCy NLP, extracts core tech skills, and ranks candidate compatibility scores against target job descriptions.",
      features: [
        "Automated PDF/DOCX resume parsing with PyMuPDF & docx2txt",
        "spaCy NLP for entity extraction — skills, experience, education",
        "Candidate-to-JD compatibility scoring algorithm",
        "SQLite database for candidate profile management",
        "Recruiter dashboard with ranked candidate list & filters",
        "Batch processing mode for high-volume recruitment workflows"
      ],
      github: "https://github.com/SA-Sanush/Talent-Acquisition-System"
    }
  };

  const modal = document.getElementById("project-modal");
  const modalClose = document.getElementById("modal-close");
  const curRingEl = document.getElementById("cur-ring");

  function openModal(key) {
    const data = projectData[key];
    if (!data || !modal) return;
    document.getElementById("modal-tags").innerHTML = data.tags.map(t => `<span class="p-tag">${t}</span>`).join("");
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-visual").innerHTML = data.visual;
    document.getElementById("modal-desc").textContent = data.desc;
    document.getElementById("modal-features").innerHTML = data.features.map(f => `<div class="modal-feature-item">${f}</div>`).join("");
    document.getElementById("modal-links").innerHTML = `
      <a href="${data.github}" target="_blank" class="modal-link-btn primary">⟨/⟩ GitHub Repo</a>
      <a href="${data.github}" target="_blank" class="modal-link-btn secondary">View Code ↗</a>
    `;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelectorAll(".modal-link-btn, .modal-close").forEach(el => {
      el.addEventListener("mouseenter", () => curRingEl && curRingEl.classList.add("big"));
      el.addEventListener("mouseleave", () => curRingEl && curRingEl.classList.remove("big"));
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".explore-btn").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = el.dataset.modal;
      if (key && projectData[key]) openModal(key);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ── 6. CONFETTI on form submit ── */
  const confettiCanvas = document.getElementById("confetti-canvas");
  let confettiActive = false;

  function launchConfetti() {
    if (!confettiCanvas || confettiActive) return;
    confettiActive = true;
    confettiCanvas.style.display = "block";
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const colors = [window.currentAccentColor || "#FFE000", `color-mix(in srgb, ${window.currentAccentColor || "#FFE000"} 60%, #ff5500)`,"#fff","#00f7ff","#6FCF97","#FF6B6B"];
    const particles = Array.from({length: 120}, () => ({
      x: Math.random() * confettiCanvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      angVel: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.5 ? "rect" : "circle"
    }));
    let frame = 0;
    function animConf() {
      if (frame > 200) {
        confettiCanvas.style.display = "none";
        confettiActive = false;
        return;
      }
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.angVel; p.vy += 0.05;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 200);
        if (p.shape === "rect") ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      frame++;
      requestAnimationFrame(animConf);
    }
    animConf();
  }

  const origSubmit = window.handleFormSubmit;
  window.handleFormSubmit = function() {
    if (origSubmit) origSubmit();
    launchConfetti();
  };

  /* ── 7. CURSOR hover for new elements ── */
  document.querySelectorAll(".explore-btn, .modal-link-btn, .gh-stat-card, .gh-repo-card, .cert-row, .cert-link-btn, .side-dock-link, .modal-close").forEach(el => {
    el.addEventListener("mouseenter", () => curRingEl && curRingEl.classList.add("big"));
    el.addEventListener("mouseleave", () => curRingEl && curRingEl.classList.remove("big"));
  });

  /* ── 8. CERT CARDS stagger reveal ── */
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }, i * 120);
        certObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".cert-row").forEach((row) => {
    row.style.opacity = "0";
    row.style.transform = "translateX(-24px)";
    row.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
    certObserver.observe(row);
  });

  /* ── 9. GITHUB cards stagger ── */
  const ghObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, i * 70);
        ghObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".gh-repo-card, .gh-stat-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(24px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, box-shadow 0.3s";
    ghObserver.observe(card);
  });

  /* ── 10. Parallax hero bg text on scroll ── */
  const heroBgText = document.querySelector(".hero-bg-text");
  if (heroBgText) {
    window.addEventListener("scroll", () => {
      heroBgText.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ── 11. Resume FAB pulse when visible ── */
  const fab = document.getElementById("resume-fab");
  if (fab) {
    setInterval(() => {
      if (!fab.classList.contains("show")) return;
      fab.style.boxShadow = `0 0 0 10px color-mix(in srgb, var(--y) 12%, transparent), 0 8px 32px rgba(0,0,0,0.5)`;
      setTimeout(() => { fab.style.boxShadow = ""; }, 700);
    }, 3500);
  }

  /* ── 12. Section entrance counter animation for GitHub stats ── */
  const ghStatNums = document.querySelectorAll(".gh-stat-num");
  const ghStatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9.]/g, "");
        const suffix = el.textContent.replace(/[0-9.]/g, "");
        if (!raw) return;
        const target = parseFloat(raw);
        let curr = 0;
        const step = target / 40;
        const iv = setInterval(() => {
          curr = Math.min(curr + step, target);
          el.textContent = (Number.isInteger(target) ? Math.floor(curr) : curr.toFixed(1)) + suffix;
          if (curr >= target) clearInterval(iv);
        }, 35);
        ghStatObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  ghStatNums.forEach(el => ghStatObserver.observe(el));

  /* ── 13. PWA Service Worker Registration ── */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js")
        .then(reg => console.log("Service Worker registered successfully:", reg.scope))
        .catch(err => console.warn("Service Worker registration failed:", err));
    });
  }

  /* ── 15. Command Palette Modal Logic ── */
  const cmdOverlay = document.getElementById("cmd-palette");
  const cmdSearch = document.getElementById("cmd-search");
  const cmdResults = document.getElementById("cmd-results");
  let cmdActiveIndex = 0;
  let currentFilteredCommands = [];

  const commandsList = [
    { key: "top", title: "Home — Scroll to Top", desc: "Navigate to the hero section", shortcut: "H", action: () => scrollToId("hero") },
    { key: "about", title: "About — Who I Am", desc: "Navigate to the about me section", shortcut: "A", action: () => scrollToId("about") },
    { key: "skills", title: "Skills — Technical Stack", desc: "Navigate to the skills grid", shortcut: "S", action: () => scrollToId("skills") },
    { key: "projects", title: "Projects — Featured Works", desc: "Navigate to my portfolio projects", shortcut: "P", action: () => scrollToId("projects") },
    { key: "github", title: "GitHub — Open Source Activity", desc: "Navigate to my contribution heatmap & repos", shortcut: "G", action: () => scrollToId("github-activity") },
    { key: "education", title: "Education — Timeline", desc: "Navigate to my academic history", shortcut: "E", action: () => scrollToId("education") },
    { key: "certifications", title: "Certificates — Credentials", desc: "Navigate to my verified licenses & certifications", shortcut: "C", action: () => scrollToId("certifications") },
    { key: "contact", title: "Contact — Let's Talk", desc: "Navigate to the contact form & socials", shortcut: "M", action: () => scrollToId("contact") },
    { key: "resume", title: "Resume — View PDF", desc: "Open resume in a new browser tab", shortcut: "R", action: () => window.open("./Sanush%20Resume.pdf", "_blank") },
    { key: "chatbot", title: "Chatbot — Open AI Assistant", desc: "Toggle the chat assistant overlay window", shortcut: "T", action: () => triggerChatbot() }
  ];

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeCmdPalette();
  }

  function triggerChatbot() {
    const chatTrigger = document.getElementById("chat-trigger");
    if (chatTrigger) chatTrigger.click();
    closeCmdPalette();
  }

  function openCmdPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    cmdSearch.value = "";
    cmdSearch.focus();
    renderCommands("");
    
    const curRing = document.getElementById("cur-ring");
    if (curRing) curRing.classList.add("big");
  }

  function closeCmdPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove("open");
    document.body.style.overflow = "";
    
    const curRing = document.getElementById("cur-ring");
    if (curRing) curRing.classList.remove("big");
  }

  function renderCommands(query) {
    if (!cmdResults) return;
    cmdResults.innerHTML = "";
    const filtered = commandsList.filter(cmd => 
      cmd.title.toLowerCase().includes(query.toLowerCase()) || 
      cmd.desc.toLowerCase().includes(query.toLowerCase())
    );
    currentFilteredCommands = filtered;
    cmdActiveIndex = Math.min(cmdActiveIndex, Math.max(0, filtered.length - 1));

    if (filtered.length === 0) {
      cmdResults.innerHTML = `<div style="padding:16px 20px;font-size:12px;color:var(--dim);text-align:center">No commands matching "${query}"</div>`;
      return;
    }

    filtered.forEach((cmd, idx) => {
      const div = document.createElement("div");
      div.className = `cmd-item ${idx === cmdActiveIndex ? "active" : ""}`;
      div.innerHTML = `
        <div class="cmd-item-left">
          <div class="cmd-item-title">${cmd.title}</div>
          <div class="cmd-item-desc">${cmd.desc}</div>
        </div>
        <span class="cmd-item-shortcut">${cmd.shortcut}</span>
      `;
      div.addEventListener("click", () => {
        cmd.action();
      });
      
      const curRing = document.getElementById("cur-ring");
      div.addEventListener("mouseenter", () => {
        cmdActiveIndex = idx;
        document.querySelectorAll(".cmd-item").forEach((el, i) => {
          el.classList.toggle("active", i === idx);
        });
        if (curRing) curRing.classList.add("big");
      });
      div.addEventListener("mouseleave", () => {
        if (curRing) curRing.classList.remove("big");
      });

      cmdResults.appendChild(div);
    });

    const activeItem = cmdResults.children[cmdActiveIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdOverlay.classList.contains("open")) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
    
    if (e.key === "Escape" && cmdOverlay && cmdOverlay.classList.contains("open")) {
      closeCmdPalette();
    }

    if (cmdOverlay && cmdOverlay.classList.contains("open")) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex + 1) % currentFilteredCommands.length;
        renderCommands(cmdSearch.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex - 1 + currentFilteredCommands.length) % currentFilteredCommands.length;
        renderCommands(cmdSearch.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = currentFilteredCommands[cmdActiveIndex];
        if (cmd) cmd.action();
      }
    }
  });

  if (cmdSearch) {
    cmdSearch.addEventListener("input", (e) => {
      cmdActiveIndex = 0;
      renderCommands(e.target.value);
    });
  }

  if (cmdOverlay) {
    cmdOverlay.addEventListener("click", (e) => {
      if (e.target === cmdOverlay) closeCmdPalette();
    });
  }

})();
