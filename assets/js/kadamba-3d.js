/**
 * Kadamba Group 3D Interactive & Animation Engine
 * Integrates Three.js 3D Viewers, 3D Card Tilt, Specular Lighting & Parallax
 */

(function () {
  'use strict';

  // ========================================================
  // 1. 3D CARD TILT & SPECULAR GLARE ENGINE
  // ========================================================
  function init3DTilt() {
    const cards = document.querySelectorAll('[data-tilt-3d], .card-3d');
    
    cards.forEach((card) => {
      // Create glare overlay if not present
      let glare = card.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        card.appendChild(glare);
      }

      let bounds;
      const maxTilt = parseFloat(card.getAttribute('data-tilt-max')) || 12;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', () => {
        updateBounds();
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) updateBounds();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
        const yPct = (mouseY / bounds.height - 0.5) * 2; // -1 to 1

        const rotateX = -yPct * maxTilt;
        const rotateY = xPct * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

        // Move dynamic specular light
        const glareX = ((mouseX / bounds.width) * 100).toFixed(1);
        const glareY = ((mouseY / bounds.height) * 100).toFixed(1);
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)';
      });
    });
  }

  // ========================================================
  // 2. 3D SCROLL REVEAL (IntersectionObserver)
  // ========================================================
  function init3DScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-3d');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('active');
            }, (idx % 4) * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // ========================================================
  // 3. HERO 3D INTERACTIVE THREE.JS CANVAS
  // ========================================================
  function initHero3DCanvas() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff1e9, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf36b35, 2.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xadf28a, 1.5);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    const warmPoint = new THREE.PointLight(0xcfa621, 2.0, 10);
    warmPoint.position.set(0, 0, 3);
    scene.add(warmPoint);

    // Group for all rotating elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central 3D Kadamba Emblem Coin
    const coinGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.22, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdf9a34,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x582400,
      emissiveIntensity: 0.15
    });
    const coin = new THREE.Mesh(coinGeo, goldMat);
    coin.rotation.x = Math.PI / 3;
    coin.rotation.z = Math.PI / 6;
    mainGroup.add(coin);

    // Coin Inner Rim / Ring
    const torusGeo = new THREE.TorusGeometry(1.4, 0.08, 16, 64);
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xa93800,
      metalness: 0.9,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(torusGeo, copperMat);
    rim.rotation.x = Math.PI / 2;
    coin.add(rim);

    // 2. Orbiting Organic Spice Pods & Seeds
    const podGroup = new THREE.Group();
    mainGroup.add(podGroup);

    const podColors = [0x337018, 0xcfa621, 0xa93800, 0x58413a, 0xadf28a];
    const pods = [];

    for (let i = 0; i < 16; i++) {
      const radius = 0.18 + Math.random() * 0.16;
      // Ellipsoid spice pod (Cardamom / Areca nut shape)
      const podGeo = new THREE.DodecahedronGeometry(radius, 1);
      const podMat = new THREE.MeshStandardMaterial({
        color: podColors[i % podColors.length],
        metalness: 0.3,
        roughness: 0.5,
        wireframe: false
      });
      const pod = new THREE.Mesh(podGeo, podMat);

      const angle = (i / 16) * Math.PI * 2;
      const dist = 2.4 + (i % 3) * 0.5;
      const yOff = (Math.sin(i * 1.5) * 1.2);

      pod.position.set(Math.cos(angle) * dist, yOff, Math.sin(angle) * dist);
      pod.scale.set(1, 1.6, 1); // Elongated cardamom shape
      podGroup.add(pod);

      pods.push({
        mesh: pod,
        angle: angle,
        speed: 0.008 + (i % 4) * 0.003,
        dist: dist,
        rotSpeed: (Math.random() - 0.5) * 0.04
      });
    }

    // 3. Floating 3D Golden Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 9;
      dustPos[i + 1] = (Math.random() - 0.5) * 7;
      dustPos[i + 2] = (Math.random() - 0.5) * 5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xffdf90,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Mouse Interaction
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (e.clientX - halfW) / halfW;
      targetY = (e.clientY - halfH) / halfH;
    }, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Smooth camera / group parallax
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      mainGroup.rotation.y += 0.006;
      mainGroup.rotation.x = currentY * 0.25;
      mainGroup.rotation.z = -currentX * 0.2;

      coin.rotation.y += 0.012;

      // Orbit pods
      pods.forEach((p) => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.dist;
        p.mesh.position.z = Math.sin(p.angle) * p.dist;
        p.mesh.rotation.x += p.rotSpeed;
        p.mesh.rotation.y += p.rotSpeed * 1.5;
      });

      // Drift dust particles
      dustParticles.rotation.y += 0.001;
      dustParticles.rotation.x += 0.0005;

      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
      width = container.clientWidth || 400;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  // ========================================================
  // 4. 360° INTERACTIVE 3D PRODUCT INSPECTOR MODAL
  // ========================================================
  const PRODUCT_MODELS_DATA = {
    'cardamom': {
      title: 'Kadamba Malenadu Green Cardamom (8mm Bold)',
      badge: 'GI Tagged • Sirsi Valley Harvest',
      price: '₹340',
      mrp: '₹420',
      discount: '19% OFF',
      weight: '250g Glass Herbarium Jar',
      desc: 'Hand-picked from certified rainforest shade-plantations in Sirsi and Siddapur. Retains intensely aromatic essential volatile oils in vacuum-sealed food-grade packaging.',
      type: 'jar',
      color: 0x2e6912
    },
    'coconutoil': {
      title: 'Kadamba Pure Wood-Pressed Coconut Oil (Mara Ganuga)',
      badge: 'Unrefined • 100% Cold Extracted',
      price: '₹285',
      mrp: '₹330',
      discount: '14% OFF',
      weight: '1 Litre Vintage Glass Bottle',
      desc: 'Slowly extracted using traditional Sirsi rosewood cold-press mills. Free from heat treatment, chemicals, and sulfur. High lauric acid content.',
      type: 'bottle',
      color: 0xfee3d2
    },
    'jaggery': {
      title: 'Sirsi Organic Malnad Liquid & Block Jaggery',
      badge: 'Pure Cane • Zero Added Chemicals',
      price: '₹145',
      mrp: '₹180',
      discount: '20% OFF',
      weight: '1 Kg Eco Kraft Box',
      desc: 'Cooked in traditional open cast-iron cauldrons using sugarcane cultivated in Kali and Bedti river valleys. Deep golden caramel notes rich in bio-available iron.',
      type: 'pouch',
      color: 0x934b10
    },
    'byadagi': {
      title: 'Kadamba Select Byadagi Red Chillies (Pungent & Color Rich)',
      badge: 'High Capsaicin • Natural Malnad Sun-Dried',
      price: '₹195',
      mrp: '₹240',
      discount: '18% OFF',
      weight: '500g Moisture-Lock Pack',
      desc: 'Famous wrinkle-textured dried chillies celebrated for deep crimson curry hue and moderate, aromatic warmth. Inspected at Sirsi APMC Quality Labs.',
      type: 'spicepack',
      color: 0xa91a00
    }
  };

  let modalScene, modalCamera, modalRenderer, activeProductMesh, modalAnimId;
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  let autoRotate = true;

  function ensureProductModalHtml() {
    if (document.getElementById('product-3d-modal')) return;

    const modalHtml = `
      <div id="product-3d-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/75 backdrop-blur-md">
        <div id="product-3d-modal-dialog" class="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/40 flex flex-col lg:flex-row max-h-[92vh]">
          <!-- Close Button -->
          <button id="close-3d-modal-btn" class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center text-on-surface shadow-sm">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>

          <!-- Left Column: 3D Canvas Viewport (7 cols) -->
          <div class="lg:w-3/5 bg-gradient-to-b from-surface-container to-surface-container-high relative flex flex-col items-center justify-center min-h-[350px] lg:min-h-[500px]">
            <!-- 3D Watermark & Controls overlay -->
            <div class="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm shadow-sm">
                <span class="material-symbols-outlined text-[16px] animate-spin" style="animation-duration: 6s;">3d_rotation</span>
                <span>Interactive 360° Studio</span>
              </span>
            </div>

            <!-- Hint: Drag to Rotate -->
            <div class="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <span class="text-on-surface-variant font-label-sm text-label-sm bg-surface-container-lowest/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
                🖱️ Drag to rotate • Scroll to zoom
              </span>
              <button id="toggle-autorotate-btn" class="pointer-events-auto px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-primary hover:text-on-primary transition-colors shadow-sm">
                Pause Rotate
              </button>
            </div>

            <!-- Canvas Element -->
            <canvas id="product-3d-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
          </div>

          <!-- Right Column: Product Narrative & Cart Action (5 cols) -->
          <div class="lg:w-2/5 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-3">
                <span class="material-symbols-outlined text-[14px]">eco</span>
                <span id="modal-product-badge">Malnad Certified</span>
              </div>
              <h2 id="modal-product-title" class="font-headline-md text-headline-md text-on-surface leading-tight">Product Title</h2>
              <p id="modal-product-weight" class="text-on-surface-variant font-label-md text-label-md mt-1 font-semibold">250g Jar</p>

              <!-- Price Box -->
              <div class="mt-4 p-3 rounded-xl bg-surface-container-low flex items-baseline gap-3">
                <span id="modal-product-price" class="font-price-hero text-price-hero text-primary">₹340</span>
                <span id="modal-product-mrp" class="font-price-strikethrough text-price-strikethrough text-on-surface-variant line-through">₹420</span>
                <span id="modal-product-discount" class="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">19% OFF</span>
              </div>

              <!-- Detailed Description -->
              <p id="modal-product-desc" class="mt-4 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Rich description goes here.
              </p>

              <!-- Authenticity Strip -->
              <div class="mt-6 pt-4 border-t border-outline-variant/40 grid grid-cols-2 gap-3 text-label-sm text-on-surface">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>100% Pure Sourced</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                  <span>Santhe 90-min Sirsi</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 pt-4 flex flex-col gap-2">
              <button id="modal-add-to-cart-btn" class="w-full py-3 rounded-full bg-primary text-on-primary hover:bg-on-primary-container font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[20px]">shopping_basket</span>
                <span>Add 1 to Basket</span>
              </button>
              <button id="modal-whatsapp-btn" class="w-full py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-secondary text-[18px]">chat</span>
                <span>Order via WhatsApp Express</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Wire Close Event
    const modalEl = document.getElementById('product-3d-modal');
    document.getElementById('close-3d-modal-btn').addEventListener('click', closeProduct3DModal);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeProduct3DModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeProduct3DModal();
    });

    // Wire AutoRotate Toggle
    const toggleBtn = document.getElementById('toggle-autorotate-btn');
    toggleBtn.addEventListener('click', () => {
      autoRotate = !autoRotate;
      toggleBtn.innerText = autoRotate ? 'Pause Rotate' : 'Resume Rotate';
    });

    // Wire Add To Cart inside modal
    document.getElementById('modal-add-to-cart-btn').addEventListener('click', () => {
      const btn = document.getElementById('modal-add-to-cart-btn');
      btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">check</span><span>Added to Basket!</span>`;
      btn.classList.replace('bg-primary', 'bg-secondary');
      setTimeout(() => {
        btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">shopping_basket</span><span>Add 1 to Basket</span>`;
        btn.classList.replace('bg-secondary', 'bg-primary');
      }, 1800);
    });
  }

  function setupModalThreeJS(productKey) {
    const canvas = document.getElementById('product-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Teardown previous scene
    if (modalAnimId) cancelAnimationFrame(modalAnimId);

    modalScene = new THREE.Scene();
    modalCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    modalCamera.position.set(0, 0.5, 4.2);

    if (!modalRenderer) {
      modalRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
    }
    modalRenderer.setSize(width, height);
    modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    modalScene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 7, 5);
    modalScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf36b35, 1.2);
    dirLight2.position.set(-5, -2, -3);
    modalScene.add(dirLight2);

    const rim = new THREE.DirectionalLight(0xffdf90, 1.0);
    rim.position.set(0, 5, -5);
    modalScene.add(rim);

    // Build Specific 3D Model
    activeProductMesh = buildProceduralProductMesh(productKey);
    modalScene.add(activeProductMesh);

    // Drag Rotate Handlers
    canvas.onmousedown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    window.onmousemove = (e) => {
      if (!isDragging || !activeProductMesh) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      activeProductMesh.rotation.y += deltaX * 0.01;
      activeProductMesh.rotation.x += deltaY * 0.01;

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    window.onmouseup = () => {
      isDragging = false;
    };

    // Zoom on wheel
    canvas.onwheel = (e) => {
      e.preventDefault();
      modalCamera.position.z += e.deltaY * 0.003;
      modalCamera.position.z = Math.max(2.5, Math.min(6.5, modalCamera.position.z));
    };

    // Render loop
    function animateModal() {
      modalAnimId = requestAnimationFrame(animateModal);
      if (autoRotate && !isDragging && activeProductMesh) {
        activeProductMesh.rotation.y += 0.01;
      }
      modalRenderer.render(modalScene, modalCamera);
    }
    animateModal();
  }

  function buildProceduralProductMesh(key) {
    const group = new THREE.Group();
    const data = PRODUCT_MODELS_DATA[key] || PRODUCT_MODELS_DATA['cardamom'];

    if (data.type === 'jar') {
      // 1. Glass Jar Body
      const jarGeo = new THREE.CylinderGeometry(0.8, 0.85, 1.8, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        reflectivity: 0.8
      });
      const jar = new THREE.Mesh(jarGeo, glassMat);
      group.add(jar);

      // Wooden Cork Lid
      const corkGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.4, 32);
      const corkMat = new THREE.MeshStandardMaterial({
        color: 0xa96e38,
        roughness: 0.8
      });
      const cork = new THREE.Mesh(corkGeo, corkMat);
      cork.position.y = 1.05;
      group.add(cork);

      // Label Band
      const labelGeo = new THREE.CylinderGeometry(0.81, 0.81, 0.8, 32);
      const labelMat = new THREE.MeshStandardMaterial({
        color: 0xfff8f5,
        roughness: 0.5
      });
      const label = new THREE.Mesh(labelGeo, labelMat);
      group.add(label);

      // Inside Cardamom Pods
      for (let i = 0; i < 22; i++) {
        const podGeo = new THREE.DodecahedronGeometry(0.12, 1);
        const podMat = new THREE.MeshStandardMaterial({ color: 0x3e7b1a, roughness: 0.6 });
        const pod = new THREE.Mesh(podGeo, podMat);
        pod.scale.set(1, 1.6, 1);
        pod.position.set(
          (Math.random() - 0.5) * 1.0,
          (Math.random() - 0.5) * 1.2 - 0.2,
          (Math.random() - 0.5) * 1.0
        );
        group.add(pod);
      }
    } else if (data.type === 'bottle') {
      // Coconut Oil Bottle
      const bodyGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.0, 32);
      const amberMat = new THREE.MeshPhysicalMaterial({
        color: 0xd9a441,
        transmission: 0.85,
        transparent: true,
        roughness: 0.15
      });
      const body = new THREE.Mesh(bodyGeo, amberMat);
      group.add(body);

      // Bottle Neck
      const neckGeo = new THREE.CylinderGeometry(0.3, 0.6, 0.6, 32);
      const neck = new THREE.Mesh(neckGeo, amberMat);
      neck.position.y = 1.25;
      group.add(neck);

      // Gold Metallic Cap
      const capGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.3, 32);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xdf9a34,
        metalness: 0.9,
        roughness: 0.2
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.65;
      group.add(cap);
    } else {
      // Jaggery or Spice Kraft Pouch
      const pouchGeo = new THREE.BoxGeometry(1.3, 1.9, 0.7);
      const kraftMat = new THREE.MeshStandardMaterial({
        color: data.color || 0xa93800,
        roughness: 0.7,
        metalness: 0.1
      });
      const pouch = new THREE.Mesh(pouchGeo, kraftMat);
      group.add(pouch);

      // Gold Seal Stamp
      const stampGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 32);
      const stampMat = new THREE.MeshStandardMaterial({
        color: 0xffdf90,
        metalness: 0.8,
        roughness: 0.3
      });
      const stamp = new THREE.Mesh(stampGeo, stampMat);
      stamp.rotation.x = Math.PI / 2;
      stamp.position.z = 0.38;
      stamp.position.y = 0.2;
      group.add(stamp);
    }

    group.position.y = -0.1;
    return group;
  }

  function openProduct3DModal(key) {
    ensureProductModalHtml();
    const data = PRODUCT_MODELS_DATA[key] || PRODUCT_MODELS_DATA['cardamom'];

    document.getElementById('modal-product-title').innerText = data.title;
    document.getElementById('modal-product-badge').innerText = data.badge;
    document.getElementById('modal-product-price').innerText = data.price;
    document.getElementById('modal-product-mrp').innerText = data.mrp;
    document.getElementById('modal-product-discount').innerText = data.discount;
    document.getElementById('modal-product-weight').innerText = data.weight;
    document.getElementById('modal-product-desc').innerText = data.desc;

    const modal = document.getElementById('product-3d-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Delay slightly for modal layout to calculate dimensions
    setTimeout(() => {
      setupModalThreeJS(key);
    }, 50);
  }

  function closeProduct3DModal() {
    const modal = document.getElementById('product-3d-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalAnimId) cancelAnimationFrame(modalAnimId);
    }
  }

  // Export to window
  window.openProduct3DModal = openProduct3DModal;
  window.closeProduct3DModal = closeProduct3DModal;

  // ========================================================
  // 5. FINANCIAL SERVICES 3D WEALTH VAULT & COIN TOWER
  // ========================================================
  function init3DDepositVault() {
    const canvas = document.getElementById('fd-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.8, 3.2, 3.8);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambient = new THREE.AmbientLight(0xfff1e9, 1.2);
    scene.add(ambient);

    const goldKey = new THREE.DirectionalLight(0xffdf90, 2.2);
    goldKey.position.set(4, 6, 4);
    scene.add(goldKey);

    const greenRim = new THREE.DirectionalLight(0xadf28a, 1.4);
    greenRim.position.set(-4, 2, -3);
    scene.add(greenRim);

    // Stone Pedestal
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x3d2d22,
      roughness: 0.6,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(baseGeo, baseMat);
    pedestal.position.y = -0.15;
    scene.add(pedestal);

    // Coin Stacks Group
    const coinsGroup = new THREE.Group();
    scene.add(coinsGroup);

    const coinGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdf9a34,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x582400,
      emissiveIntensity: 0.1
    });

    let currentCoinCount = 10;
    const coins = [];

    function updateCoinStack(count) {
      // Clear old coins
      while (coinsGroup.children.length > 0) {
        coinsGroup.remove(coinsGroup.children[0]);
      }
      coins.length = 0;

      const n = Math.min(24, Math.max(3, Math.round(count)));
      for (let i = 0; i < n; i++) {
        const coin = new THREE.Mesh(coinGeo, goldMat);
        coin.position.y = i * 0.085;
        // slight jitter for organic stacking feel
        coin.rotation.y = i * 0.35;
        coinsGroup.add(coin);
        coins.push(coin);
      }
    }

    updateCoinStack(12);

    // Hook into slider if present
    const slider = document.getElementById('deposit-amount-range');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        // Map 10,000 - 10,00,000 to 4 - 24 coins
        const coinCount = Math.round(4 + ((val - 10000) / 990000) * 20);
        updateCoinStack(coinCount);
      });
    }

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      coinsGroup.rotation.y += 0.008;
      pedestal.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      width = container.clientWidth || 320;
      height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  // ========================================================
  // INITIALIZATION ON DOM READY
  // ========================================================
  function initAll() {
    init3DTilt();
    init3DScrollReveal();
    initHero3DCanvas();
    init3DDepositVault();

    // Auto-bind any [data-open-3d] buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-3d]');
      if (btn) {
        e.preventDefault();
        const productKey = btn.getAttribute('data-open-3d');
        openProduct3DModal(productKey);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
