(() => {
const $ = (s, sc = document) => sc.querySelector(s);
const $$ = (s, sc = document) => Array.from(sc.querySelectorAll(s));
// 0) Remove o style inline que força a timeline (se existir)
try {
$$('style').forEach(tag => {
if (tag.textContent && tag.textContent.includes('EMERGENCY TIMELINE VISIBILITY FIX')) {
tag.parentNode.removeChild(tag);
}
});
} catch(e){ console.warn('Style cleanup:', e); }
// 1) Mobile menu (seu HTML original usa estes IDs)
const btnMobile = ('#mobileMenuBtn');
const mobile = ('#mobileMenu');
const iconHamb = ('#hamburgerIcon');
const iconClose = ('#closeIcon');
if (btnMobile && mobile && iconHamb && iconClose && !btnMobile.dataset.bound) {
btnMobile.dataset.bound = '1';
btnMobile.addEventListener('click', () => {
const open = !mobile.classList.contains('hidden');
if (open) {
mobile.classList.add('hidden');
iconHamb.classList.remove('hidden');
iconClose.classList.add('hidden');
document.body.style.overflow = '';
} else {
mobile.classList.remove('hidden');
iconHamb.classList.add('hidden');
iconClose.classList.remove('hidden');
document.body.style.overflow = 'hidden';
}
});
// Fecha ao clicar em links do menu mobile
$$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
if (!mobile.classList.contains('hidden')) btnMobile.click();
}));
}
// 2) Busca (Ctrl+K) — usa seu modal existente
const modalSearch = ('#searchModal');
const openSearch = ('#openSearchModal');
const closeSearch = ('#closeSearchModal');
const inputSearch = ('#searchInput');
function openModal(el) { if (!el) return; el.classList.remove('hidden'); el.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeModal(el){ if (!el) return; el.classList.add('hidden'); el.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
if (openSearch && modalSearch && !openSearch.dataset.bound) {
openSearch.dataset.bound = '1';
openSearch.addEventListener('click', (e) => { e.preventDefault(); openModal(modalSearch); setTimeout(()=>inputSearch?.focus(),100); });
}
if (closeSearch && !closeSearch.dataset.bound) {
closeSearch.dataset.bound = '1';
closeSearch.addEventListener('click', () => closeModal(modalSearch));
}
modalSearch?.addEventListener('click', (e) => { if (e.target === modalSearch) closeModal(modalSearch); });
document.addEventListener('keydown', (e) => {
if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openModal(modalSearch); setTimeout(()=>inputSearch?.focus(),100); }
if (e.key === 'Escape') {
// Fecha qualquer modal aberto
$('.modal, [data-modal]').forEach(m => { if (getComputedStyle(m).display !== 'none') closeModal(m); });
}
});
// Busca (placeholder) — não muda o visual
inputSearch?.addEventListener('input', (e) => {
const q = e.target.value.trim().toLowerCase();
const results = ('#searchResults');
if (!results) return;
results.innerHTML = q.length < 2 ? '' : <div class="space-y-2"> <a href="#cursos" class="block p-3 bg-gray-50 rounded-lg">Cursos relacionados a “${q}”</a> <a href="#publicacoes" class="block p-3 bg-gray-50 rounded-lg">Publicações sobre “${q}”</a> </div>;
});
// 3) Back to top (seu botão)
const backTop = $('#backToTopBtn');
if (backTop && !backTop.dataset.bound) {
backTop.dataset.bound = '1';
window.addEventListener('scroll', () => {
if (window.scrollY > 300) backTop.classList.add('show'); else backTop.classList.remove('show');
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
// 4) Reveal on scroll para .fade-in e .timeline-item
const io = new IntersectionObserver((entries) => {
entries.forEach(en => {
if (en.isIntersecting) {
en.target.classList.add('in','animate');
io.unobserve(en.target);
}
});
}, { threshold: .2 });
$$('.fade-in, .timeline-item').forEach(el => io.observe(el));

// === 5) BEGIN PATCH: modal lazy‑load (year/decade) ===

const MODAL_URL = 'modals/year-modal.html';

let yearModalLoaded = false;

async function ensureYearModalLoaded() {
  if (document.getElementById('yearModal')) {
    yearModalLoaded = true;
    return;
  }
  const res = await fetch(MODAL_URL, { cache: 'no-cache' });
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);
  yearModalLoaded = true;

  // Eventos de fechar
  const closeBtn = document.getElementById('closeYearModal');
  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = '1';
    closeBtn.addEventListener('click', closeYearModal);
  }
  const overlay = document.getElementById('yearModal');
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeYearModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeYearModal(); });
}

function closeYearModal() {
  const el = document.getElementById('yearModal');
  if (!el) return;
  el.classList.add('hidden');
  document.body.style.overflow = '';
}

async function openYearModal(year) {
  await ensureYearModalLoaded();

  // Reaproveita seus dados globais (yearData / decadesData)
  const data =
    (window.decadesData && window.decadesData[year]) ||
    (window.yearData && window.yearData[year]) || {};

  const headerEl  = document.getElementById('modalHeader');
  const yearEl    = document.getElementById('modalYear');
  const titleEl   = document.getElementById('modalTitle');
  const contentEl = document.getElementById('modalContent');

  if (yearEl)  yearEl.textContent  = year || '';
  if (titleEl) titleEl.textContent = data.title || '';
  if (headerEl) headerEl.className = `bg-gradient-to-r ${data.color || 'from-blue-600 to-purple-600'} text-white p-6 rounded-t-2xl`;
  if (contentEl) contentEl.innerHTML = data.content || '<p class="text-gray-700">Sem conteúdo disponível para este período.</p>';

  const modal = document.getElementById('yearModal');
  modal?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Liga os cliques da timeline ao novo openYearModal
$$('.year-clickable, [data-year]').forEach(btn => {
  if (btn.dataset.bound) return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const year = btn.getAttribute('data-year') || btn.textContent?.trim();
    await openYearModal(year || '');
  });
});
// Deixe a função disponível para o onclick do HTML
window.openYearModal = openYearModal;

// === END PATCH: modal lazy‑load (year/decade) ===

// 6) PDF “em breve” (em qualquer link marcado como pending)
function wirePendingPDF(scope=document){
$('[data-pdf="pending"]', scope).forEach(a=>{
if (a.dataset.bound) return;
a.dataset.bound = '1';
a.addEventListener('click', (e) => {
e.preventDefault();
const notice = ('#pdfPreviewModal') || ('#modal-notice') || ('#modalYear'); // reaproveita um modal se quiser
if (notice) {
const body = notice.querySelector('#documentPreview, [data-notice-body], .modal__body');
if (body) body.innerHTML = '<p>Arquivo disponível em breve! Esta é uma versão de apresentação.</p>';
openModal(notice);
} else {
alert('Arquivo disponível em breve!');
}
});
});
}
wirePendingPDF();
// 7) Segurança: evita duplicidade de listeners em recarregamentos parciais
console.log('patch.main.js ativo — mantendo design e corrigindo UX');
})();