import * as THREE from "three";

(function initShowcaseScene() {
  const canvas = document.getElementById("showcase-canvas");
  if (!canvas) return;

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
