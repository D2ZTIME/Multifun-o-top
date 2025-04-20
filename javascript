<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relógio Multifuncional</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <!-- Menu Lateral -->
    <nav class="sidebar">
      <button class="nav-btn active" data-section="clock">🕒 Relógio</button>
      <button class="nav-btn" data-section="alarm">⏰ Alarme</button>
      <button class="nav-btn" data-section="stopwatch">⏱ Cronômetro</button>
      <button class="nav-btn" data-section="pomodoro">🍅 Pomodoro</button>
    </nav>

    <!-- Conteúdo Principal -->
    <main class="main-content">
      <!-- Relógio -->
      <section id="clock" class="section active">
        <div class="time-display">
          <span id="hours">00</span>:
          <span id="minutes">00</span>:
          <span id="seconds">00</span>
          <span id="ampm">AM</span>
        </div>
        <div id="date" class="date-display"></div>
      </section>

      <!-- Alarme -->
      <section id="alarm" class="section">
        <h2>Configurar Alarme</h2>
        <div class="alarm-controls">
          <input type="time" id="alarm-time">
          <button id="set-alarm">Definir</button>
        </div>
        <div id="alarms-list" class="alarms-list"></div>
      </section>

      <!-- Cronômetro -->
      <section id="stopwatch" class="section">
        <div class="time-display">
          <span id="sw-min">00</span>:
          <span id="sw-sec">00</span>:
          <span id="sw-ms">00</span>
        </div>
        <div class="controls">
          <button id="start-sw">▶</button>
          <button id="pause-sw">⏸</button>
          <button id="reset-sw">⏹</button>
          <button id="lap-sw">⏱</button>
        </div>
        <div id="laps" class="laps-container"></div>
      </section>

      <!-- Pomodoro -->
      <section id="pomodoro" class="section">
        <h2>Tempo Restante</h2>
        <div class="time-display" id="pomodoro-display">25:00</div>
        <div class="pomodoro-controls">
          <button id="start-pomodoro">Iniciar</button>
          <button id="pause-pomodoro">Pausar</button>
          <button id="reset-pomodoro">Resetar</button>
        </div>
        <div class="settings">
          <label>Trabalho: <input type="number" id="work-time" value="25" min="1"></label>
          <label>Descanso: <input type="number" id="break-time" value="5" min="1"></label>
        </div>
      </section>
    </main>
  </div>

  <audio id="click-sound" src="assets/click.mp3"></audio>
  <audio id="alarm-sound" src="assets/alarm.mp3"></audio>

  <script src="script.js"></script>
</body>
</html>
