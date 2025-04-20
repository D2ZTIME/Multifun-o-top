document.addEventListener('DOMContentLoaded', function() {
  // Elementos de áudio
  const clickSound = document.getElementById('click-sound');
  const alarmSound = document.getElementById('alarm-sound');
  
  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
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

  // Alarme
  const alarmList = [];
  const setAlarmBtn = document.getElementById('set-alarm');
  const alarmTimeInput = document.getElementById('alarm-time');
  const alarmListContainer = document.getElementById('alarm-list');

  function checkAlarms() {
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    alarmList.forEach(alarm => {
      if (alarm.time === currentTime && !alarm.triggered) {
        playSound(alarmSound);
        alarm.triggered = true;
        alert(`Alarme: ${alarm.time}`);
      }
    });
  }

  setAlarmBtn.addEventListener('click', () => {
    playSound(clickSound);
    const alarmTime = alarmTimeInput.value;
    if (alarmTime) {
      alarmList.push({ time: alarmTime, triggered: false });
      renderAlarmList();
      alarmTimeInput.value = '';
    }
  });

  function renderAlarmList() {
    alarmListContainer.innerHTML = '';
    alarmList.forEach((alarm, index) => {
      const alarmItem = document.createElement('div');
      alarmItem.className = 'alarm-item';
      alarmItem.innerHTML = `
        <span>${alarm.time}</span>
        <button class="delete-alarm" data-index="${index}">✕</button>
      `;
      alarmListContainer.appendChild(alarmItem);
    });

    document.querySelectorAll('.delete-alarm').forEach(btn => {
      btn.addEventListener('click', function() {
        playSound(clickSound);
        const index = parseInt(this.dataset.index);
        alarmList.splice(index, 1);
        renderAlarmList();
      });
    });
  }

  setInterval(checkAlarms, 1000);

  // Cronômetro
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

  function updateStopwatchDisplay() {
    const totalMs = stopwatchElapsedTime;
    const minutes = Math.floor(totalMs / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');

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
      stopwatchInterval = setInterval(() => {
        stopwatchElapsedTime = Date.now() - stopwatchStartTime;
        updateStopwatchDisplay();
      }, 10);
      isStopwatchRunning = true;
    }
  });

  pauseStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (isStopwatchRunning) {
      clearInterval(stopwatchInterval);
      isStopwatchRunning = false;
    }
  });

  resetStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchElapsedTime = 0;
    lapCount = 1;
    lapsContainer.innerHTML = '';
    updateStopwatchDisplay();
  });

  lapStopwatchBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (isStopwatchRunning) {
      addLap();
    }
  });

  // Pomodoro
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

  function startPomodoro() {
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
          startPomodoro();
        }
      }, 1000);
      
      isPomodoroRunning = true;
    }
  }

  startPomodoroBtn.addEventListener('click', () => {
    playSound(clickSound);
    startPomodoro();
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
