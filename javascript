class App {
  constructor() {
    // Elementos principais
    this.sections = document.querySelectorAll('.section');
    this.navButtons = document.querySelectorAll('.nav-btn');
    
    // Elementos de áudio
    this.clickSound = document.getElementById('click-sound');
    this.alarmSound = document.getElementById('alarm-sound');
    
    // Inicializar módulos
    this.clock = new Clock();
    this.alarm = new Alarm(this.alarmSound);
    this.stopwatch = new Stopwatch();
    this.pomodoro = new Pomodoro();
    
    // Event listeners
    this.initNavigation();
  }

  initNavigation() {
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playSound(this.clickSound);
        const sectionId = btn.dataset.section;
        this.showSection(sectionId);
        btn.classList.add('active');
      });
    });
  }

  showSection(sectionId) {
    this.sections.forEach(section => section.classList.remove('active'));
    this.navButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
  }

  playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(error => console.log('Erro de áudio:', error));
  }
}

class Clock {
  constructor() {
    this.hoursElement = document.getElementById('hours');
    this.minutesElement = document.getElementById('minutes');
    this.secondsElement = document.getElementById('seconds');
    this.ampmElement = document.getElementById('ampm');
    this.dateElement = document.getElementById('date');
    this.update();
    setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');

    this.hoursElement.textContent = displayHours;
    this.minutesElement.textContent = minutes;
    this.secondsElement.textContent = seconds;
    this.ampmElement.textContent = ampm;
    this.dateElement.textContent = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

class Alarm {
  constructor(alarmSound) {
    this.alarms = [];
    this.alarmSound = alarmSound;
    this.alarmTimeInput = document.getElementById('alarm-time');
    this.alarmsList = document.getElementById('alarms-list');
    document.getElementById('set-alarm').addEventListener('click', () => this.setAlarm());
    setInterval(() => this.checkAlarms(), 1000);
  }

  setAlarm() {
    const time = this.alarmTimeInput.value;
    if (time) {
      this.alarms.push({
        time,
        active: true
      });
      this.renderAlarms();
      this.alarmTimeInput.value = '';
    }
  }

  renderAlarms() {
    this.alarmsList.innerHTML = this.alarms
      .map((alarm, index) => `
        <div class="lap-item">
          ${alarm.time}
          <button onclick="app.alarm.deleteAlarm(${index})">✕</button>
        </div>
      `).join('');
  }

  deleteAlarm(index) {
    this.alarms.splice(index, 1);
    this.renderAlarms();
  }

  checkAlarms() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    this.alarms.forEach(alarm => {
      if (alarm.time === currentTime && alarm.active) {
        this.alarmSound.play();
        alarm.active = false;
      }
    });
  }
}

class Stopwatch {
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.laps = [];
    
    this.display = {
      minutes: document.getElementById('sw-min'),
      seconds: document.getElementById('sw-sec'),
      milliseconds: document.getElementById('sw-ms')
    };
    
    this.buttons = {
      start: document.getElementById('start-sw'),
      pause: document.getElementById('pause-sw'),
      reset: document.getElementById('reset-sw'),
      lap: document.getElementById('lap-sw')
    };
    
    this.initControls();
  }

  initControls() {
    this.buttons.start.addEventListener('click', () => this.start());
    this.buttons.pause.addEventListener('click', () => this.pause());
    this.buttons.reset.addEventListener('click', () => this.reset());
    this.buttons.lap.addEventListener('click', () => this.addLap());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = Date.now() - this.elapsedTime;
      this.timer = setInterval(() => this.update(), 10);
    }
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.timer);
  }

  reset() {
    this.pause();
    this.elapsedTime = 0;
    this.laps = [];
    document.getElementById('laps').innerHTML = '';
    this.updateDisplay(0);
  }

  addLap() {
    if (this.isRunning) {
      this.laps.push(this.elapsedTime);
      const lapItem = document.createElement('div');
      lapItem.className = 'lap-item';
      lapItem.textContent = `Volta ${this.laps.length}: ${this.formatTime(this.elapsedTime)}`;
      document.getElementById('laps').prepend(lapItem);
    }
  }

  update() {
    this.elapsedTime = Date.now() - this.startTime;
    this.updateDisplay(this.elapsedTime);
  }

  updateDisplay(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    this.display.minutes.textContent = minutes.toString().padStart(2, '0');
    this.display.seconds.textContent = seconds.toString().padStart(2, '0');
    this.display.milliseconds.textContent = milliseconds.toString().padStart(2, '0');
  }

  formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }
}

class Pomodoro {
  constructor() {
    this.isWorking = true;
    this.isRunning = false;
    this.timeLeft = 25 * 60;
    
    this.elements = {
      display: document.getElementById('pomodoro-display'),
      start: document.getElementById('start-pomodoro'),
      pause: document.getElementById('pause-pomodoro'),
      reset: document.getElementById('reset-pomodoro'),
      workTime: document.getElementById('work-time'),
      breakTime: document.getElementById('break-time')
    };
    
    this.initControls();
  }

  initControls() {
    this.elements.start.addEventListener('click', () => this.start());
    this.elements.pause.addEventListener('click', () => this.pause());
    this.elements.reset.addEventListener('click', () => this.reset());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.interval = setInterval(() => this.tick(), 1000);
    }
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  reset() {
    this.pause();
    this.isWorking = true;
    this.timeLeft = this.elements.workTime.value * 60;
    this.updateDisplay();
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.switchMode();
    }
    this.updateDisplay();
  }

  switchMode() {
    this.isWorking = !this.isWorking;
    this.timeLeft = (this.isWorking ? 
      this.elements.workTime.value : 
      this.elements.breakTime.value) * 60;
    this.playSound();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.elements.display.textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  playSound() {
    const audio = new Audio('assets/alarm.mp3');
    audio.play();
  }
}

// Inicializar aplicação
const app = new App();
