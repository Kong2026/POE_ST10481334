/* scripts.js
  - injects services & gallery
  - search & sort
  - modal (service details)
  - lightbox (gallery)
  - leaflet map
  - forms: validation + AJAX (Formspree placeholder) + mailto fallback
  - accessible and small vanilla JS
*/

/* ---------- Data (can be moved to separate JSON file) ---------- */
const SERVICES = [
  {
    id: 'stock-bricks',
    title: 'Stock Bricks',
    category: 'manufacturing',
    short: 'Traditional face bricks for walls and domestic housing.',
    description: 'Available in multiple colours and strengths. Manufactured to resist local climatic variations and designed for ease of laying.',
    specs: ['SANS tested', 'Colours: red, brown, facebrick', 'MOQ: 500 units'],
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'block-bricks',
    title: 'Block Bricks (Hollow & Solid)',
    category: 'manufacturing',
    short: 'Structural and non-structural block solutions.',
    description: 'High compressive strength options, suitable for load-bearing walls and civil applications.',
    specs: ['Height: 200mm standard', 'Compressive strength: up to 10 MPa', 'Available reinforced'],
    image: 'https://images.unsplash.com/photo-1554774853-d1c02a1aa0c2?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'pavers',
    title: 'Pavers & Interlocking Blocks',
    category: 'manufacturing',
    short: 'Driveways, patios and commercial yards.',
    description: 'Slip-resistant finishes, multiple patterns and long-life performance under seasonal rains.',
    specs: ['Thickness: 60/80mm', 'Colours & patterns', 'Geotextile recommended for subbase'],
    image: 'https://images.unsplash.com/photo-1505765053127-7a1b2b4a0e7e?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'kerbs',
    title: 'Kerbs & Channels',
    category: 'manufacturing',
    short: 'Road edge kerbs and drainage channels.',
    description: 'Manufactured to SANS tolerances and available in standard and custom profiles.',
    specs: ['Standard profiles R221/R222', 'Custom lengths on request'],
    image: 'https://images.unsplash.com/photo-1508385082359-f0d6b6b2d0f1?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'precast',
    title: 'Concrete Columns & Precast',
    category: 'manufacturing',
    short: 'Structural columns, lintels and decorative precast elements.',
    description: 'Custom sizes and reinforcement options for housing and light commercial frames.',
    specs: ['Custom designs', 'Factory-cured concrete', 'Reinforced options'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'delivery',
    title: 'Delivery & Logistics',
    category: 'delivery',
    short: 'Site delivery across Gauteng & Mpumalanga.',
    description: 'We coordinate truck loading, offloading and short-distance haulage with clear lead times and tracking for bulk orders.',
    specs: ['Tracked deliveries (X km radius)', 'Cranes or manual offload options'],
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'turnkey',
    title: 'Turnkey Installation & Masonry',
    category: 'installation',
    short: 'Full site preparation, foundations and finishes.',
    description: 'Experienced teams delivering small-to-medium residential builds and landscaping installations.',
    specs: ['Site prep', 'Masonry', 'Finishes & handover'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'testing',
    title: 'Technical Support & Testing',
    category: 'technical',
    short: 'Quality assurance testing and technical drawings.',
    description: 'On-request cube-testing, compressive strength tests and SANS-compliant certificates for tenders.',
    specs: ['Cube testing', 'Material specifications', 'Technical documentation'],
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=60'
  }
];

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=60', alt: 'Brick production' },
  { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60', alt: 'Factory quality control' },
  { src: 'https://images.unsplash.com/photo-1505765053127-7a1b2b4a0e7e?auto=format&fit=crop&w=1200&q=60', alt: 'Paving example' },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60', alt: 'Logistics truck' }
];

/* ---------- Utilities ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- Common init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Year placeholders
  ['#year','#year2','#year3','#year4','#year5'].forEach(id=>{
    const el = document.querySelector(id);
    if(el) el.textContent = new Date().getFullYear();
  });

  // Menu toggle for small screens
  const menuBtn = document.getElementById('menuToggle');
  if(menuBtn) menuBtn.addEventListener('click', ()=> {
    const nav = document.querySelector('.main-nav');
    if(nav.classList.contains('open')) nav.classList.remove('open');
    else nav.classList.add('open');
  });

  populateServicesPreview();
  populateGallery();
  initMap(); // safe if map not present
  bindForms();
  initServicesPage(); // safe if services page not present
  initGalleryLightbox();
});

/* ---------- Services preview & search (index) ---------- */
function populateServicesPreview(){
  const preview = document.getElementById('servicesPreview');
  if(!preview) return;
  // show first 4 services
  const items = SERVICES.slice(0,4);
  preview.innerHTML = items.map(s=>`
    <article class="service-card">
      <img src="${s.image}" alt="${s.title}" style="width:100%;height:140px;object-fit:cover;border-radius:6px">
      <h4>${s.title}</h4>
      <p class="small">${s.short}</p>
      <div style="display:flex;gap:.5rem;margin-top:.6rem">
        <button class="btn small show-service" data-id="${s.id}">Details</button>
        <a class="btn ghost small" href="services.html">More</a>
      </div>
    </article>
  `).join('');
  // bind details
  $$('.show-service').forEach(btn=>btn.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id;
    openServiceModal(id);
  }));
  // wire search on index
  const search = document.getElementById('serviceSearch');
  const sort = document.getElementById('serviceSort');
  if(search) search.addEventListener('input', ()=> {
    // simple redirect to services page with query in hash
    window.location.href = `services.html#q=${encodeURIComponent(search.value)}`;
  });
  if(sort) sort.addEventListener('change', ()=> window.location.href='services.html');
  const openServices = document.getElementById('openServices');
  if(openServices) openServices.addEventListener('click', ()=> window.location.href='services.html');
}

/* ---------- Services page: dynamic loading, search, filter, modal ---------- */
function initServicesPage(){
  const servicesList = document.getElementById('servicesList');
  if(!servicesList) return;

  // Render list using filter/sort inputs
  const render = () => {
    const term = (document.getElementById('servicesSearch')?.value || '').toLowerCase();
    const cat = document.getElementById('servicesCategory')?.value || '';
    const sort = document.getElementById('servicesSort')?.value || 'relevance';
    let out = SERVICES.filter(s => {
      return (!cat || s.category === cat) && (s.title.toLowerCase().includes(term) || s.short.toLowerCase().includes(term) || s.description.toLowerCase().includes(term));
    });
    if(sort === 'alpha') out.sort((a,b)=>a.title.localeCompare(b.title));
    servicesList.innerHTML = out.map(s=>`
      <article class="service-card" data-id="${s.id}">
        <img src="${s.image}" alt="${s.title}" loading="lazy" style="width:100%;height:140px;object-fit:cover;border-radius:6px">
        <h4>${s.title}</h4>
        <p class="small">${s.short}</p>
        <div style="display:flex;gap:.5rem;margin-top:.6rem">
          <button class="btn small show-service" data-id="${s.id}">Details</button>
          <a class="btn ghost small" href="enquiry.html">Enquire</a>
        </div>
      </article>
    `).join('');
    // bind detail buttons
    $$('.show-service').forEach(btn=>btn.addEventListener('click', e=> openServiceModal(e.currentTarget.dataset.id)));
  };

  // listen to controls
  ['servicesSearch','servicesCategory','servicesSort'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', render);
  });

  // prepopulate search if in hash
  const hash = decodeURIComponent(location.hash.replace('#',''));
  if(hash.startsWith('q=')){
    const q = hash.split('q=')[1];
    const s = document.getElementById('servicesSearch');
    if(s){ s.value = q; }
  }

  render();
}

/* ---------- Modal functions ---------- */
function openServiceModal(id){
  const svc = SERVICES.find(s=>s.id===id);
  if(!svc) return;
  const modal = document.getElementById('serviceModal');
  document.getElementById('modalTitle').textContent = svc.title;
  document.getElementById('modalDesc').textContent = svc.description;
  const ul = document.getElementById('modalSpecs');
  ul.innerHTML = svc.specs.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('modalEnquiry').setAttribute('href', `enquiry.html#service=${encodeURIComponent(svc.title)}`);
  modal.setAttribute('aria-hidden','false');
  // close handlers
  modal.querySelector('.modal-close').onclick = ()=> closeModal(modal);
  modal.onclick = (e)=> { if(e.target === modal) closeModal(modal); };
  // trap focus quickly (simple)
  modal.querySelector('.modal-close').focus();
}
function closeModal(modal){
  modal.setAttribute('aria-hidden','true');
}

/* ---------- Gallery & lightbox ---------- */
function populateGallery(){
  const g = document.getElementById('galleryGrid');
  if(!g) return;
  g.innerHTML = GALLERY.map((img,i)=>`<img src="${img.src}" alt="${img.alt}" loading="lazy" data-index="${i}" class="gallery-thumb">`).join('');
}
function initGalleryLightbox(){
  const g = document.getElementById('galleryGrid');
  if(!g) return;
  // create lightbox element
  const lb = document.createElement('div'); lb.id = 'lightbox'; lb.className='modal'; lb.setAttribute('aria-hidden','true');
  lb.innerHTML = `<div class="modal-content" role="dialog" aria-modal="true"><button class="modal-close">✕</button><div id="lbInner"></div></div>`;
  document.body.appendChild(lb);
  lb.querySelector('.modal-close').onclick = ()=> lb.setAttribute('aria-hidden','true');
  g.addEventListener('click', e=>{
    const img = e.target.closest('img');
    if(!img) return;
    const idx = Number(img.dataset.index);
    showLightbox(idx);
  });
  function showLightbox(idx){
    const inner = lb.querySelector('#lbInner');
    inner.innerHTML = `<img src="${GALLERY[idx].src}" alt="${GALLERY[idx].alt}" style="width:100%;height:auto;border-radius:6px">`;
    lb.setAttribute('aria-hidden','false');
  }
}

/* ---------- Map (Leaflet) ---------- */
function initMap(){
  const mapEl = document.getElementById('map');
  if(!mapEl || typeof L === 'undefined') return;
  // Kings Park, KwaMhlanga approx coords
  const lat = -25.5950, lng = 29.1550;
  const map = L.map('map').setView([lat,lng], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
  L.marker([lat,lng]).addTo(map).bindPopup('Gorilla Business Group — Kings Park, KwaMhlanga').openPopup();
}

/* ---------- Forms: validation, AJAX, mailto fallback ---------- */
function bindForms(){
  // Enquiry form
  const eq = document.getElementById('enquiryForm');
  if(eq){
    eq.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const ok = validateForm(eq);
      const resultEl = document.getElementById('enquiryResult');
      if(!ok){ resultEl.textContent = 'Please correct the highlighted fields.'; return; }
      resultEl.textContent = 'Submitting...';

      // Build payload
      const formData = new FormData(eq);
      // Attach chosen service in hash if linking from modal
      const svcFromHash = new URLSearchParams(location.hash.replace('#','')).get('service');
      if(svcFromHash && !formData.get('service')) formData.set('service', svcFromHash);

      // Try AJAX to Formspree endpoint (placeholder). Replace with your endpoint.
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID'; // <-- replace with your ID
      try{
        // send JSON
        const payload = {};
        formData.forEach((v,k)=> payload[k]=v);
        const resp = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {'Accept':'application/json','Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if(resp.ok){
          resultEl.textContent = 'Thanks — your enquiry was submitted. We will respond within 1 business day.';
          eq.reset();
        } else {
          // fallback to mailto
          mailtoFallback('info@gorillabricks.co.za', formData);
          resultEl.textContent = 'Could not submit via server. A mail client should open to send the enquiry. If not, email info@gorillabricks.co.za';
        }
      } catch(err){
        // Fallback
        mailtoFallback('info@gorillabricks.co.za', formData);
        resultEl.textContent = 'An email client should open so you can send the enquiry. If not, email info@gorillabricks.co.za';
      }
    });
  }

  // Contact form
  const cf = document.getElementById('contactForm');
  if(cf){
    cf.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const ok = validateForm(cf);
      const res = document.getElementById('contactResult');
      if(!ok){ res.textContent = 'Please fix the form errors.'; return; }
      res.textContent = 'Sending...';

      const fd = new FormData(cf);
      // Build email body and attempt AJAX then mailto fallback
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
      try{
        const payload = {};
        fd.forEach((v,k)=> payload[k]=v);
        const r = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {'Accept':'application/json','Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        if(r.ok){
          res.textContent = 'Message sent — thank you.';
          cf.reset();
        } else {
          mailtoFallback('info@gorillabricks.co.za', fd);
          res.textContent = 'Could not send via server. A mail client should open instead.';
        }
      } catch(err){
        mailtoFallback('info@gorillabricks.co.za', fd);
        res.textContent = 'A mail client should open so you can send the message. If not, email info@gorillabricks.co.za';
      }
    });
  }
}

function validateForm(formEl){
  let ok = true;
  const elements = Array.from(formEl.elements).filter(el => el.tagName !== 'BUTTON' && el.type !== 'file');
  elements.forEach(el=>{
    el.classList.remove('invalid');
    if(el.required && !el.value.trim()){
      el.classList.add('invalid'); ok=false;
    } else if(el.type === 'email' && el.value){
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!re.test(el.value)){ el.classList.add('invalid'); ok=false; }
    } else if(el.name === 'phone' && el.value){
      const re = /^\+?27\s?\d{2}\s?\d{3}\s?\d{4}$/;
      if(!re.test(el.value)){ el.classList.add('invalid'); ok=false; }
    } else if(el.minLength && el.value.length < el.minLength){
      el.classList.add('invalid'); ok=false;
    }
  });
  return ok;
}

function mailtoFallback(to, formData){
  const subject = encodeURIComponent(`Website enquiry — ${formData.get('service') || formData.get('type') || 'General'}`);
  let body = '';
  formData.forEach((v,k)=> body += `${k}: ${v}\n`);
  const mailto = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
