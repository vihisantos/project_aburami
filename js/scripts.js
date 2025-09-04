// Abrir modal
function abrirCongressoModal(titulo, conteudo) {
  const modal = document.getElementById('congressoModal');
  modal.classList.remove('hidden');
  modal.classList.add('active'); // se usar

  document.getElementById('modalTitulo').textContent = titulo || '';
  document.getElementById('modalConteudo').innerHTML = conteudo || '';
}

// Fechar modal
document.getElementById('fecharCongressoModal').addEventListener('click', function() {
  const modal = document.getElementById('congressoModal');
  modal.classList.add('hidden');
  modal.classList.remove('active'); // se usar
});

// (Opcional: clicar fora do modal fecha)
document.getElementById('congressoModal').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.add('hidden');
    this.classList.remove('active');
  }
});