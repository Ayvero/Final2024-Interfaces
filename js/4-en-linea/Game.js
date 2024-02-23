const paso1 = document.querySelector(".inicio .paso-1");
const paso2 = document.querySelector(".inicio .paso-2");
const paso3 = document.querySelector(".inicio .paso-3");
const h1Paso3 = document.querySelector(".paso-3 h1");
const grupo1 = document.querySelector(".grupo-1");
const grupo2 = document.querySelector(".grupo-2");

class Game {
  WIDTH = 600;
  HEIGHT = 500;
  divTimer = document.querySelector(".container-timer .timer");
  constructor(ctx) {
    const inicioBoton = document.querySelector(".inicio button");
    const carsdModo = document.querySelectorAll(".card-modo");
    const containerTimer = document.querySelector(".container-timer");
    const btnReiniciar = document.querySelector(".win button");
    const fichasImg = document.querySelectorAll(".ficha");
    grupo1.style.border = "1px solid #f00";
    grupo2.style.pointerEvents = "none";

    const j1 = new Player(1);
    const j2 = new Player(2);
    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;

    this.ctx = ctx;
    this.arrayImgFichas = [];
    this.numeroJuego = 4;
    this.jugadores = [j1, j2];
    this.timer = new Timer(containerTimer, this.divTimer);
    this.tablero = new Tablero({
      ctx: this.ctx,
      width: this.WIDTH,
      height: this.HEIGHT,
      game: this,
    });

    // manejo del evento click, al presionar el boton del inicio

    inicioBoton.addEventListener("click", () => {
      paso1.style.display = "none";
      paso2.style.display = "flex";
    });

    // manejo del evento click, en las cards para elegir el modo de juego

    carsdModo.forEach((card) => {
      card.addEventListener("click", (e) => {
        // se guarda el numero del juego
        const numeroIdCard = parseInt(e.target.id);
        g.numeroJuego = numeroIdCard;
        paso2.style.display = "none";
        paso3.style.display = "flex";
      });
    });

    // manejar click de las imagenes, en caso de ya haber hecho dos click, no hace nada

    fichasImg.forEach((img) => {
      img.addEventListener("click", (e) => {
        const selectedImg = e.target;
        this.tacharImgFicha(selectedImg);
        this.actualizarMensajeYGrupos();

        g.arrayImgFichas.push(selectedImg);

        if (g.arrayImgFichas.length > 1) {
          this.reiniciarGrupos();
          this.finalizarSeleccionFichas();
        }
      });
    });

    btnReiniciar.addEventListener("click", () => {
      this.reiniciarJuego();
    });
  }

  tacharImgFicha(imgClick) {
    const fichasImg = document.querySelectorAll(".ficha");

    fichasImg.forEach((img) => {
      if (imgClick.src === img.src) {
        img.style.pointerEvents = "none";
        img.style.filter = "grayscale(80%)";
      }
    });
  }

  actualizarMensajeYGrupos() {
    h1Paso3.innerHTML =
      g.arrayImgFichas.length % 2 === 0
        ? "Elige la ficha del jugador 1"
        : "Elige la ficha del jugador 2";

    grupo1.style.pointerEvents = "none";
    grupo2.style.pointerEvents = "auto";
    grupo2.style.border = "1px solid #00f";
    grupo1.style.border = "";
  }

  reiniciarGrupos() {
    grupo1.style.border = "1px solid #f00";
    grupo1.style.pointerEvents = "auto";
    grupo2.style.pointerEvents = "none";
    grupo2.style.border = "none";
  }

  finalizarSeleccionFichas() {
    h1Paso3.innerHTML = "Elige la ficha del jugador 1";
    paso2.style.display = "flex";
    paso3.style.display = "none";
    document.querySelector(".inicio").style.display = "none";
    g.iniciarJuego();
  }

  iniciarJuego() {
    this.divTimer.style.display = "flex";
    this.timer.resumeTimer();
    this.tablero.iniciarJuego(this.numeroJuego);
  }

  // esta funcion miestra el div de win, y se muestra quien gano

  pintarWin() {
    this.timer.pauseTimer();
    const divWin = document.querySelector(".win");
    const h1Win = document.querySelector(".win h1");
    h1Win.innerHTML = `Gano el jugador ${this.tablero.jugadorActual.num}`;
    divWin.style.display = "flex";
  }

  // esta funcion resetea las variables para poder reiniciar el juego

  reiniciarJuego() {
    const fichasImg = document.querySelectorAll(".ficha");

    this.timer.resetTimer();
    this.divTimer.style.display = "none";
    this.tablero.tablero = [];
    this.tablero.fichas = [];
    this.tablero.jugadorActual = this.jugadores[0];
    this.tablero.ganador = false;
    this.arrayImgFichas = [];
    this.tablero.dibujarFondo();
    this.reiniciarGrupos();

    // se saca los estilos a las imagenes de las fichas, asi se pueden volver a seleccionar

    fichasImg.forEach((img) => {
      img.style.pointerEvents = "auto";
      img.style.filter = "";
    });

    const divWin = document.querySelector(".win");
    const divInicio = document.querySelector(".inicio");
    divInicio.style.display = "flex";
    divWin.style.display = "none";
  }
}
