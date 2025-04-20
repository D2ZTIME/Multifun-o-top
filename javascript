document.addEventListener('DOMContentLoaded', function() {
  // Elementos de áudio
  const clickSound = document.getElementById('click-sound');
  const alarmSound = document.getElementById('alarm-sound');
  
  function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Erro ao reproduzir som:", e));
  }

  // Navegação entre seções
  const menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach(button => {
    button.addEventListener('click', function() {
      playSound(clickSound);
      document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
      
      this.classList.add('active');
      const sectionId = this.dataset.section + '-section';
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // ===== RELÓGIO =====
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Converter para formato 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 deve ser 12
    
    document.getElementById('clock').textContent = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    document.getElementById('ampm').textContent = ampm;
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    document.getElementById('date').textContent = now.toLocaleDateString('pt-BR', options);
  }
  
  // Atualizar a cada segundo
  setInterval(updateClock, 1000);
  updateClock();

  // ===== ALARME =====
  const alarms = [];
  const alarmTimeInput = document.getElementById('alarm-time');
  const setAlarmBtn = document.getElementById('set-alarm');
  const alarmListEl = document.getElementById('alarm-list');

  setAlarmBtn.addEventListener('click', () => {
    playSound(clickSound);
    const time = alarmTimeInput.value;
    if (time) {
      alarms.push({ time, triggered: false });
      renderAlarms();
      alarmTimeInput.value = '';
    }
  });

  function renderAlarms() {
    alarmListEl.innerHTML = '';
    alarms.forEach((alarm, index) => {
      const alarmEl = document.createElement('div');
      alarmEl.className = 'alarm-item';
      alarmEl.innerHTML = `
        <span>${alarm.time}</span>
        <button class="delete-alarm" data-index="${index}">✕</button>
      `;
      alarmListEl.appendChild(alarmEl);
    });

    document.querySelectorAll('.delete-alarm').forEach(btn => {
      btn.addEventListener('click', function() {
        playSound(clickSound);
        alarms.splice(parseInt(this.dataset.index), 1);
        renderAlarms();
      });
    });
  }

  function checkAlarms() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    alarms.forEach(alarm => {
      if (alarm.time === currentTime && !alarm.triggered) {
        playSound(alarmSound);
        alarm.triggered = true;
        alert(`Alarme: ${alarm.time}`);
      }
    });
  }

  setInterval(checkAlarms, 1000);

  // ===== CRONÔMETRO =====
  let stopwatchInterval;
  let stopwatchStartTime = 0;
  let stopwatchElapsedTime = 0;
  let isStopwatchRunning = false;
  let lapCount = 1;

  const startStopwatchBtn = document.getElementById('startStopwatch');
  const pauseStopwatchBtn = document.getElementById('pauseStopwatch');
  const resetStopwatchBtn = document.getElementById('resetStopwatch');
  const lapStopwatchBtn = document.getElementById('lapStopwatch');
  const lapsContainer = document.getElementById('laps-container');

  function updateStopwatch() {
    const elapsed = Date.now() - stopwatchStartTime;
    const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0');
    
    document.getElementById('sw-minutes').textContent = minutes;
    document.getElementById('sw-seconds').textContent = seconds;
    document.getElementById('sw-milliseconds').textContent = milliseconds;
  }

  function addLap() {
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.textContent = `Volta ${lapCount++}: ${document.getElementById('sw-minutes').textContent}:${document.getElementById('sw-seconds').textContent}.${document.getElementById('sw-milliseconds').textContent}`;
    lapsContainer.prepend(lapItem);
  }

  startStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (!isStopwatchRunning) {
      stopwatchStartTime = Date.now() - stopwatchElapsedTime;
      stopwatchInterval = setInterval(updateStopwatch, 10);
      isStopwatchRunning = true;
    }
  });

  pauseStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (isStopwatchRunning) {
      clearInterval(stopwatchInterval);
      stopwatchElapsedTime = Date.now() - stopwatchStartTime;
      isStopwatchRunning = false;
    }
  });

  resetStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchElapsedTime = 0;
    stopwatchStartTime = 0;
    lapCount = 1;
    lapsContainer.innerHTML = '';
    updateStopwatch();
  });

  lapStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (isStopwatchRunning) {
      addLap();
    }
  });

  // ===== POMODORO =====
  let pomodoroInterval;
  let pomodoroTimeLeft = 25 * 60;
  let isPomodoroRunning = false;
  let isWorkTime = true;

  const startPomodoroBtn = document.getElementById('startPomodoro');
  const pausePomodoroBtn = document.getElementById('pausePomodoro');
  const resetPomodoroBtn = document.getElementById('resetPomodoro');
  const workDurationInput = document.getElementById('work-duration');
  const breakDurationInput = document.getElementById('break-duration');

  function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60).toString().padStart(2, '0');
    const seconds = (pomodoroTimeLeft % 60).toString().padStart(2, '0');
    document.getElementById('pomodoro-display').textContent = `${minutes}:${seconds}`;
  }

  function startPomodoroTimer() {
    if (!isPomodoroRunning) {
      const duration = isWorkTime ? 
        parseInt(workDurationInput.value) * 60 : 
        parseInt(breakDurationInput.value) * 60;
      pomodoroTimeLeft = duration;
      
      pomodoroInterval = setInterval(() => {
        pomodoroTimeLeft--;
        updatePomodoroDisplay();
        
        if (pomodoroTimeLeft <= 0) {
          clearInterval(pomodoroInterval);
          playSound(alarmSound);
          isWorkTime = !isWorkTime;
          alert(isWorkTime ? "Hora de trabalhar!" : "Hora de descansar!");
          startPomodoroTimer();
        }
      }, 1000);
      
      isPomodoroRunning = true;
    }
  }

  startPomodoroBtn.addEventListener('click', () => {
    playSound(clickSound);
    startPomodoroTimer();
  });

  pausePomodoroBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (isPomodoroRunning) {
      clearInterval(pomodoroInterval);
      isPomodoroRunning = false;
    }
  });

  resetPomodoroBtn.addEventListener('click', () => {
    playSound(clickSound);
    clearInterval(pomodoroInterval);
    isPomodoroRunning = false;
    isWorkTime = true;
    pomodoroTimeLeft = parseInt(workDurationInput.value) * 60;
    updatePomodoroDisplay();
  });

  // Inicialização
  updatePomodoroDisplay();
});
