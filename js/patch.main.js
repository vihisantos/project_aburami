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
// 5) Timeline: abrir modal ao clicar no ano (mantendo seu design)
const modalYear = ('#yearModal');
const modalYearContent = ('#modalContent');
function openYear(year){
if (!modalYear || !modalYearContent) return;
modalYearContent.innerHTML = <div class="space-y-4"> <h3 class="text-2xl font-bold">Ano ${year}</h3> <p>Conteúdo ilustrativo. Os documentos e fotos entram aqui.</p> <ul class="list-disc pl-5"> <li>Evento principal do ano.</li> <li>Publicação relevante.</li> <li>Material em PDF <a href="#" class="btn btn--ghost is-disabled" data-pdf="pending" aria-disabled="true">PDF (em breve)</a></li> </ul> </div>;
openModal(modalYear);
}
// Usa seus botões .year-clickable e qualquer [data-year]
$$('.year-clickable,[data-year]').forEach(btn => {
if (btn.dataset.bound) return;
btn.dataset.bound = '1';
btn.addEventListener('click', (e) => {
e.preventDefault();
const year = btn.getAttribute('data-year') || btn.textContent?.trim();
openYear(year || '—');
});
});
// Fecha modal do ano ao clicar fora
modalYear?.addEventListener('click', (e) => { if (e.target === modalYear) closeModal(modalYear); });
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