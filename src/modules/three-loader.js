import * as THREE from "three";

(function initLoader() {
  const lc = document.getElementById("loader-canvas");
  const bar = document.getElementById("lbar");
  const pct = document.getElementById("lpct");
  let p = 0;
  let lAnim = 0;
  let renderer = null;
  let isLoaded = document.readyState === "complete";
  if (!isLoaded) {
    window.addEventListener("load", () => {
      isLoaded = true;
    });
  }

  const iv = setInterval(() => {
    if (isLoaded) {
      p += 15;
    } else {
      p += p < 85 ? Math.random() * 3 + 1 : Math.random() * 0.5;
    }
    
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      finish();
    }
    if (bar) bar.style.width = p + "%";
    if (pct) pct.textContent = Math.floor(p) + "%";
  }, 60);

  function finish() {
    setTimeout(() => {
      const loaderEl = document.getElementById("loader");
      const appEl = document.getElementById("app");
      if (loaderEl) loaderEl.classList.add("done");
      if (appEl) appEl.classList.add("show");
      if (lAnim) cancelAnimationFrame(lAnim);
      if (renderer) renderer.dispose();
    }, 600);
  }

  if (!lc) return;

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
