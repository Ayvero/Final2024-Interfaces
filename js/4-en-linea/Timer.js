class Timer {
  constructor(container, element) {
    this.container = container;
    this.element = element;
    this.timerInterval;
    this.startTime = 0;
    this.pausedTime = 0;
    this.isPaused = false;
    this.minutes = 4;
    this.seconds = 60;
    this.element.innerHTML = `${this.formatTime(this.minutes + 1)}:00`;
    this.startTimer();
    this.pauseTimer();
  }

  // se inicializa el tiempo

  startTimer() {
    this.startTime = Date.now() - this.pausedTime;
    this.timerInterval = setInterval(this.updateTimer.bind(this), 1000);
  }

  // pausa

  pauseTimer() {
    this.pausedTime = Date.now() - this.startTime;
    clearInterval(this.timerInterval);
    this.isPaused = true;
  }

  resumeTimer() {
    this.isPaused = false;
    this.startTimer();
  }

  // se resetean todas las variables y el intervalo

  resetTimer() {
    clearInterval(this.timerInterval);
    this.pausedTime = 0;
    this.isPaused = false;
    this.minutes = 4;
    this.seconds = 60;
    this.element.innerHTML = `${this.formatTime(this.minutes + 1)}:00`;
  }

  // esta funcion actualiza el temporizador, se ejecuta cada segundo

  updateTimer() {
    if (this.isPaused) return;
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;

    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    if (this.minutes - minutes < 0) {
      const divReiniciar = document.querySelector(".win");
      const h1Reiniciar = document.querySelector(".win h1");
      h1Reiniciar.innerHTML = "Se acabo el tiempo";
      divReiniciar.style.display = "flex";
      this.resetTimer();

      return;
    }
    const formattedTime =
      this.formatTime(this.minutes - minutes) +
      ":" +
      this.formatTime(this.seconds - seconds);
    this.element.innerHTML = formattedTime;
  }

  formatTime(time) {
    return time < 10 ? "0" + time : time;
  }
}
