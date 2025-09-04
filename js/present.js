(() => {
const qs=(s,sc=document)=>sc.querySelector(s);
const qsa=(s,sc=document)=>Array.from(sc.querySelectorAll(s));
// Mobile menu
const menu=qs('[data-menu]');
qsa('[data-toggle="menu"]').forEach(b=>{
b.addEventListener('click',()=>{
const open=menu.getAttribute('aria-expanded')==='true';
menu.setAttribute('aria-expanded',String(!open));
menu.style.display=open?'none':'flex';
document.body.style.overflow=open?'':'hidden';
});
});
// Modais
function openModal(id){ const m=qs(id); if(!m) return; m.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeAll(){ qsa('.modal').forEach(m=>m.setAttribute('aria-hidden','true')); document.body.style.overflow=''; }
document.addEventListener('click',(e)=>{
if(e.target.matches('[data-open="search"]')){ e.preventDefault(); openModal('#modal-search'); }
if(e.target.matches('[data-close]')){ e.preventDefault(); closeAll(); }
if(e.target.closest('[data-open="year"]')){ // timeline
const y=e.target.closest('[data-open="year"]').getAttribute('data-year');
const body=qs('[data-year-body]'); if(body){ body.innerHTML= <p><strong>${y}</strong> — conteúdo histórico em breve.</p>; }
openModal('#modal-year');
}
if(e.target.matches('[data-pdf="pending"]')){ e.preventDefault(); openModal('#modal-notice'); }
});
qsa('.modal').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m) closeAll(); }));
document.addEventListener('keydown',e=>{
if(e.key==='Escape') closeAll();
if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openModal('#modal-search'); qs('[data-search]')?.focus(); }
});
// Busca placeholder
const si=qs('[data-search]'); const sr=qs('[data-results]');
si?.addEventListener('input',e=>{
const q=e.target.value.trim().toLowerCase();
sr.innerHTML = q.length<2 ? '' : <ul class="list"> <li><a href="#pos">Cursos relacionados a “${q}”</a></li> <li><a href="#producao">Publicações sobre “${q}”</a></li> </ul>;
});
// Back to top FAB
const topBtn=qs('[data-top]');
window.addEventListener('scroll',()=>{ if(window.scrollY>280) topBtn.classList.add('show'); else topBtn.classList.remove('show'); });
topBtn?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
console.log('present.js pronto');
})();