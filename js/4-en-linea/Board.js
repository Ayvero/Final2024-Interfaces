class Tablero {
  constructor({ ctx, width, height, game }) {
    this.ctx = ctx;
    this.largo = width;
    this.alto = height;
    this.tablero = [];
    this.fichas = [];
    this.game = game;
    this.jugadorActual = this.game.jugadores[0];
    this.fichaActual;
    this.tamañoFigura = 20;
    this.margenTablero = 70;
    this.ganador = false;
    this.backgroundImage = document.getElementById("backgroundImage");

    // cuando carga la imagen se dibuja

    this.backgroundImage.onload = () => {
      this.dibujarFondo();
    };

    // esta funcion se ejecuta cuando se hace click en el canvas

    canvas.addEventListener("mousedown", (e) => {
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;
      this.fichas.forEach((ficha) => {
        const { x, y } = ficha;
        const distancia = Math.sqrt((canvasX - x) ** 2 + (canvasY - y) ** 2);
        // si se hace click en una fucha
        if (distancia <= this.tamañoFigura) {
          // si se hace click en la ficha del jugador actual
          if (ficha.jugador !== this.jugadorActual.num) return;
          this.fichaActual = ficha;
          document.body.style.cursor = "pointer";
          return;
        }
      });
    });

    // esta funcion se ejecuta cuando se mueve el mouse en el canvas

    canvas.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;
      // si existe una fucha actual, se cambian sus cordenadas a las del mouse
      if (this.fichaActual) {
        this.fichaActual.x = canvasX;
        this.fichaActual.y = canvasY;
        this.fichaActual.fichaObjeto.posX = canvasX;
        this.fichaActual.fichaObjeto.posY = canvasY;
        this.dibujarTablero();
      }
    });

    // esta funcion se ejecuta cuando se suelta el click

    canvas.addEventListener("mouseup", (e) => {
      if (!this.fichaActual) return;
      document.body.style.cursor = "";
      const { clientX, clientY } = e;
      const rect = canvas.getBoundingClientRect();
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      // si se encuentra arriba del tablero
      if (
        canvasY < this.margenTablero + 20 &&
        canvasX > this.margenTablero &&
        canvasX < this.largo - this.margenTablero
      ) {
        const numeroColumna = this.numeroColumna(canvasX);
        const ficha = this.obtenerFichaCol({ numeroColumna });

        this.moverFichaAnimada({ x: ficha.x, y: ficha.y });
        this.comprobarGanador();
        this.cambiarTurno();
        this.crearFicha();
      } else {
        this.moverFichaAnimada({
          x: this.fichaActual.initialX,
          y: this.fichaActual.initialY,
        });
      }
    });
  }

  // funcion que iniciar el juego, crea el tablero y las fichas

  iniciarJuego() {
    this.crearTablero();
    this.crearFicha();
    this.dibujarTablero();
  }

  // esta funcion recorre las filas, cuolumnas y diagonales del tablero y comprueba si gano

  comprobarGanador() {
    const numFigurasX = this.game.numeroJuego + 3;
    const numFigurasY = this.game.numeroJuego + 2;

    // comprueba si el jugador actual gano en las filas

    for (let i = 0; i < numFigurasY; i++) {
      const fila = [];
      for (let j = 0; j < numFigurasX; j++) {
        fila.push(this.tablero[i][j].num);
      }
      this.comprobarSiGano(fila);
    }

    const numColumnas = this.tablero[0].length;

    // comprueba si el jugador actual gano en las columnas

    for (let i = 0; i < numColumnas; i++) {
      const columna = [];
      for (let j = 0; j < this.tablero.length; j++) {
        columna.push(this.tablero[j][i].num);
      }
      this.comprobarSiGano(columna);
    }

    // comprueba si el jugador actual gano en las diagonales de izquierda a derecha

    for (let i = 0; i < numFigurasY; i++) {
      for (let j = 0; j < numFigurasX; j++) {
        if (
          i + (this.game.numeroJuego - 1) < numFigurasY &&
          j + (this.game.numeroJuego - 1) < numFigurasX
        ) {
          const diagonal = [];
          for (let k = 0; k < this.game.numeroJuego; k++) {
            diagonal.push(this.tablero[i + k][j + k].num);
          }
          this.comprobarSiGano(diagonal);
        }
      }
    }

    // comprueba si el jugador actual gano en las diagonales de derecha a izquierda

    for (let i = 0; i < numFigurasY; i++) {
      for (let j = numFigurasX - 1; j >= this.game.numeroJuego - 1; j--) {
        if (i + (this.game.numeroJuego - 1) < numFigurasY) {
          const diagonal = [];
          for (let k = 0; k < this.game.numeroJuego; k++) {
            diagonal.push(this.tablero[i + k][j - k].num);
          }
          this.comprobarSiGano(diagonal);
        }
      }
    }
  }

  // esta funcion reciebe un arreglo de las filas, columnas o diagonales, y comprueba si gano segun el numero de juego elegido

  comprobarSiGano(arreglo) {
    let numAnt = 0;
    let puntaje = 0;

    arreglo.forEach((num) => {
      if (num === numAnt && num === this.jugadorActual.num) {
        puntaje++;
        // si el puntaje mayor o igual al numero de juego, significa que gano
        if (puntaje >= this.game.numeroJuego - 1) {
          this.ganador = true;
          this.game.pintarWin();
        }
      }
      // si un numero es distinto al anterior se reinicia el puntaje
      if (num !== numAnt) {
        puntaje = 0;
      }
      numAnt = num;
    });
  }

  // esta funcion cambia de turno

  cambiarTurno() {
    if (this.jugadorActual.num === 1) {
      this.jugadorActual = this.game.jugadores[1];
    } else {
      this.jugadorActual = this.game.jugadores[0];
    }
  }

  // esta funcion recibe por parametro el numero de columna que tiene que recorrer, y comprueba de abajo hacia arriba si la casilla esta basica, en caso de estar vacia devuelve la posicion de la ficha vacia

  obtenerFichaCol({ numeroColumna }) {
    const numFigurasY = this.game.numeroJuego + 2;
    for (let i = numFigurasY - 1; i >= 0; i--) {
      // si la casilla de la columna esta esta vacia, es decir ningun jugador coloco una casilla
      if (this.tablero[i][numeroColumna].num === 0) {
        this.tablero[i][numeroColumna].num = this.jugadorActual.num;
        // devuelve la ficha para despues mostrarla
        return this.tablero[i][numeroColumna];
      }
    }
    return null;
  }

  // se crean las fichas

  crearFicha() {
    const margen = 15;

    // parametros iniciales de las fichas
    const fichasInicial = [
      {
        initialX: margen + this.tamañoFigura,
        initialY: this.alto / 2,
        x: margen + this.tamañoFigura,
        y: this.alto / 2,
        largo: this.tamañoFigura,
        jugador: 1,
      },
      {
        initialX: this.largo - this.tamañoFigura - margen,
        initialY: this.alto / 2,
        x: this.largo - margen - this.tamañoFigura,
        y: this.alto / 2,
        largo: this.tamañoFigura,
        jugador: 2,
      },
    ];

    const indice = this.jugadorActual.num - 1;
    const { x, y, largo, jugador } = fichasInicial[indice];
    // se crea la ficha del juegador actual
    const newficha = new FigureWithImage(
      x,
      y,
      this.game.arrayImgFichas[indice],
      largo,
      this.ctx,
      jugador,
      this.game.arrayImgFichas[indice].style.borderColor
    );
    this.fichas.push({ ...fichasInicial[indice], fichaObjeto: newficha });
  }

  // se crea la matriz del tablero y se definen las posiciones de cada figura

  crearTablero() {
    const numFigurasX = this.game.numeroJuego + 3;
    const numFigurasY = this.game.numeroJuego + 2;

    const espacioDisponibleX =
      this.largo - 2 * this.margenTablero - this.tamañoFigura * numFigurasX;
    const espacioDisponibleY =
      this.alto - this.margenTablero - this.tamañoFigura * numFigurasY;
    const espacioEntreFigurasX = espacioDisponibleX / (numFigurasX + 1);
    const espacioEntreFigurasY = espacioDisponibleY / (numFigurasY + 1);
    const posXPrimeraFigura =
      espacioEntreFigurasX + this.margenTablero + this.tamañoFigura / 2;
    const posYPrimeraFigura = espacioEntreFigurasY + this.margenTablero;

    for (let i = 0; i < numFigurasY; i++) {
      this.tablero[i] = Array(numFigurasX).fill(0);

      for (let j = 0; j < numFigurasX; j++) {
        const posXFigura =
          posXPrimeraFigura + j * (this.tamañoFigura + espacioEntreFigurasX);

        const posYFigura =
          posYPrimeraFigura + i * (this.tamañoFigura + espacioEntreFigurasY);
        //se crea la figura
        const newFicha = new Figure(
          posXFigura,
          posYFigura,
          "#2223",
          this.tamañoFigura,
          this.ctx
        );
        this.tablero[i][j] = {
          x: posXFigura,
          y: posYFigura,
          fichaObjeto: newFicha,
          num: 0,
        };
      }
    }
  }

  // se pinta el tablero

  dibujarTablero() {
    this.dibujarFondo();
    // se dibujan todas las figuras del tablero
    this.tablero.forEach((col) => {
      col.forEach((ficha) => {
        ficha.fichaObjeto.draw();
      });
    });

    // se dibujan todas las figuras que los jugadores colocaron en el tablero
    this.fichas.forEach((ficha) => {
      ficha.fichaObjeto.draw();
    });
  }

  // dibuja la imagen del fondo

  dibujarFondo() {
    const aspectRatioImage =
      this.backgroundImage.width / this.backgroundImage.height;
    const aspectRatioCanvas = this.largo / this.alto;
    let newWidth, newHeight, numffset, yOffset;

    // define el alto y ancho para que se vea bien la imagen
    if (aspectRatioCanvas > aspectRatioImage) {
      newWidth = this.largo;
      newHeight = this.largo / aspectRatioImage;
      numffset = 0;
      yOffset = (this.alto - newHeight) / 2;
    } else {
      newWidth = this.alto * aspectRatioImage;
      newHeight = this.alto;
      numffset = (this.largo - newWidth) / 2;
      yOffset = 0;
    }

    // se pinta la imagen
    this.ctx.drawImage(
      this.backgroundImage,
      numffset,
      yOffset,
      newWidth,
      newHeight
    );
    this.ctx.fillStyle = "#000a";
    this.ctx.fillRect(0, 0, this.largo, this.alto);
  }

  moverFichaAnimada({ x, y }) {
    if (!this.fichaActual) return;
    const initialX = this.fichaActual.x;
    const initialY = this.fichaActual.y;
    const targetX = x;
    const targetY = y;
    const duration = 250;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calcular las nuevas coordenadas de la ficha
      const newX = initialX + (targetX - initialX) * progress;
      const newY = initialY + (targetY - initialY) * progress;

      // Actualizar la posición de la ficha
      this.fichaActual.fichaObjeto.posX = newX;
      this.fichaActual.fichaObjeto.posY = newY;

      this.fichaActual.x = newX;
      this.fichaActual.y = newY;

      // se dibuja el tablero por cada frame
      this.dibujarTablero();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // La animacion termino
        this.fichaActual = null;
      }
    };

    requestAnimationFrame(animate);
  }

  // devuelve el numero de la columna en la cual se coloco la ficha

  numeroColumna(canvasX) {
    const cols = this.tablero[0].map((cordenates) => cordenates);
    let num = cols.length;
    cols.forEach((col, i) => {
      const colAnt = cols[i - 1];
      if (colAnt !== undefined) {
        // si esta en el rango de la columna, devuelve el numero de la columna
        if (
          canvasX > colAnt.x - this.tamañoFigura &&
          canvasX < col.x - this.tamañoFigura
        ) {
          num = i;
        }
      }
    });
    return num - 1;
  }
}
