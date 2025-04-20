document.addEventListener('DOMContentLoaded', function() {
  // Navegação entre seções
  const menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
      
      this.classList.add('active');
      const sectionId = this.dataset.section + '-section';
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // Relógio
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('ampm').textContent = ampm;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('pt-BR', options);
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Cronômetro (corrigido)
  let stopwatchInterval;
  let stopwatchStartTime;
  let stopwatchElapsedTime = 0;
  let isStopwatchRunning = false;

  function updateStopwatch() {
    const currentTime = Date.now();
    stopwatchElapsedTime = currentTime - stopwatchStartTime;
    
    const milliseconds = Math.floor((stopwatchElapsedTime % 1000) / 10).toString().padStart(2, '0');
    const seconds = Math.floor((stopwatchElapsedTime / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((stopwatchElapsedTime / (1000 * 60)) % 60).toString().padStart(2, '0');
    
    document.getElementById('sw-minutes').textContent = minutes;
    document.getElementById('sw-seconds').textContent = seconds;
    document.getElementById('sw-milliseconds').textContent = milliseconds;
  }

  document.getElementById('start-stopwatch').addEventListener('click', () => {
    if (!isStopwatchRunning) {
      stopwatchStartTime = Date.now() - stopwatchElapsedTime;
      stopwatchInterval = setInterval(updateStopwatch, 10);
      isStopwatchRunning = true;
    }
  });

  document.getElementById('pause-stopwatch').addEventListener('click', () => {
    if (isStopwatchRunning) {
      clearInterval(stopwatchInterval);
      isStopwatchRunning = false;
    }
  });

  document.getElementById('reset-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchElapsedTime = 0;
    document.getElementById('sw-minutes').textContent = '00';
    document.getElementById('sw-seconds').textContent = '00';
    document.getElementById('sw-milliseconds').textContent = '00';
  });

  // Restante do código (Timer e Pomodoro) permanece igual
  // ... [código existente para Timer e Pomodoro]
});
