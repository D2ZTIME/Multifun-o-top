document.addEventListener('DOMContentLoaded', function() {
  // Navegação
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
    
    document.getElementById('clock-hours').textContent = hours;
    document.getElementById('clock-minutes').textContent = minutes;
    document.getElementById('clock-seconds').textContent = seconds;
    document.getElementById('ampm').textContent = ampm;
    
    const date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    document.getElementById('date').innerHTML = date.replace(', ', '<br>');
  }
  
  setInterval(updateClock, 1000);
  updateClock();

  // Cronômetro
  let stopwatchInterval;
  let startTime;
  let elapsedTime = 0;
  let isStopwatchRunning = false;

  function updateStopwatch() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    
    const milliseconds = Math.floor(elapsedTime % 1000 / 10);
    const seconds = Math.floor(elapsedTime / 1000 % 60);
    const minutes = Math.floor(elapsedTime / 1000 / 60);
    
    document.getElementById('sw-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('sw-seconds').textContent = String(seconds).padStart(2, '0');
    document.getElementById('sw-milliseconds').textContent = String(milliseconds).padStart(2, '0');
  }

  document.getElementById('start-stopwatch').addEventListener('click', () => {
    if (!isStopwatchRunning) {
      startTime = Date.now() - elapsedTime;
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
    elapsedTime = 0;
    document.getElementById('sw-minutes').textContent = '00';
    document.getElementById('sw-seconds').textContent = '00';
    document.getElementById('sw-milliseconds').textContent = '00';
  });

  // Timer e Pomodoro (mantidos como no código original)
  // ... (código existente para timer e pomodoro)
});
