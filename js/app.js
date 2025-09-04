(() => {
const qs = (s, sc = document) => sc.querySelector(s);
const qsa = (s, sc = document) => Array.from(sc.querySelectorAll(s));
// Mobile menu
const mobileMenu = qs('[data-mobile-menu]');
qsa('[data-action="toggle-mobile-menu"]').forEach(btn => {
btn.addEventListener('click', () => {
const open = mobileMenu.getAttribute('aria-expanded') === 'true';
mobileMenu.setAttribute('aria-expanded', String(!open));
mobileMenu.style.display = open ? 'none' : 'block';
document.body.style.overflow = open ? '' : 'hidden';
});
});
// Modais
const closeAllModals = () => qsa('.modal').forEach(m => m.setAttribute('aria-hidden', 'true'));
document.addEventListener('click', (e) => {
if (e.target.matches('[data-action="open-search"]')) {
e.preventDefault();
qs('[data-modal="search"]').setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden';
}
if (e.target.matches('[data-action="close-modal"]')) {
e.preventDefault();
closeAllModals();
document.body.style.overflow = '';
}
});
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') { closeAllModals(); document.body.style.overflow = ''; }
if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
e.preventDefault();
qs('[data-modal="search"]').setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden';
qs('[data-search-input]')?.focus();
}
});
qsa('.modal').forEach(m => m.addEventListener('click', (e) => {
if (e.target === m) { closeAllModals(); document.body.style.overflow = ''; }
}));
// Back to top
const backTop = qs('.back-to-top');
window.addEventListener('scroll', () => {
if (window.scrollY > 300) backTop.classList.add('show');
else backTop.classList.remove('show');
});
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
// Reveal on scroll
const io = new IntersectionObserver(entries => {
entries.forEach(en => {
if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
});
}, { threshold: .2 });
qsa('[data-animate="fade-in"], .timeline__item').forEach(el => io.observe(el));
// Busca (placeholder)
const searchInput = qs('[data-search-input]');
const searchResults = qs('[data-search-results]');
searchInput?.addEventListener('input', (e) => {
const q = e.target.value.trim().toLowerCase();
if (q.length < 2) { searchResults.innerHTML = ''; return; }
searchResults.innerHTML = <ul class="list"> <li><a href="#pos">Cursos relacionados a “${q}”</a></li> <li><a href="#producao">Publicações sobre “${q}”</a></li> </ul> ;
});
// PDFs pendentes (placeholder)
qsa('[data-pdf="pending"]').forEach(el => {
el.addEventListener('click', (e) => {
e.preventDefault();
const notice = qs('[data-modal="notice"]');
if (notice) { notice.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
else alert('Arquivo disponível em breve! Esta é uma versão de apresentação do site.');
});
});
console.log('app.js v4 carregado');
})();