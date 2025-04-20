// Navegação
const menuButtons = document.querySelectorAll('.menu-btn');
menuButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove active de todos
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    
    // Adiciona active no clicado
    this.classList.add('active');
    const sectionId = this.dataset.section + '-section';
    document.getElementById(sectionId).classList.add('active');
  });
});

// Relógio
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
  
  const date = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  document.getElementById('date').textContent = date;
}

setInterval(updateClock, 1000);
updateClock();

// Restante do código permanece igual...
