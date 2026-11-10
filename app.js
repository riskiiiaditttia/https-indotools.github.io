/* ============================================================
   PAPAHZONE — app.js
   Logika UI: sidebar, filter, search, modal, render.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  renderSidebarCategories();
  renderHomeCategories();
  renderFooterCategories();
  initStats();

  if (document.getElementById('toolsGrid')) {
    initToolsPage();
  }
});

/* ---------- SIDEBAR ---------- */
function initSidebar() {
  const ham = document.getElementById('hamburger');
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('overlay');
  const close = document.getElementById('closeSidebar');
  if (!ham || !sb) return;

  const toggle = () => { sb.classList.toggle('open'); ov.classList.toggle('show'); };
  ham.addEventListener('click', toggle);
  close?.addEventListener('click', toggle);
  ov?.addEventListener('click', toggle);

  document.querySelectorAll('.group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      btn.nextElementSibling?.classList.toggle('open');
    });
  });
}

/* ---------- RENDER KATEGORI DI SIDEBAR ---------- */
function renderSidebarCategories() {
  const el = document.getElementById('sidebarCategories');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c =>
    `<a href="tools.html?cat=${c.id}">${c.icon} ${c.name}</a>`
  ).join('');
  if (el.parentElement.classList.contains('open') || true) {
    el.classList.add('open');
  }
}

/* ---------- KATEGORI DI HOME ---------- */
function renderHomeCategories() {
  const el = document.getElementById('homeCategories');
  if (!el) return;
  el.innerHTML = CATEGORIES.slice(0, 12).map(c => {
    const count = TOOLS.filter(t => t.cat === c.id).length;
    return `<a href="tools.html?cat=${c.id}" class="cat-card">
      <div class="cat-icon">${c.icon}</div>
      <h3>${c.name}</h3>
      <span>${count} tools</span>
    </a>`;
  }).join('');
}

/* ---------- KATEGORI DI FOOTER ---------- */
function renderFooterCategories() {
  const el = document.getElementById('footerCategories');
  if (!el) return;
  el.innerHTML = CATEGORIES.slice(0, 6).map(c =>
    `<a href="tools.html?cat=${c.id}">${c.name}</a>`
  ).join('');
}

/* ---------- STATISTIK HERO ---------- */
function initStats() {
  const st = document.getElementById('statTools');
  const sc = document.getElementById('statCats');
  if (st) st.textContent = TOOLS.length + '+';
  if (sc) sc.textContent = CATEGORIES.length;
}

/* ---------- TOOLS PAGE ---------- */
let activeCat = 'all';
let searchTerm = '';

function initToolsPage() {
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
  if (cat && CATEGORIES.some(c => c.id === cat)) activeCat = cat;

  renderCategoryPills();
  bindSearch();
  renderTools();
  bindModal();
}

function renderCategoryPills() {
  const el = document.getElementById('categoryPills');
  if (!el) return;
  el.innerHTML = `<button class="pill-btn ${activeCat === 'all' ? 'active' : ''}" data-cat="all">Semua</button>` +
    CATEGORIES.map(c => `<button class="pill-btn ${activeCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>`).join('');

  el.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      el.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTools();
    });
  });
}

function bindSearch() {
  document.getElementById('searchInput')?.addEventListener('input', e => {
    searchTerm = e.target.value;
    renderTools();
  });
}

function renderTools() {
  const grid = document.getElementById('toolsGrid');
  const empty = document.getElementById('emptyState');
  const label = document.getElementById('toolsCountLabel');
  if (!grid) return;

  const q = searchTerm.trim().toLowerCase();
  const filtered = TOOLS.filter(t => {
    const catOk = activeCat === 'all' || t.cat === activeCat;
    const searchOk = !q ||
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.how.toLowerCase().includes(q) ||
      (t.platform || '').toLowerCase().includes(q);
    return catOk && searchOk;
  });

  if (label) label.textContent = `Menampilkan ${filtered.length} dari ${TOOLS.length} tools`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(t => {
    const cat = CATEGORIES.find(c => c.id === t.cat) || { name: t.cat, color: '#64748b' };
    return `<article class="tool-card" data-name="${escapeAttr(t.name)}">
      <div class="tc-top">
        <h3>${escapeHtml(t.name)}</h3>
        <span class="cat-tag" style="background:${cat.color}18;color:${cat.color}">${cat.name}</span>
      </div>
      <p>${escapeHtml(t.desc)}</p>
      <div class="tc-foot">
        <span class="diff ${t.diff}">${t.diff}</span>
        <span class="gh-link">GitHub ↗</span>
      </div>
    </article>`;
  }).join('');

  grid.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const tool = TOOLS.find(t => t.name === card.dataset.name);
      if (tool) openModal(tool);
    });
  });
}

/* ---------- MODAL ---------- */
function bindModal() {
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(tool) {
  const modal = document.getElementById('toolModal');
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  const cat = CATEGORIES.find(c => c.id === tool.cat) || { name: tool.cat, color: '#64748b' };

  content.innerHTML = `
    <h2>${escapeHtml(tool.name)}</h2>
    <span class="cat-tag m-tag" style="background:${cat.color}18;color:${cat.color}">${cat.name}</span>
    <div class="m-block"><h4>Deskripsi</h4><p>${escapeHtml(tool.desc)}</p></div>
    <div class="m-block"><h4>Cara Kerja</h4><p>${escapeHtml(tool.how)}</p></div>
    <div class="m-meta">
      <div><span>TINGKAT KESULITAN</span><strong>${tool.diff}</strong></div>
      <div><span>PLATFORM</span><strong>${escapeHtml(tool.platform || 'Cross-platform')}</strong></div>
    </div>
    <a class="m-gh" href="${tool.github}" target="_blank" rel="noopener">Lihat di GitHub ↗</a>
    <div class="m-warn">⚠ Gunakan hanya pada sistem yang kamu miliki izin tertulis. Penyalahgunaan = pelanggaran hukum.</div>
  `;

  modal.classList.add('show');
  overlay.classList.add('show');
}

function closeModal() {
  document.getElementById('toolModal')?.classList.remove('show');
  document.getElementById('modalOverlay')?.classList.remove('show');
}

/* ---------- ESCAPE HELPERS ---------- */
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(s = '') { return escapeHtml(s); }