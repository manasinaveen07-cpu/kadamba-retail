const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

const threeScripts = `
  <!-- Three.js & Kadamba 3D Interactive Engine -->
  <link rel="stylesheet" href="assets/css/kadamba-3d.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="assets/js/kadamba-3d.js" defer></script>
`;

function injectThreeHeaders(html) {
  if (!html.includes('assets/css/kadamba-3d.css')) {
    html = html.replace('</head>', `${threeScripts}\n</head>`);
  }
  return html;
}

// 1. ENHANCE INDEX.HTML
function enhanceHome() {
  const p = path.join(projectRoot, 'index.html');
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');
  html = injectThreeHeaders(html);

  // Add 3D Canvas in Hero visual column
  const heroVisualTarget = `<div class="relative w-full h-[360px] lg:h-full max-h-[500px] rounded-xl overflow-hidden shadow-xl">`;
  const heroVisualReplacement = `<div class="relative w-full h-[360px] lg:h-full max-h-[500px] rounded-xl overflow-hidden shadow-2xl card-3d" data-tilt-3d data-tilt-max="8">
        <!-- Interactive 3D Three.js Heritage Layer -->
        <canvas id="hero-3d-canvas" class="absolute inset-0 w-full h-full z-20 pointer-events-auto cursor-grab active:cursor-grabbing"></canvas>
        <!-- 3D Trigger Badge -->
        <div class="absolute top-3 right-3 z-30 pointer-events-auto">
          <button data-open-3d="cardamom" class="btn-3d-view px-3 py-1.5 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
            <span class="material-symbols-outlined text-[16px] animate-spin" style="animation-duration: 5s;">3d_rotation</span>
            <span>View Spices in 3D</span>
          </button>
        </div>`;

  if (html.includes(heroVisualTarget) && !html.includes('id="hero-3d-canvas"')) {
    html = html.replace(heroVisualTarget, heroVisualReplacement);
  }

  // Add data-tilt-3d to 4 Pillar cards
  html = html.replace(
    /class="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"/g,
    'class="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 card-3d" data-tilt-3d'
  );

  // Add data-tilt-3d to Metric badges
  html = html.replace(
    /class="flex flex-col bg-surface-container-lowest\/80 backdrop-blur-sm p-3 rounded-xl shadow-sm"/g,
    'class="flex flex-col bg-surface-container-lowest/80 backdrop-blur-sm p-3 rounded-xl shadow-sm card-3d" data-tilt-3d data-tilt-max="15"'
  );

  // Add 3D button to Malenadu signature spices section if exists
  html = html.replace(
    /<h3 class="font-headline-sm text-headline-sm text-on-surface">Malenadu Whole Cardamom<\/h3>/g,
    `<div class="flex items-center justify-between">
      <h3 class="font-headline-sm text-headline-sm text-on-surface">Malenadu Whole Cardamom</h3>
      <button data-open-3d="cardamom" class="btn-3d-view text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">3d_rotation</span> 3D
      </button>
    </div>`
  );

  fs.writeFileSync(p, html, 'utf8');
  console.log('Enhanced index.html with 3D Hero and Tilt effects.');
}

// 2. ENHANCE SUPERMART.HTML
function enhanceSupermart() {
  const p = path.join(projectRoot, 'supermart.html');
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');
  html = injectThreeHeaders(html);

  // Add data-tilt-3d to all product cards in grid
  html = html.replace(
    /class="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"/g,
    'class="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden card-3d" data-tilt-3d'
  );

  // Inject 3D Inspect buttons on featured items
  html = html.replace(
    `<h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Farm Fresh Organic Jaggery</h3>`,
    `<div class="flex items-center justify-between gap-1">
      <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Farm Fresh Organic Jaggery</h3>
      <button data-open-3d="jaggery" class="btn-3d-view text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shrink-0" title="Inspect 360° 3D Model">
        <span class="material-symbols-outlined text-[13px]">3d_rotation</span> 3D
      </button>
    </div>`
  );

  html = html.replace(
    `<h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Malenadu Byadgi Chillies</h3>`,
    `<div class="flex items-center justify-between gap-1">
      <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Malenadu Byadgi Chillies</h3>
      <button data-open-3d="byadagi" class="btn-3d-view text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shrink-0" title="Inspect 360° 3D Model">
        <span class="material-symbols-outlined text-[13px]">3d_rotation</span> 3D
      </button>
    </div>`
  );

  html = html.replace(
    `<h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Saras Pure Cow Ghee</h3>`,
    `<div class="flex items-center justify-between gap-1">
      <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Saras Pure Cow Ghee</h3>
      <button data-open-3d="coconutoil" class="btn-3d-view text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shrink-0" title="Inspect 360° 3D Model">
        <span class="material-symbols-outlined text-[13px]">3d_rotation</span> 3D
      </button>
    </div>`
  );

  // Add 3D banner at the top of supermarket catalog
  const catalogHeaderTarget = `<div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">`;
  const catalogHeader3D = `
    <!-- 3D Interactive Feature Banner -->
    <div class="mb-space-lg p-space-md bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high rounded-2xl flex flex-wrap items-center justify-between gap-space-md border border-outline-variant/30 shadow-sm">
      <div class="flex items-center gap-space-sm">
        <div class="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md animate-float-gentle">
          <span class="material-symbols-outlined text-[26px]">3d_rotation</span>
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Kadamba 3D Interactive Virtual Shelf</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Click any '3D' badge on items below to rotate, inspect packaging, and verify Sirsi farm tags in 360°.</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button data-open-3d="cardamom" class="btn-3d-view px-3 py-1.5 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1 shadow-sm">
          <span>Cardamom 3D</span>
        </button>
        <button data-open-3d="coconutoil" class="btn-3d-view px-3 py-1.5 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1 shadow-sm">
          <span>Cold-Pressed Oil 3D</span>
        </button>
      </div>
    </div>
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">`;

  if (html.includes(catalogHeaderTarget) && !html.includes('Kadamba 3D Interactive Virtual Shelf')) {
    html = html.replace(catalogHeaderTarget, catalogHeader3D);
  }

  fs.writeFileSync(p, html, 'utf8');
  console.log('Enhanced supermart.html with 3D product cards and virtual shelf.');
}

// 3. ENHANCE FINANCIAL SERVICES (3D COIN STACK VAULT)
function enhanceFinancialServices() {
  const p = path.join(projectRoot, 'financial-services.html');
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');
  html = injectThreeHeaders(html);

  // Insert 3D Vault Canvas above or inside calculation breakdown
  const outputBoxTarget = `<div class="lg:col-span-5 p-space-lg lg:p-space-xl rounded-xl bg-surface-container-lowest shadow-xl flex flex-col justify-between gap-space-lg relative overflow-hidden">`;
  const outputBox3D = `<div class="lg:col-span-5 p-space-lg lg:p-space-xl rounded-xl bg-surface-container-lowest shadow-xl flex flex-col justify-between gap-space-md relative overflow-hidden card-3d" data-tilt-3d data-tilt-max="6">
      <!-- 3D Wealth Growth Vault Visualization -->
      <div class="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-b from-surface-container-high/60 to-surface-container/80 flex items-center justify-center border border-outline-variant/30 shadow-inner">
        <div class="absolute top-2.5 left-3 z-10 flex items-center gap-1.5 bg-surface-container-lowest/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
          <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span class="font-label-sm text-label-sm text-on-surface uppercase tracking-wider font-bold">3D Dividend Vault</span>
        </div>
        <canvas id="fd-3d-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
        <div class="absolute bottom-2 right-3 z-10 text-[10px] text-on-surface-variant font-mono bg-surface-container-lowest/80 px-2 py-0.5 rounded">
          Stacks dynamically with Principal
        </div>
      </div>`;

  if (html.includes(outputBoxTarget) && !html.includes('id="fd-3d-canvas"')) {
    html = html.replace(outputBoxTarget, outputBox3D);
  }

  // Add data-tilt-3d to Loan & Scheme cards
  html = html.replace(
    /class="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-lg"/g,
    'class="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-space-lg card-3d" data-tilt-3d'
  );

  fs.writeFileSync(p, html, 'utf8');
  console.log('Enhanced financial-services.html with 3D Wealth Vault canvas.');
}

// 4. ENHANCE REMAINING PAGES (Tilt & Reveal)
['suppliers.html', 'stores.html', 'about-us.html', 'privacy-policy.html'].forEach((f) => {
  const p = path.join(projectRoot, f);
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');
  html = injectThreeHeaders(html);

  // Add 3D card tilt to major containers
  html = html.replace(
    /class="([^"]*\b(?:p-space-[a-z]+|brand-card|gallery-card)[^"]*\bbg-surface-container-lowest\b[^"]*)"/g,
    (match, cls) => {
      if (!cls.includes('card-3d')) {
        return `class="${cls} card-3d" data-tilt-3d`;
      }
      return match;
    }
  );

  fs.writeFileSync(p, html, 'utf8');
  console.log(`Enhanced ${f} with 3D tilts.`);
});

enhanceHome();
enhanceSupermart();
enhanceFinancialServices();
console.log('All 3D enhancements successfully applied!');
