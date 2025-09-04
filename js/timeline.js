document.addEventListener("DOMContentLoaded", function() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
});

// Modal simples (coloque no seu JS global se já tiver padrão de modal)
function abrirModalDetalhe(ano) {
  alert('Abrir modal detalhado do ano: ' + ano); // Substitua por seu modal real
}