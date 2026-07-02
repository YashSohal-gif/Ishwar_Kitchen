/* ============================================================
   ISHWAR KITCHEN — script.js
   Interactive 3D Globe + All Features
   ============================================================ */

// ══════════ // ══════════
// ══════════ // LOADER  gold particles ══════════
// ══════════ // ══════════
(function initLoader() {
  const canvas = document.getElementById('loaderCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight,
    r: Math.random() * 2.2 + 0.4,
    speed: Math.random() * 1.1 + 0.4,
    opacity: Math.random() * 0.6 + 0.15,
    drift: (Math.random() - 0.5) * 0.4,
  }));
  let raf;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.drift;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${p.opacity})`; ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (!loader) return;
      loader.classList.add('exit');
      setTimeout(() => { loader.style.display = 'none'; cancelAnimationFrame(raf); }, 750);
    }, 2800);
  });
})();

// ══════════ // ══════════
// ══════════ // NAVBAR ══════════
// ══════════ // ══════════
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  const top = document.getElementById('scrollTop');
  if (top) top.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ══════════ // Apple liquid glass mouse tracking ══════════
function trackMouse(sel, xv, yv) {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty(xv, ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty(yv, ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
}
trackMouse('.nav-links a', '--ax', '--ay');
trackMouse('.menu-tab', '--mx', '--my');
const rb = document.querySelector('.reserve-btn');
if (rb) rb.addEventListener('mousemove', e => {
  const r = rb.getBoundingClientRect();
  rb.style.setProperty('--rx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
  rb.style.setProperty('--ry', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
});

// ══════════ // ══════════
// ══════════ // LIVE STATUS  CLOCK ══════════
// ══════════ // ══════════
(function () {
  const mins = new Date().getHours() * 60 + new Date().getMinutes();
  const open = mins >= 630 && mins < 1350;
  const el = document.getElementById('heroStatus');
  const tx = document.getElementById('statusText');
  if (!el) return;
  el.className = 'hero-status ' + (open ? 'open' : 'closed');
  tx.textContent = open ? '✅ Open Now — Come dine in!' : '🔴 Closed · Opens at 10:30 AM';
})();

setInterval(() => {
  const el = document.getElementById('currentTime');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}, 1000);
document.getElementById('currentTime') && (document.getElementById('currentTime').textContent =
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));

// ══════════ // Todays Special ══════════
const specials = [
  { dish: 'Butter Paneer Masala + Butter Naan', price: '₹189' },
  { dish: 'Chole Bhature + Sweet Lassi',        price: '₹149' },
  { dish: 'Dal Makhani + Garlic Naan',          price: '₹149' },
  { dish: 'Chaap Tikka + Paratha',              price: '₹199' },
  { dish: 'Veg Hakka Noodles + Spring Rolls',   price: '₹199' },
  { dish: 'Shahi Paneer + Butter Naan',         price: '₹199' },
  { dish: 'Kadai Paneer + Laccha Paratha',      price: '₹199' },
];
const sp = specials[new Date().getDay()];
const sEl = document.getElementById('todaySpecial'); if (sEl) sEl.textContent = sp.dish;
const pEl = document.getElementById('specialPrice'); if (pEl) pEl.textContent = sp.price;

// ══════════ // ══════════
// ══════════ // MENU TABS  3D TILT ══════════
// ══════════ // ══════════
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-grid').forEach(g => g.classList.remove('active'));
    tab.classList.add('active');
    const g = document.getElementById('menu-' + tab.dataset.tab);
    if (g) { g.classList.add('active'); setTimeout(initTilt, 50); }
  });
});

function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    if (card._t) return; card._t = true;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform  = `perspective(700px) rotateY(${x*15}deg) rotateX(${-y*15}deg) scale(1.04)`;
      card.style.boxShadow  = `${-x*22}px ${-y*22}px 44px rgba(212,175,55,0.14)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.style.transition = 'transform .5s ease, box-shadow .5s ease, border-color .4s';
    });
  });
}
initTilt();

// ══════════ // ══════════
// ══════════ // ORDER PANEL & MENU IMAGES → PETPOOJA ══════════
// ══════════ // ══════════

// ⬇ Paste your PetPooja URL here once you get it
const PETPOOJA_URL = 'REPLACE_WITH_PETPOOJA_URL'; // e.g. https://order.petpooja.com/ishwar-kitchen

// Make every menu card image open PetPooja
function initMenuImageLinks() {
  document.querySelectorAll('.menu-card-img-wrap').forEach(wrap => {
    if (wrap._pp) return;
    wrap._pp = true;
    wrap.addEventListener('click', () => {
      if (PETPOOJA_URL === 'REPLACE_WITH_PETPOOJA_URL') {
        showToast('🍽️ PetPooja link coming soon!');
      } else {
        window.open(PETPOOJA_URL, '_blank');
      }
    });
  });
}
initMenuImageLinks();

// Re-run when tabs switch (new cards become visible)
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => setTimeout(initMenuImageLinks, 80));
});

// Update PetPooja button href dynamically
function syncPetpoojaLinks() {
  document.querySelectorAll('[id="petpoojaMainBtn"], .petpooja-link-btn').forEach(el => {
    if (PETPOOJA_URL !== 'REPLACE_WITH_PETPOOJA_URL') el.href = PETPOOJA_URL;
  });
}
syncPetpoojaLinks();

// Toggle order panel sidebar (repurposed cart panel)
let cart = []; // kept so existing code doesn't break
function renderCart() {} // no-op — cart display removed
function addToCart() {}  // no-op — images now open PetPooja directly
function buildOrderText() { return 'Hello Ishwar Kitchen! I want to place an order.'; }
function orderWhatsApp() {
  window.open('https://wa.me/918699081813?text=' + encodeURIComponent(buildOrderText()), '_blank');
}
function orderSwiggy() {
  window.open('https://www.swiggy.com/search?query=Ishwar+Kitchen+Nakodar', '_blank');
}
function orderZomato() {
  window.open('https://www.zomato.com/nakodar/ishwar-kitchen-nakodar-locality/order', '_blank');
}

function renderCart() {
  const con   = document.getElementById('cartItems');
  const foot  = document.getElementById('cartFooter');
  const badge = document.getElementById('cartCount');
  const totEl = document.getElementById('cartTotal');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = count; badge.classList.toggle('visible', count > 0);
  if (totEl) totEl.textContent = '₹' + total;
  if (!cart.length) {
    con.innerHTML = '<div class="cart-empty"><div class="e-icon">🍽️</div><p>Cart is empty.<br/>Add items from the menu!</p></div>';
    if (foot) foot.style.display = 'none'; return;
  }
  if (foot) foot.style.display = 'block';
  con.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img"/>
      <div class="cart-item-info"><h4>${item.name}</h4><span>₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</span></div>
      <div class="cart-qty">
        <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
      </div>
      <button class="cart-remove" onclick="removeItem(${i})">🗑</button>
    </div>`).join('');
}
function changeQty(i, d) { cart[i].qty += d; if (cart[i].qty <= 0) cart.splice(i, 1); renderCart(); }
function removeItem(i)  { cart.splice(i, 1); renderCart(); }
function toggleCart()   {
  document.getElementById('cartOverlay').classList.toggle('open');
  const d = document.getElementById('cartDrawer'); d.classList.toggle('open');
  document.body.style.overflow = d.classList.contains('open') ? 'hidden' : '';
}
function buildOrderText() {
  if (!cart.length) return '';
  let t = '🍽️ *Order — Ishwar Kitchen, Nakodar*\n\n';
  cart.forEach(i => { t += `• ${i.name} × ${i.qty} = ₹${i.price * i.qty}\n`; });
  t += `\n*Total: ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}*\n\nKindly confirm. Thank you! 🙏`;
  return t;
}
function orderWhatsApp() {
  if (!cart.length) { showToast('🛒 Add items first!'); return; }
  window.open(`https://wa.me/918699081813?text=${encodeURIComponent(buildOrderText())}`, '_blank');
  toggleCart();
}
function orderSwiggy() {
  if (!cart.length) { showToast('🛒 Add items first!'); return; }
  copyClip(buildOrderText()); showToast('📋 Copied! Paste in Swiggy order notes.');
  setTimeout(() => window.open('https://www.swiggy.com/search?query=Ishwar+Kitchen+Nakodar', '_blank'), 1200);
}
function orderZomato() {
  if (!cart.length) { showToast('🛒 Add items first!'); return; }
  copyClip(buildOrderText()); showToast('📋 Copied! Paste in Zomato order notes.');
  setTimeout(() => window.open('https://www.zomato.com/nakodar/ishwar-kitchen-nakodar-locality/order', '_blank'), 1200);
}

// ══════════ // PETPOOJA ORDER ══════════

function openOrderModal() {
  showPetpoojaPopup();
}

// Called from "Order from Website" sidebar button — no cart needed
function showOrderForm() {
  toggleCart(); // close sidebar first
  setTimeout(showCheckoutModal, 280);
}

// ══════════ // PETPOOJA COMING SOON POPUP ══════════
function showPetpoojaPopup() {
  // Close the cart drawer first if open
  const drawer = document.getElementById('cartDrawer');
  if (drawer && drawer.classList.contains('open')) toggleCart();

  // Remove old popup if exists
  const existing = document.getElementById('ppPopup');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'ppPopup';
  el.innerHTML = `
<div class="pp-overlay" id="ppOverlay" onclick="closePetpoojaPopup()"></div>
<div class="pp-modal" id="ppModal">
  <button class="pp-close" onclick="closePetpoojaPopup()">✕</button>
  <div class="pp-icon">🛒</div>
  <h3 class="pp-title">Online Ordering<br/><em>Coming Soon!</em></h3>
  <p class="pp-desc">We are setting up our direct online ordering system powered by PetPooja. Until then, you can call us or order via Swiggy / Zomato.</p>
  <div class="pp-actions">
    <a href="tel:+918699081813" class="pp-btn pp-btn-primary" onclick="closePetpoojaPopup()">📞 Call to Order</a>
    <a href="https://www.swiggy.com/search?query=Ishwar+Kitchen+Nakodar" target="_blank" class="pp-btn pp-btn-swiggy" onclick="closePetpoojaPopup()">Order on Swiggy</a>
    <a href="https://www.zomato.com/nakodar/ishwar-kitchen-nakodar-locality/order" target="_blank" class="pp-btn pp-btn-zomato" onclick="closePetpoojaPopup()">Order on Zomato</a>
  </div>
</div>`;
  document.body.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    document.getElementById('ppOverlay').classList.add('open');
    document.getElementById('ppModal').classList.add('open');
  });
  document.body.style.overflow = 'hidden';
}

function closePetpoojaPopup() {
  const overlay = document.getElementById('ppOverlay');
  const modal   = document.getElementById('ppModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { const el = document.getElementById('ppPopup'); if (el) el.remove(); }, 350);
}


function showCheckoutModal() {
  if (!document.getElementById('ckModal')) {
    const el = document.createElement('div');
    el.id = 'ckModal';
    el.innerHTML = `
<div class="ck-overlay" id="ckOverlay" onclick="closeCheckoutModal()"></div>
<div class="ck-drawer" id="ckDrawer">
  <div class="ck-head">
    <span>🍽️ Place Your Order</span>
    <button class="ck-close" onclick="closeCheckoutModal()">✕</button>
  </div>
  <p style="font-size:.82rem;color:var(--muted);margin:0 0 .8rem;text-align:center">Fill your details and swipe to proceed to our online menu</p>
  <div class="ck-field-group">
    <label class="ck-label" for="ckName">Your Name *</label>
    <input class="ck-input" type="text" id="ckName" placeholder="Rajesh Kumar" autocomplete="name">
  </div>
  <div class="ck-field-group">
    <label class="ck-label" for="ckPhone">Phone Number *</label>
    <input class="ck-input" type="tel" id="ckPhone" placeholder="+91 98765 43210" autocomplete="tel">
  </div>
  <div class="ck-field-group">
    <label class="ck-label" for="ckEmail">Email Address *</label>
    <input class="ck-input" type="email" id="ckEmail" placeholder="you@email.com" autocomplete="email">
  </div>
  <p class="ck-note">🍽️ You'll be taken to our online menu to complete your order.</p>
  <div class="swipe-btn" id="swipeBtn">
    <div class="swipe-fill" id="swipeFill"></div>
    <div class="swipe-thumb" id="swipeThumb">➜</div>
    <span class="swipe-label">SWIPE TO ORDER &nbsp;→</span>
  </div>
  <button class="ck-cancel" onclick="closeCheckoutModal()" style="width:100%;margin-top:.6rem">Cancel</button>
</div>`;
    document.body.appendChild(el);
    initSwipeBtn();
  }

  document.getElementById('ckOverlay').classList.add('open');
  document.getElementById('ckDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('ckName').focus(), 300);
}

function initSwipeBtn() {
  const btn   = document.getElementById('swipeBtn');
  const thumb = document.getElementById('swipeThumb');
  const fill  = document.getElementById('swipeFill');
  if (!btn) return;

  let dragging = false, startX = 0;

  function getMax() { return btn.offsetWidth - thumb.offsetWidth - 8; }

  function startDrag(x) {
    dragging = true;
    startX = x - thumb.offsetLeft;
    thumb.style.transition = 'none';
    fill.style.transition  = 'none';
  }
  function moveDrag(x) {
    if (!dragging) return;
    const pos = Math.max(4, Math.min(x - startX, getMax()));
    thumb.style.left  = pos + 'px';
    fill.style.width  = (pos + thumb.offsetWidth) + 'px';
    thumb.textContent = pos >= getMax() * 0.82 ? '✓' : '➜';
  }
  function endDrag(x) {
    if (!dragging) return;
    dragging = false;
    const pos = thumb.offsetLeft;
    if (pos >= getMax() * 0.82) {
      thumb.style.left = getMax() + 'px';
      fill.style.width = btn.offsetWidth + 'px';
      thumb.textContent = '✓';
      setTimeout(submitCheckoutModal, 350);
    } else {
      thumb.style.transition = 'left .3s';
      fill.style.transition  = 'width .3s';
      thumb.style.left = '4px';
      fill.style.width = thumb.offsetWidth + 4 + 'px';
      thumb.textContent = '➜';
    }
  }

  thumb.addEventListener('mousedown',  e => { e.preventDefault(); startDrag(e.clientX); });
  document.addEventListener('mousemove', e => moveDrag(e.clientX));
  document.addEventListener('mouseup',   e => endDrag(e.clientX));
  thumb.addEventListener('touchstart',  e => { e.preventDefault(); startDrag(e.touches[0].clientX); }, { passive: false });
  document.addEventListener('touchmove', e => { if (dragging) { e.preventDefault(); moveDrag(e.touches[0].clientX); } }, { passive: false });
  document.addEventListener('touchend',  e => endDrag(e.changedTouches[0].clientX));
}

function closeCheckoutModal() {
  document.getElementById('ckOverlay').classList.remove('open');
  document.getElementById('ckDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function submitCheckoutModal() {
  const name  = (document.getElementById('ckName').value  || '').trim();
  const phone = (document.getElementById('ckPhone').value || '').trim();
  const email = (document.getElementById('ckEmail').value || '').trim();
  if (!name)  { document.getElementById('ckName').focus();  showToast('⚠️ Please enter your name');   return; }
  if (!phone) { document.getElementById('ckPhone').focus(); showToast('⚠️ Please enter your phone');  return; }
  if (!email) { document.getElementById('ckEmail').focus(); showToast('⚠️ Please enter your email');  return; }
  closeCheckoutModal();
  redirectToPetPooja(name, phone, email);
}

function redirectToPetPooja(customerName, customerPhone, customerEmail) {
  const amount = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Send order summary to WhatsApp as backup notification to kitchen
  const msg = buildOrderText() +
    `\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}` +
    `\n\n🍽️ Customer is placing an order online.`;
  window.open(`https://wa.me/918699081813?text=${encodeURIComponent(msg)}`, '_blank');

  // Open PetPooja ordering page
  if (PETPOOJA_URL === 'REPLACE_WITH_PETPOOJA_URL') {
    showToast('⚠️ Online ordering coming soon! WhatsApp order sent.');
    return;
  }
  setTimeout(() => window.open(PETPOOJA_URL, '_blank'), 800);
  cart = []; renderCart();
  showToast('✅ Opening our online menu...');
}
function copyClip(text) {
  navigator.clipboard ? navigator.clipboard.writeText(text).catch(() => legacyCopy(text)) : legacyCopy(text);
}
function legacyCopy(text) {
  const ta = Object.assign(document.createElement('textarea'), { value: text });
  Object.assign(ta.style, { position: 'fixed', opacity: '0' });
  document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
}

// ══════════ // ══════════
// ══════════ // FLOATING MENU DRAWER ══════════
// ══════════ // ══════════
function openFloatMenu() {
  if (!document.getElementById('fmenuDrawer')) _buildFloatMenu();
  document.getElementById('fmenuOverlay').classList.add('open');
  document.getElementById('fmenuDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  _showFmenuCats();
}
function closeFloatMenu() {
  document.getElementById('fmenuOverlay').classList.remove('open');
  document.getElementById('fmenuDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function _buildFloatMenu() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
<div id="fmenuOverlay" class="fmenu-overlay" onclick="closeFloatMenu()"></div>
<div id="fmenuDrawer" class="fmenu-drawer">
  <div class="fmenu-drag"></div>
  <div class="fmenu-head">
    <span class="fmenu-title">🍽️ Our Menu</span>
    <button class="fmenu-cart-chip" onclick="closeFloatMenu();toggleCart()">
      🛒 <span id="fmenuCartCount">0</span> item(s)
    </button>
    <button class="fmenu-close" onclick="closeFloatMenu()">✕</button>
  </div>
  <div id="fmenuCatsPage" class="fmenu-page">
    <div class="fmenu-cat-list" id="fmenuCatList"></div>
  </div>
  <div id="fmenuItemsPage" class="fmenu-page hidden">
    <button class="fmenu-back" onclick="_showFmenuCats()">← Back to Categories</button>
    <div class="fmenu-items-grid" id="fmenuItemsGrid"></div>
  </div>
</div>`;
  document.body.appendChild(wrap);

  // Build categories from existing menu tabs + grids
  const cats = [];
  document.querySelectorAll('.menu-tab').forEach(tab => {
    const id   = tab.dataset.tab;
    const grid = document.getElementById('menu-' + id);
    if (!grid) return;
    const cards = grid.querySelectorAll('.menu-card');
    const items = [];
    cards.forEach(card => {
      const btn   = card.querySelector('.add-btn');
      const match = btn?.getAttribute('onclick')?.match(/addToCart\('(.+?)',(\d+),'(.+?)'\)/);
      if (!match) return;
      const img  = card.querySelector('.menu-card-img')?.src || '';
      const desc = card.querySelector('.menu-card-body p')?.textContent || '';
      items.push({ name: match[1], price: +match[2], img, desc });
    });
    if (items.length) cats.push({ id, label: tab.textContent.trim(), items });
  });

  const catList = document.getElementById('fmenuCatList');
  cats.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'fmenu-cat-item';
    const parts = cat.label.match(/^(\S+)\s(.+)$/) || ['', '', cat.label];
    el.innerHTML = `
      <div class="fmenu-cat-icon">${parts[1]}</div>
      <div class="fmenu-cat-name">${parts[2] || cat.label}</div>
      <div class="fmenu-cat-count">${cat.items.length}</div>
      <div class="fmenu-cat-arrow">›</div>`;
    el.onclick = () => _showFmenuItems(cat);
    catList.appendChild(el);
  });
}

function _showFmenuCats() {
  document.getElementById('fmenuCatsPage').classList.remove('hidden');
  document.getElementById('fmenuItemsPage').classList.add('hidden');
  document.getElementById('fmenuDrawer').querySelector('.fmenu-title').textContent = '🍽️ Our Menu';
  _updateFmenuCart();
}

function _showFmenuItems(cat) {
  document.getElementById('fmenuCatsPage').classList.add('hidden');
  document.getElementById('fmenuItemsPage').classList.remove('hidden');
  document.getElementById('fmenuDrawer').querySelector('.fmenu-title').textContent = cat.label;
  const grid = document.getElementById('fmenuItemsGrid');
  const pp = PETPOOJA_URL !== 'REPLACE_WITH_PETPOOJA_URL' ? PETPOOJA_URL : '#';
  grid.innerHTML = cat.items.map(item => `
    <div class="fmenu-item-card" onclick="window.open('${pp}','_blank')" style="cursor:pointer">
      <img class="fmenu-item-img" src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="fmenu-item-info">
        <div class="fmenu-item-name">${item.name}</div>
        <div class="fmenu-item-desc">${item.desc}</div>
        <div class="fmenu-item-price">₹${item.price}</div>
      </div>
      <button class="fmenu-add-btn">Order →</button>
    </div>`).join('');
  _updateFmenuCart();
}

function _fmenuAdd(btn, name, price, img) {
  addToCart(name, price, img);
  btn.textContent = '✓ Added';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = '+ Add'; btn.classList.remove('added'); }, 1200);
  _updateFmenuCart();
}

function _updateFmenuCart() {
  const el = document.getElementById('fmenuCartCount');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

// ══════════ // ══════════
// ══════════ // GALLERY LIGHTBOX ══════════
// ══════════ // ══════════
function openLightbox(src, caption) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); closeGlobe(); } });

// ══════════ // ══════════
// ══════════ // RESERVATION ══════════
// ══════════ // ══════════
function handleReservation(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('resSubmitBtn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Booking Table...";
  submitBtn.disabled = true;

  const v = id => document.getElementById(id).value.trim();
  
  // Generate random booking ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomId = 'IK-RES-';
  for (let i = 0; i < 5; i++) {
    randomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Fill Ticket Details
  document.getElementById('ticketId').textContent = randomId;
  document.getElementById('ticketName').textContent = v('resName');
  document.getElementById('ticketGuests').textContent = v('resGuests');
  
  // Format Date nicely
  const dObj = new Date(v('resDate'));
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = dObj.toLocaleDateString('en-US', options) + ' @ ' + v('resTime');
  document.getElementById('ticketDateTime').textContent = formattedDate;
  document.getElementById('ticketZone').textContent = v('resZone');
  
  // Clear and Generate QR Code
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';
  const qrText = `Booking ID: ${randomId}\nName: ${v('resName')}\nDate: ${formattedDate}\nGuests: ${v('resGuests')}\nZone: ${v('resZone')}`;
  new QRCode(qrContainer, { 
    text: qrText, 
    width: 120, 
    height: 120, 
    colorDark: "#111111", 
    colorLight: "#ffffff", 
    correctLevel: QRCode.CorrectLevel.H 
  });

  // Collect Form Data for Web3Forms API Submission
  const form = document.getElementById('resForm');
  let bookingIdInput = document.getElementById('resBookingIdInput');
  if (!bookingIdInput) {
    bookingIdInput = document.createElement('input');
    bookingIdInput.type = 'hidden';
    bookingIdInput.name = 'booking_id';
    bookingIdInput.id = 'resBookingIdInput';
    form.appendChild(bookingIdInput);
  }
  bookingIdInput.value = randomId;

  const formData = new FormData(form);

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('resForm').style.display    = 'none';
      document.getElementById('successBox').style.display = 'block';
    } else {
      showToast('❌ Booking failed: ' + (data.message || 'Error occurred'));
    }
  })
  .catch(err => {
    console.error(err);
    showToast('❌ Network error. Please try again.');
  })
  .finally(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}

function resetForm() {
  document.getElementById('resForm').reset();
  document.getElementById('resForm').style.display    = 'block';
  document.getElementById('successBox').style.display = 'none';
}


// ══════════ // ══════════
// ══════════ // TOAST  AOS  QR ══════════
// ══════════ // ══════════
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.counter').forEach(c => {
      if (c._done) return; c._done = true;
      const target = +c.dataset.target;
      let cur = 0; const step = target / 112;
      const t = setInterval(() => { cur = Math.min(cur + step, target); c.textContent = Math.floor(cur); if (cur >= target) clearInterval(t); }, 16);
    });
    aosObs.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

window.addEventListener('load', () => {
  const qrEl = document.getElementById('qrCode');
  if (qrEl && typeof QRCode !== 'undefined') {
// ══════════ // If running locally file//  link to WhatsApp to request menu ══════════
// ══════════ // After Netlify deployment the QR will link directly to the PDF ══════════
    let qrUrl;
    if (window.location.protocol === 'file:') {
      qrUrl = 'https://wa.me/918699081813?text=Hi%20Ishwar%20Kitchen!%20Please%20send%20me%20the%20full%20menu%20PDF%20%F0%9F%99%8F';
    } else {
      const base = window.location.href.replace(/[^/]*$/, '');
      qrUrl = base + 'menu.pdf';
    }
    new QRCode(qrEl, {
      text: qrUrl,
      width: 180, height: 180,
      colorDark: '#0D0B09', colorLight: '#fff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
  const dateInput = document.getElementById('resDate');
  if (dateInput) { dateInput.min = dateInput.value = new Date().toISOString().split('T')[0]; }
});

// ══════════ // Active nav ══════════
const secEls = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secEls.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--gold)' : '';
  });
}, { passive: true });

// ══════════ // ══════════
// ══════════ //   PHOTOREALISTIC INTERACTIVE 3D GLOBE ══════════
// ══════════ // ══════════

// ══════════ // Nakodar Punjab coordinates ══════════
const PIN_LAT = 31.1253, PIN_LON = 75.466;

// ══════════ //  Continent data detailed polygon points lat lon ══════════
const CONTINENTS = [
// ══════════ //  North America ══════════
  { c: '#2d6e2d', pts: [
    [71,-157],[70,-140],[68,-135],[64,-141],[60,-141],
    [60,-137],[58,-134],[57,-133],[54,-130],[49,-124],
    [43,-124],[39,-123],[34,-120],[28,-110],[22,-105],
    [18,-88],[10,-84],[8,-78],[9,-77],[12,-70],
    [18,-66],[24,-77],[28,-80],[32,-80],[36,-76],
    [38,-75],[40,-74],[41,-70],[44,-66],[47,-61],
    [50,-56],[52,-55],[56,-60],[60,-64],[65,-66],
    [68,-72],[70,-80],[72,-90],[76,-90],[78,-100],
    [76,-114],[72,-130],[71,-140],[72,-157]
  ]},
// ══════════ //  Greenland ══════════
  { c: '#3a7a3a', pts: [
    [83,-42],[83,-22],[76,-18],[70,-22],[64,-40],
    [62,-50],[66,-53],[72,-56],[76,-58],[80,-64],[84,-58]
  ]},
// ══════════ //  South America ══════════
  { c: '#2a6a2a', pts: [
    [12,-72],[10,-62],[8,-60],[4,-52],[2,-50],
    [-4,-36],[-10,-37],[-18,-38],[-22,-41],
    [-30,-50],[-36,-56],[,-52,-66],[-54,-68],
    [-56,-64],[-50,-72],[-45,-66],[-38,-62],
    [-28,-48],[-20,-40],[-10,-36],[-2,-50],
    [4,-52],[10,-72],[12,-72]
  ]},
// ══════════ //  Europe ══════════
  { c: '#3a8a3a', pts: [
    [71,28],[70,18],[66,14],[62,5],[57,4],
    [51,2],[44,0],[36,-5],[36,5],[36,14],
    [38,16],[40,18],[38,26],[40,28],[42,28],
    [44,30],[46,36],[50,38],[54,38],[56,24],
    [60,26],[65,22],[68,18],[70,22],[71,28]
  ]},
// ══════════ //  Africa ══════════
  { c: '#4a8a30', pts: [
    [37,10],[35,8],[22,2],[15,-1],[5,-5],
    [-4,0],[-16,12],[-26,14],[-34,18],
    [-34,26],[-26,32],[-16,36],[-4,40],
    [8,44],[12,44],[18,42],[22,38],
    [28,34],[32,32],[36,36],[37,22],[37,10]
  ]},
// ══════════ //  Asia Western  Central ══════════
  { c: '#358e35', pts: [
    [70,30],[72,54],[70,74],[66,80],[60,80],
    [50,80],[44,78],[40,68],[38,48],[42,44],
    [48,58],[54,60],[58,38],[58,30],[66,30],[70,30]
  ]},
// ══════════ //  Asia Eastern ══════════
  { c: '#38803a', pts: [
    [70,80],[68,100],[65,130],[58,140],[52,140],
    [44,132],[38,120],[28,120],[22,114],[10,104],
    [5,100],[5,80],[14,80],[20,78],[28,80],
    [30,80],[36,76],[40,68],[44,78],[50,80],
    [60,80],[66,80],[70,80]
  ]},
// ══════════ //  Indian Subcontinent larger detail ══════════
  { c: '#4aaa4a', pts: [
    [35,68],[36,72],[36,76],[34,80],[30,82],
    [28,85],[24,88],[20,90],[14,80],[8,77],
    [8,72],[12,72],[16,74],[20,72],[26,66],
    [30,66],[33,66],[35,68]
  ]},
// ══════════ //  Sri Lanka ══════════
  { c: '#52aa52', pts: [[10,80],[8,80],[6,81],[8,82],[10,80]] },
// ══════════ //  Japan ══════════
  { c: '#388e3c', pts: [[46,140],[44,148],[34,132],[34,128],[38,130],[44,141],[46,140]] },
// ══════════ //  Australia ══════════
  { c: '#5a8a2a', pts: [
    [-14,126],[-14,136],[-14,140],[-20,148],
    [-28,154],[-34,150],[-38,148],[-38,140],
    [-34,122],[-26,114],[-22,114],[-18,122],[-14,126]
  ]},
// ══════════ //  New Zealand simplified ══════════
  { c: '#4a8a30', pts: [[-34,172],[-34,174],[-40,176],[-46,168],[-34,172]] },
// ══════════ //  UK  Ireland ══════════
  { c: '#3a8a3a', pts: [[58,-4],[50,-5],[50,0],[53,0],[54,-2],[58,-4]] },
];

// ══════════ //  3D projection lat/lon  screen xyz ══════════
function project(lat, lon, cx, cy, R, rotY, rotX) {
  const phi   =  lat       * Math.PI / 180;
  const theta = (lon + rotY) * Math.PI / 180;
  const tilt  =  rotX      * Math.PI / 180;

// ══════════ // Spherical  cartesian ══════════
  let px =  Math.cos(phi) * Math.sin(theta);
  let py = -Math.sin(phi);
  let pz =  Math.cos(phi) * Math.cos(theta);

// ══════════ // Rotate around X axis vertical tilt from north/south drag ══════════
  const py2 = py * Math.cos(tilt) - pz * Math.sin(tilt);
  const pz2 = py * Math.sin(tilt) + pz * Math.cos(tilt);

  return { x: cx + R * px, y: cy + R * py2, z: pz2 };
}

// ══════════ //  Draw latitude / longitude grid visible side only ══════════
function drawGrid(ctx, cx, cy, R, rotY, rotX) {
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 0.5;

// ══════════ // Latitude rings ══════════
  for (let lat = -80; lat <= 80; lat += 20) {
    ctx.beginPath();
    let started = false;
    for (let lon = -180; lon <= 181; lon += 3) {
      const p = project(lat, lon, cx, cy, R, rotY, rotX);
      if (p.z > 0) {
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      } else { started = false; }
    }
    ctx.stroke();
  }
// ══════════ // Longitude lines ══════════
  for (let lon = -180; lon <= 180; lon += 30) {
    ctx.beginPath();
    let started = false;
    for (let lat = -89; lat <= 89; lat += 3) {
      const p = project(lat, lon, cx, cy, R, rotY, rotX);
      if (p.z > 0) {
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      } else { started = false; }
    }
    ctx.stroke();
  }
}

// ══════════ //  Draw all continents ══════════
function drawLand(ctx, cx, cy, R, rotY, rotX) {
  CONTINENTS.forEach(({ c, pts }) => {
    if (!pts || pts.length < 3) return;
    const projected = pts.map(([la, lo]) => project(la, lo, cx, cy, R, rotY, rotX));
    const avgZ = projected.reduce((s, p) => s + p.z, 0) / projected.length;
    if (avgZ < -0.25) return; // ════════════════════════════════════════════════════════════════════════════════════════════════════fully on back — skip

    ctx.beginPath();
    projected.forEach((p, i) => { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
    ctx.closePath();

// ══════════ // Subtle shading brighter on sun side z  0 ══════════
    const shade = Math.max(0.55, Math.min(1, avgZ * 0.4 + 0.75));
    ctx.fillStyle = c + Math.round(shade * 255).toString(16).padStart(2, '0');
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 0.4;
    ctx.stroke();
  });
}

// ══════════ //  Ice caps as latitude band ══════════
function drawIceCap(ctx, cx, cy, R, rotY, rotX, fromLat, towardPole) {
  ctx.save();
  ctx.beginPath();
  const step = 4;
  let started = false;
  for (let lon = -180; lon <= 181; lon += step) {
    const p = project(fromLat, lon, cx, cy, R, rotY, rotX);
    if (p.z >= -0.1) {
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    } else { started = false; }
  }
// ══════════ // Connect to pole ══════════
  const pole = project(towardPole > 0 ? 90 : -90, 0, cx, cy, R, rotY, rotX);
  ctx.lineTo(pole.x, pole.y);
  ctx.closePath();
  ctx.fillStyle = 'rgba(225,240,255,0.9)';
  ctx.fill();
  ctx.restore();
}

// ══════════ //  Static starfield seeded ══════════
function drawStars(ctx, W, H) {
  for (let i = 0; i < 160; i++) {
    const sx = (Math.sin(i * 9.7) * 0.5 + 0.5) * W;
    const sy = (Math.sin(i * 13.3) * 0.5 + 0.5) * H;
    const sr = i % 5 === 0 ? 1.3 : 0.55;
    const op = 0.3 + (Math.sin(i * 7.1) * 0.5 + 0.5) * 0.6;
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${op.toFixed(2)})`; ctx.fill();
  }
}

// ══════════ //  Animated pin for Nakodar ══════════
function drawPin(ctx, px, py, t) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

// ══════════ // Outer glow ══════════
  const glow = ctx.createRadialGradient(px, py, 0, px, py, 32);
  glow.addColorStop(0,   'rgba(212,175,55,0.85)');
  glow.addColorStop(0.4, 'rgba(212,175,55,0.25)');
  glow.addColorStop(1,   'rgba(212,175,55,0)');
  ctx.beginPath(); ctx.arc(px, py, 32, 0, Math.PI * 2);
  ctx.fillStyle = glow; ctx.fill();

// ══════════ // Expanding pulse ring ══════════
  const pr = 14 + pulse * 12;
  ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(212,175,55,${(0.8 - pulse * 0.6).toFixed(2)})`;
  ctx.lineWidth = 1.5; ctx.stroke();

// ══════════ // Pin core dot ══════════
  ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2);
  const dotGrad = ctx.createRadialGradient(px - 2, py - 2, 0, px, py, 7);
  dotGrad.addColorStop(0, '#FFF5C0');
  dotGrad.addColorStop(1, '#D4AF37');
  ctx.fillStyle = dotGrad; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5; ctx.stroke();

// ══════════ // Label pill ══════════
  const labelX = px + 16, labelY = py - 12;
  ctx.save();
  ctx.font = 'bold 12px Inter, sans-serif';
  const tw = ctx.measureText('🍽️ Ishwar Kitchen').width;
// ══════════ // Background pill ══════════
  ctx.fillStyle = 'rgba(10,8,5,0.85)';
  const pad = 6;
  roundRect(ctx, labelX - pad, labelY - 14, tw + pad * 2, 30, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212,175,55,0.5)'; ctx.lineWidth = 1; ctx.stroke();
// ══════════ // Text ══════════
  ctx.fillStyle = '#D4AF37';
  ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
  ctx.fillText('🍽️ Ishwar Kitchen', labelX, labelY);
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = 'rgba(245,230,200,0.85)';
  ctx.fillText('Nakodar, Punjab, India', labelX, labelY + 14);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ══════════ //  Main globe draw function ══════════
function drawGlobeFn(ctx, W, H, rotY, rotX, zoom, t) {
  const cx = W / 2, cy = H / 2;
  const R  = Math.min(W, H) * zoom;

  ctx.clearRect(0, 0, W, H);

// ══════════ // Space ══════════
  const space = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, Math.max(W, H));
  space.addColorStop(0,   '#0a0818');
  space.addColorStop(0.4, '#060510');
  space.addColorStop(1,   '#020208');
  ctx.fillStyle = space; ctx.fillRect(0, 0, W, H);
  drawStars(ctx, W, H);

// ══════════ //  Clip to sphere ══════════
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

// ══════════ // Ocean gradient ══════════
  const ocean = ctx.createRadialGradient(cx - R*.22, cy - R*.22, 0, cx, cy, R);
  ocean.addColorStop(0,    '#1e88e5');
  ocean.addColorStop(0.35, '#1565c0');
  ocean.addColorStop(0.7,  '#0d47a1');
  ocean.addColorStop(1,    '#051428');
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - R - 1, cy - R - 1, R * 2 + 2, R * 2 + 2);

// ══════════ // Land ══════════
  drawLand(ctx, cx, cy, R, rotY, rotX);

// ══════════ // Grid lines ══════════
  drawGrid(ctx, cx, cy, R, rotY, rotX);

// ══════════ // Ice caps ══════════
  drawIceCap(ctx, cx, cy, R, rotY, rotX,  80,  1);  // ════════════════════════════════════════════════════════════════════════════════════════════════════Arctic
  drawIceCap(ctx, cx, cy, R, rotY, rotX, -72, -1);  // ════════════════════════════════════════════════════════════════════════════════════════════════════Antarctic

// ══════════ // Nightside terminator shadow sun at upperleft ══════════
  const nightGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  nightGrad.addColorStop(0,    'rgba(0,0,0,0)');
  nightGrad.addColorStop(0.5,  'rgba(0,5,20,0)');
  nightGrad.addColorStop(0.72, 'rgba(0,5,20,0.35)');
  nightGrad.addColorStop(0.88, 'rgba(0,5,20,0.7)');
  nightGrad.addColorStop(1,    'rgba(0,5,20,0.92)');
  ctx.fillStyle = nightGrad;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

// ══════════ //  City lights glimmer on night side subtle dots ══════════
  ctx.globalAlpha = 0.35;
  [[28,77],[19,73],[28,51],[40,44],[51,35],[22,114],[35,140],[37,127],
   [1,37],[40,28],[48,2],[51,-0.1],[28,-82],[34,-118],[41,-74],[34,-84]]
  .forEach(([la, lo]) => {
    const p = project(la, lo, cx, cy, R, rotY, rotX);
    if (p.z < -0.05 && p.z > -0.85) {
      const cityGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
      cityGlow.addColorStop(0, 'rgba(255,240,150,0.9)');
      cityGlow.addColorStop(1, 'rgba(255,200,80,0)');
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = cityGlow; ctx.fill();
    }
  });
  ctx.globalAlpha = 1;

// ══════════ // Sunside specular topleft lens shine ══════════
  const spec = ctx.createRadialGradient(cx - R*.38, cy - R*.42, 0, cx - R*.1, cy - R*.12, R*.92);
  spec.addColorStop(0,    'rgba(255,255,248,0.22)');
  spec.addColorStop(0.18, 'rgba(255,255,248,0.08)');
  spec.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

  ctx.restore(); // ════════════════════════════════════════════════════════════════════════════════════════════════════end sphere clip

// ══════════ //  Atmosphere outside clip ══════════
  const atm = ctx.createRadialGradient(cx, cy, R - 3, cx, cy, R + 38);
  atm.addColorStop(0,   'rgba(120,190,255,0.3)');
  atm.addColorStop(0.5, 'rgba(80,150,255,0.12)');
  atm.addColorStop(1,   'rgba(60,100,255,0)');
  ctx.beginPath(); ctx.arc(cx, cy, R + 38, 0, Math.PI * 2);
  ctx.fillStyle = atm; ctx.fill();

// ══════════ // Outer atmosphere thin line ══════════
  ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(120,180,255,0.18)'; ctx.lineWidth = 3; ctx.stroke();

// ══════════ // Drop shadow ══════════
  const shadow = ctx.createRadialGradient(cx + R*.3, cy + R*.3, R*.1, cx + R*.3, cy + R*.3, R*.8);
  shadow.addColorStop(0,   'rgba(0,0,30,0.4)');
  shadow.addColorStop(0.5, 'rgba(0,0,30,0.15)');
  shadow.addColorStop(1,   'rgba(0,0,30,0)');
  ctx.beginPath(); ctx.arc(cx + R*.3, cy + R*.3, R*.8, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();

// ══════════ //  Pin for Nakodar ══════════
  const pin = project(PIN_LAT, PIN_LON, cx, cy, R, rotY, rotX);
  if (pin.z > 0.05) drawPin(ctx, pin.x, pin.y, t);
}

// ══════════ // ══════════
// ══════════ // GLOBE INTERACTION STATE ══════════
// ══════════ // ══════════
let globeCanvas = null, globeCtx = null;
let globeW = 0, globeH = 440;
let globeRAF = null;

// ══════════ // Rotation state ══════════
let globeRotY    = 40;   // ════════════════════════════════════════════════════════════════════════════════════════════════════Y-axis (longitude) rotation — starts off India
let globeRotX    = 0;    // ════════════════════════════════════════════════════════════════════════════════════════════════════X-axis tilt (latitude)
let globeVelY    = 0;    // ════════════════════════════════════════════════════════════════════════════════════════════════════angular velocity Y
let globeVelX    = 0;    // ════════════════════════════════════════════════════════════════════════════════════════════════════angular velocity X
let globeZoom    = 0.38; // ════════════════════════════════════════════════════════════════════════════════════════════════════radius as fraction of min(W,H)
let globeTime    = 0;    // ════════════════════════════════════════════════════════════════════════════════════════════════════for pin animation

// ══════════ // Phase intro  autospin  find India ══════════
// ══════════ // free   user controlled ══════════
let globePhase   = 'intro';
let globePhaseT  = 0;    // ════════════════════════════════════════════════════════════════════════════════════════════════════time in current phase

// ══════════ // Drag state ══════════
let globeDrag    = false;
let globeDragX   = 0, globeDragY = 0;

// ══════════ // Hover position relative to canvas center normalized 11 ══════════
let globeHoverNX = 0, globeHoverNY = 0;
let globeMouseOn = false;

// ══════════ // Touch pinch ══════════
let globeTouchDist = 0;

// ══════════ //  Setup all interactions ══════════
function setupGlobeInteraction(canvas) {

// ══════════ //  Mouse drag ══════════
  canvas.addEventListener('mousedown', e => {
    globeDrag   = true;
    globeDragX  = e.clientX;
    globeDragY  = e.clientY;
    globeVelY   = 0;
    globeVelX   = 0;
    globePhase  = 'free';
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    globeDrag = false;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
// ══════════ // Normalized hover position ══════════
    globeHoverNX = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    globeHoverNY = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    globeMouseOn = true;

    if (globeDrag) {
      const dx = e.clientX - globeDragX;
      const dy = e.clientY - globeDragY;
      globeVelY  = dx * 0.5;   // ════════════════════════════════════════════════════════════════════════════════════════════════════velocity = drag speed
      globeVelX  = -dy * 0.3;
      globeRotY += dx * 0.5;
      globeRotX  = Math.max(-80, Math.min(80, globeRotX + dy * 0.3));
      globeDragX = e.clientX;
      globeDragY = e.clientY;
      globePhase = 'free';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    globeMouseOn = false;
    globeDrag    = false;
    canvas.style.cursor = 'grab';
  });

// ══════════ //  Scroll zoom ══════════
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.012 : 0.012;
    globeZoom = Math.max(0.2, Math.min(0.54, globeZoom + delta));
  }, { passive: false });

// ══════════ //  Touch drag ══════════
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      globeDrag  = true;
      globeDragX = e.touches[0].clientX;
      globeDragY = e.touches[0].clientY;
      globeVelY  = 0; globeVelX = 0;
      globePhase = 'free';
    } else if (e.touches.length === 2) {
      globeDrag = false;
      globeTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && globeDrag) {
      const dx = e.touches[0].clientX - globeDragX;
      const dy = e.touches[0].clientY - globeDragY;
      globeVelY  = dx * 0.5;
      globeVelX  = -dy * 0.3;
      globeRotY += dx * 0.5;
      globeRotX  = Math.max(-80, Math.min(80, globeRotX + dy * 0.3));
      globeDragX = e.touches[0].clientX;
      globeDragY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - globeTouchDist) * 0.0006;
      globeZoom  = Math.max(0.2, Math.min(0.54, globeZoom + delta));
      globeTouchDist = dist;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => { globeDrag = false; });
}

// ══════════ //  Animation loop  deltatime for butterysmooth 60fps ══════════
let globeLastTs = 0;
function globeFrame(ts) {
  const raw = ts - globeLastTs;
  globeLastTs = ts;
  const dt = Math.min(raw > 0 ? raw / 16.67 : 1, 3); // ════════════════════════════════════════════════════════════════════════════════════════════════════normalize to 60fps units

  globeTime   += dt * 0.016;
  globePhaseT += dt * 0.016;

  if (!globeDrag) {
    if (globePhase === 'intro') {
      if (globePhaseT < 2.5) {
        globeRotY -= 3.0 * dt;
      } else if (globePhaseT < 5.0) {
        const target = -PIN_LON + 180;
        const diff   = target - globeRotY;
        globeRotY   += diff * (1 - Math.pow(0.96, dt));
        globeRotX   += (0 - globeRotX) * (1 - Math.pow(0.96, dt));
        if (globePhaseT > 4.8) globePhase = 'hover';
      }
    }
    else if (globePhase === 'hover') {
      if (globeMouseOn) {
        const targetVel  = globeHoverNX * 2.8;
        const targetVelX = globeHoverNY * 1.4;
// ══════════ // Exponential ease  framerate independent ══════════
        const smoothY = 1 - Math.pow(0.88, dt);
        const smoothX = 1 - Math.pow(0.90, dt);
        globeVelY += (targetVel  - globeVelY)  * smoothY;
        globeVelX += (targetVelX - globeVelX)  * smoothX;
      } else {
        globeVelY += (-0.22 - globeVelY) * (1 - Math.pow(0.96, dt));
        globeVelX += (0     - globeVelX) * (1 - Math.pow(0.97, dt));
      }
      globeRotY += globeVelY * dt;
      globeRotX  = Math.max(-80, Math.min(80, globeRotX + globeVelX * dt));
    }
    else if (globePhase === 'free') {
      const decay = Math.pow(0.95, dt);
      globeVelY *= decay;
      globeVelX *= decay;
      globeRotY += globeVelY * dt;
      globeRotX  = Math.max(-80, Math.min(80, globeRotX + globeVelX * dt));
      if (globeMouseOn && Math.abs(globeVelY) < 0.4 && Math.abs(globeVelX) < 0.3) globePhase = 'hover';
    }
  }

  drawGlobeFn(globeCtx, globeW, globeH, globeRotY, globeRotX, globeZoom, globeTime);
  globeRAF = requestAnimationFrame(globeFrame);
}

// ══════════ //  Open / close ══════════
function openGlobe() {
  document.getElementById('globeModal').classList.add('active');
  document.body.style.overflow = 'hidden';

// ══════════ // Init canvas AFTER modal is visible so getBoundingClientRect works ══════════
  requestAnimationFrame(() => {
    globeCanvas = document.getElementById('globeCanvas');
    globeCtx    = globeCanvas.getContext('2d');
    const rect  = globeCanvas.getBoundingClientRect();
    globeW = rect.width || globeCanvas.parentElement.offsetWidth || 680;
    globeH = 440;
    globeCanvas.width  = globeW;
    globeCanvas.height = globeH;

// ══════════ // Reset state ══════════
    globeRotY   = 40;
    globeRotX   = 0;
    globeVelY   = 0;
    globeVelX   = 0;
    globeZoom   = 0.38;
    globePhase  = 'intro';
    globePhaseT = 0;
    globeTime   = 0;
    globeMouseOn = false;

    setupGlobeInteraction(globeCanvas);

    if (globeRAF) cancelAnimationFrame(globeRAF);
    globeLastTs = performance.now();
    globeRAF = requestAnimationFrame(globeFrame);
  });
}

function closeGlobe() {
  document.getElementById('globeModal').classList.remove('active');
  document.body.style.overflow = '';
  if (globeRAF) { cancelAnimationFrame(globeRAF); globeRAF = null; }
}

document.getElementById('globeModal').addEventListener('click', function(e) {
  if (e.target === this) closeGlobe();
});

window.addEventListener('resize', () => {
  if (globeCanvas && document.getElementById('globeModal').classList.contains('active')) {
    const rect = globeCanvas.getBoundingClientRect();
    globeW = rect.width || 680;
    globeCanvas.width = globeW;
  }
});

// ══════════ // SERVICE WORKER (PWA) ══════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW failed:', err));
  });
}

// ══════════ // ══════════
// ══════════ // WRITE A REVIEW FORM ══════════
// ══════════ // ══════════
(function initReviewForm() {

  // ── Star Rating Picker ──────────────────────────────────────
  const stars     = document.querySelectorAll('.star-pick');
  const ratingInput = document.getElementById('ratingVal');
  const starLabel = document.getElementById('starLabel');
  const starTexts = ['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent 🤩'];

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = +star.dataset.val;
      stars.forEach(s => {
        s.classList.toggle('hovered', +s.dataset.val <= val);
        s.classList.remove('selected');
      });
      starLabel.textContent = starTexts[val];
    });

    star.addEventListener('mouseleave', () => {
      const cur = +ratingInput.value;
      stars.forEach(s => {
        s.classList.remove('hovered');
        s.classList.toggle('selected', +s.dataset.val <= cur);
      });
      starLabel.textContent = cur > 0 ? starTexts[cur] : 'Tap to rate';
    });

    star.addEventListener('click', () => {
      const val = +star.dataset.val;
      ratingInput.value = val;
      stars.forEach(s => s.classList.toggle('selected', +s.dataset.val <= val));
      starLabel.textContent = starTexts[val];
    });
  });

  // ── Character Counter ───────────────────────────────────────
  const rvText = document.getElementById('rvText');
  const rvChar = document.getElementById('rvChar');
  if (rvText && rvChar) {
    rvText.addEventListener('input', () => {
      rvChar.textContent = rvText.value.length + ' / 300';
      rvChar.style.color = rvText.value.length > 270 ? '#e23744' : '';
    });
  }

  // ── Load saved reviews from localStorage ───────────────────
  renderUserReviews();

})();

// ── Submit Handler ────────────────────────────────────────────
function submitReview(e) {
  e.preventDefault();

  const rating   = +document.getElementById('ratingVal').value;
  const name     = document.getElementById('rvName').value.trim();
  const location = document.getElementById('rvLocation').value.trim();
  const text     = document.getElementById('rvText').value.trim();
  const btn      = document.getElementById('rfSubmitBtn');

  // Validation
  if (rating === 0) { showToast('⭐ Please select a star rating!'); return; }
  if (!name)        { showToast('📝 Please enter your name!');       document.getElementById('rvName').focus(); return; }
  if (!text)        { showToast('💬 Please write your review!');     document.getElementById('rvText').focus(); return; }

  // Button loading state
  btn.disabled = true;
  btn.innerHTML = '<span>⏳ Submitting…</span>';

  // Build review object
  const review = {
    rating,
    name,
    location: location || 'Punjab',
    text,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  // ── Send to Formspree ─────────────────────────────────────
  fetch('https://formspree.io/f/mbdvaaee', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:     name,
      location: review.location,
      rating:   '★'.repeat(rating) + '☆'.repeat(5 - rating) + '  (' + rating + '/5)',
      review:   text,
      date:     review.date
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('Formspree error');

    // Save to localStorage only after successful send
    const saved = JSON.parse(localStorage.getItem('ik_reviews') || '[]');
    saved.unshift(review);
    localStorage.setItem('ik_reviews', JSON.stringify(saved));

    // Reset form
    document.getElementById('reviewForm').reset();
    document.getElementById('ratingVal').value = '0';
    document.getElementById('rvChar').textContent = '0 / 300';
    document.getElementById('starLabel').textContent = 'Tap to rate';
    document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('selected', 'hovered'));

    // Re-render and thank user
    renderUserReviews();
    showToast('🙏 Thank you! Your review has been submitted.');
  })
  .catch(() => {
    // Still save locally even if network fails
    const saved = JSON.parse(localStorage.getItem('ik_reviews') || '[]');
    saved.unshift(review);
    localStorage.setItem('ik_reviews', JSON.stringify(saved));

    document.getElementById('reviewForm').reset();
    document.getElementById('ratingVal').value = '0';
    document.getElementById('rvChar').textContent = '0 / 300';
    document.getElementById('starLabel').textContent = 'Tap to rate';
    document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('selected', 'hovered'));

    renderUserReviews();
    showToast('✅ Review saved! (Offline — will sync later)');
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = '<span>✍️ Submit Review</span>';
  });
}

// ── Render User Reviews ───────────────────────────────────────
function renderUserReviews() {
  const wrap = document.getElementById('userReviewsWrap');
  if (!wrap) return;

  const saved = JSON.parse(localStorage.getItem('ik_reviews') || '[]');
  if (!saved.length) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = '<h4 style="font-family:\'Playfair Display\',serif;color:var(--gold);font-size:1rem;margin-bottom:.8rem;">💬 Recent Reviews from Customers</h4>' +
    saved.map(rv => {
      const stars   = '★'.repeat(rv.rating) + '☆'.repeat(5 - rv.rating);
      const initials = rv.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      return `
        <div class="user-review-card">
          <div class="user-review-stars">${stars}</div>
          <p class="user-review-text">"${rv.text}"</p>
          <div class="user-review-author">
            <div class="user-review-avatar">${initials}</div>
            <div>
              <div class="user-review-name">${rv.name}</div>
              <div class="user-review-location">${rv.location}</div>
            </div>
            <div class="user-review-date">${rv.date}</div>
          </div>
        </div>`;
    }).join('');
}
