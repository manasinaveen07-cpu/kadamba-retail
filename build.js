const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const stitchDir = path.join(projectRoot, 'stitch_kadamba_group_retail_redesign');

const routeMap = {
  'home': 'index.html',
  'supermart': 'supermart.html',
  'financial-services': 'financial-services.html',
  'suppliers': 'suppliers.html',
  'stores': 'stores.html',
  'about-us': 'about-us.html',
  'privacy-policy': 'privacy-policy.html'
};

const screens = [
  { folder: 'home_kadamba_supermarket_retail', target: 'index.html', currentPath: 'home', title: 'Kadamba Group | Retail Enterprise & Supermarket Sirsi' },
  { folder: 'supermart_11_000_products', target: 'supermart.html', currentPath: 'supermart', title: 'Kadamba Supermart | 11,000+ Groceries & Spices' },
  { folder: 'financial_services_kadamba_souharda', target: 'financial-services.html', currentPath: 'financial-services', title: 'Kadamba Souharda | Cooperative Banking & FD Schemes' },
  { folder: 'suppliers_fmcg_brand_partners', target: 'suppliers.html', currentPath: 'suppliers', title: 'Kadamba FMCG | B2B Brand Partners & Suppliers' },
  { folder: 'stores_neighborhood_locations', target: 'stores.html', currentPath: 'stores', title: 'Store Locations & Santhe Hubs | Kadamba Group' },
  { folder: 'about_us_heritage_cooperatives', target: 'about-us.html', currentPath: 'about-us', title: 'About Us | Heritage & Cooperative Leadership' }
];

const navScript = `
<!-- Kadamba Universal Routing Script -->
<script>
  (function() {
    const routeMap = {
      'home': 'index.html',
      'supermart': 'supermart.html',
      'financial-services': 'financial-services.html',
      'suppliers': 'suppliers.html',
      'stores': 'stores.html',
      'about-us': 'about-us.html',
      'privacy-policy': 'privacy-policy.html'
    };

    document.addEventListener('click', function(e) {
      const link = e.target.closest('[data-path]');
      if (!link) return;
      const pathAttr = link.getAttribute('data-path');
      if (pathAttr && routeMap[pathAttr]) {
        e.preventDefault();
        window.location.href = routeMap[pathAttr];
      }
    });
  })();
</script>
`;

function transformHtml(html, currentPath, pageTitle) {
  // Inject title if not present
  if (!html.includes('<title>')) {
    html = html.replace('<head>', `<head><title>${pageTitle}</title>`);
  }

  // Update href="#" on all data-path elements
  for (const [key, dest] of Object.entries(routeMap)) {
    const regex1 = new RegExp(`href="#"\\s+data-path="${key}"`, 'g');
    const regex2 = new RegExp(`data-path="${key}"\\s+href="#"`, 'g');
    html = html.replace(regex1, `href="${dest}" data-path="${key}"`);
    html = html.replace(regex2, `data-path="${key}" href="${dest}"`);
  }

  // Insert nav script before </body>
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${navScript}\n</body>`);
  } else {
    html += navScript;
  }

  return html;
}

screens.forEach(s => {
  const srcPath = path.join(stitchDir, s.folder, 'code.html');
  if (fs.existsSync(srcPath)) {
    const rawHtml = fs.readFileSync(srcPath, 'utf8');
    const processed = transformHtml(rawHtml, s.currentPath, s.title);
    const destPath = path.join(projectRoot, s.target);
    fs.writeFileSync(destPath, processed, 'utf8');
    console.log(`Generated: ${s.target} from ${s.folder}/code.html`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});

// Also create privacy-policy.html based on about-us template
const aboutUsPath = path.join(projectRoot, 'about-us.html');
if (fs.existsSync(aboutUsPath)) {
  let aboutHtml = fs.readFileSync(aboutUsPath, 'utf8');

  // Replace Title
  aboutHtml = aboutHtml.replace(/<title>[\s\S]*?<\/title>/, '<title>Privacy Policy & Trust Charter | Kadamba Group</title>');

  // Update header nav active item to privacy-policy
  aboutHtml = aboutHtml.replace(
    /aria-current="page"\s+class="[^"]*"\s+data-path="about-us"\s+href="about-us\.html"/g,
    'class="px-space-md py-1.5 text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md shrink-0" data-path="about-us" href="about-us.html"'
  );
  aboutHtml = aboutHtml.replace(
    /data-path="privacy-policy"\s+href="privacy-policy\.html"/g,
    'aria-current="page" class="px-space-md py-1.5 transition-colors shrink-0 bg-surface-container-high text-primary font-bold rounded-lg" data-path="privacy-policy" href="privacy-policy.html"'
  );

  // Extract <main> and replace with rich Privacy Policy content
  const privacyMain = `
<main class="w-full pt-44 bg-surface">
  <div class="max-w-[1360px] mx-auto px-margin-desktop py-space-xl">
    <!-- Header Banner -->
    <div class="bg-surface-container-high rounded-2xl p-space-xl mb-space-xl shadow-sm border border-outline-variant/30">
      <div class="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm uppercase tracking-wider mb-space-sm">
        <span class="material-symbols-outlined text-[16px]">verified_user</span>
        <span>Cooperative Transparency & Member Rights</span>
      </div>
      <h1 class="font-display-lg text-display-lg text-on-surface tracking-tight">Privacy Policy & Trust Charter</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant mt-space-sm max-w-3xl">
        Kadamba Group Retail Enterprise & Kadamba Souharda Sahakari Niyamita are committed to protecting the privacy, financial confidentiality, and personal information of our cooperative members, retail customers, and farmer partners.
      </p>
      <div class="mt-space-md flex flex-wrap items-center gap-space-lg text-label-sm font-label-sm text-on-surface-variant">
        <span><strong>Effective Date:</strong> January 1, 2025</span>
        <span>•</span>
        <span><strong>Reg:</strong> KBL/RCS/044/1998</span>
        <span>•</span>
        <span><strong>Jurisdiction:</strong> Sirsi, Uttara Kannada, Karnataka</span>
      </div>
    </div>

    <!-- Privacy Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
      <!-- Table of Contents / Quick Jump (4 cols) -->
      <div class="lg:col-span-4 flex flex-col gap-space-md">
        <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 sticky top-48">
          <h3 class="font-headline-sm text-headline-sm text-on-surface mb-space-md">Charter Sections</h3>
          <ul class="flex flex-col gap-space-sm font-body-sm text-body-sm">
            <li><a href="#data-collection" class="text-primary hover:underline font-semibold flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">database</span> 1. Information We Collect</a></li>
            <li><a href="#retail-usage" class="text-on-surface-variant hover:text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">shopping_cart</span> 2. Supermart & WhatsApp Orders</a></li>
            <li><a href="#coop-banking" class="text-on-surface-variant hover:text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">account_balance</span> 3. Souharda Financial Secrecy</a></li>
            <li><a href="#farmer-rights" class="text-on-surface-variant hover:text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">agriculture</span> 4. Farmer & Member Ledger Protection</a></li>
            <li><a href="#security-measures" class="text-on-surface-variant hover:text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">lock</span> 5. Security & Encryption</a></li>
            <li><a href="#grievance" class="text-on-surface-variant hover:text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">contact_support</span> 6. Grievance Officer & Contact</a></li>
          </ul>
        </div>
      </div>

      <!-- Main Clauses (8 cols) -->
      <div class="lg:col-span-8 flex flex-col gap-space-xl">
        <!-- Section 1 -->
        <section id="data-collection" class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30">
          <div class="flex items-center gap-space-sm mb-space-md">
            <div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">database</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface">1. Information We Collect</h2>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
            Kadamba collects only information necessary to deliver quality retail products, verify cooperative membership, fulfill WhatsApp Santhe Express orders, and administer financial deposit/credit schemes.
          </p>
          <ul class="list-disc pl-space-lg font-body-sm text-body-sm text-on-surface-variant space-y-2">
            <li><strong>Customer Contact Details:</strong> Name, delivery address in Sirsi/Malnad region, phone number for delivery confirmation.</li>
            <li><strong>Cooperative Membership Records:</strong> Souharda membership ID, share certificates, and statutory KYC documents as mandated by Karnataka Cooperative Societies Act.</li>
            <li><strong>Transactional Records:</strong> In-store POS purchase records, item lists submitted via WhatsApp Santhe Express, and deposit receipt histories.</li>
          </ul>
        </section>

        <!-- Section 2 -->
        <section id="retail-usage" class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30">
          <div class="flex items-center gap-space-sm mb-space-md">
            <div class="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">shopping_cart</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface">2. Supermart & WhatsApp Express Orders</h2>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
            When ordering through our WhatsApp helpline (08384 - 222333) or in-store counters, your order list and delivery location are used exclusively to pick, pack, and dispatch your order. We do not sell or share customer phone numbers with third-party telemarketers or advertisers.
          </p>
        </section>

        <!-- Section 3 -->
        <section id="coop-banking" class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30">
          <div class="flex items-center gap-space-sm mb-space-md">
            <div class="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface">3. Souharda Financial Secrecy</h2>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
            Kadamba Souharda Sahakari operates strictly under the fiduciary principles of cooperative banking. All member fixed deposits, recurring deposits, dividends, and micro-loan details are confidential and accessible solely to authorized branch officers and statutory cooperative auditors.
          </p>
        </section>

        <!-- Section 4 -->
        <section id="farmer-rights" class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30">
          <div class="flex items-center gap-space-sm mb-space-md">
            <div class="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">agriculture</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface">4. Farmer & Producer Protection</h2>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Direct farm procurement pricing, weighment sheets, and APMC yard transactions are documented transparently and provided to the respective farmer-member. We guarantee fair pricing with zero predatory data sharing.
          </p>
        </section>

        <!-- Section 5 -->
        <section id="grievance" class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30">
          <div class="flex items-center gap-space-sm mb-space-md">
            <div class="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">contact_support</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface">5. Grievance Officer & Contact</h2>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
            For questions regarding privacy, record verification, or data correction, please contact our Compliance Officer:
          </p>
          <div class="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 font-body-sm text-body-sm">
            <span class="font-bold text-on-surface">Compliance Officer, Kadamba Group</span>
            <span>Flagship Complex, College Road, Kasturba Nagar, Sirsi – 581401, Karnataka</span>
            <span>Phone: 08384 - 222333 / 222334</span>
            <span>Email: <a href="mailto:privacy@kadambagroup.coop" class="text-primary hover:underline">privacy@kadambagroup.coop</a></span>
          </div>
        </section>
      </div>
    </div>
  </div>
</main>
`;

  // Replace <main>...</main>
  aboutHtml = aboutHtml.replace(/<main[\s\S]*?<\/main>/, privacyMain);
  const privacyDest = path.join(projectRoot, 'privacy-policy.html');
  fs.writeFileSync(privacyDest, aboutHtml, 'utf8');
  console.log(`Generated: privacy-policy.html`);
}

require('./enhance-3d.js');
