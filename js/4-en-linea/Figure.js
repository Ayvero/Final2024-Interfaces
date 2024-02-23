class Figure {
  constructor(posX, posY, fill, size, context, jugador) {
    this.posX = posX;
    this.posY = posY;
    this.fill = fill;
    this.size = size;
    this.context = context;
    this.borderColor = "#fff";
  }

  setFill(fill) {
    this.fill = fill;
  }

  getPosition() {
    return {
      x: this.getPosX(),
      y: this.getPosY(),
    };
  }

  getPosX() {
    return this.posX;
  }
  getPosY() {
    return this.posY;
  }
  getFill() {
    return this.fill;
  }

  draw() {
    this.context.fillStyle = this.fill;

    this.context.beginPath();
    this.context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2);
    this.context.fill();

    this.context.strokeStyle = this.borderColor;
    this.context.stroke();
  }
}

class FigureWithImage extends Figure {
  constructor(posX, posY, image, size, context, jugador, borderColor) {
    super(posX, posY, null, size, context);
    this.jugador = jugador;
    this.borderColor = borderColor;
    this.image = image;
  }

  setImage(image) {
    this.image = image;
  }

  draw() {
    this.context.save();
    this.context.beginPath();
    this.context.arc(this.posX, this.posY, this.size, 0, Math.PI * 2);
    this.context.clip();

    const aspectRatio = this.image.width / this.image.height;

    let imageWidth, imageHeight, imageX, imageY;

    if (aspectRatio >= 2) {
      imageWidth = this.size * 2;
      imageHeight = (this.size * 2) / aspectRatio;
      imageX = this.posX - this.size;
      imageY = this.posY - imageHeight / 2;
    } else {
      imageWidth = this.size * 2 * aspectRatio;
      imageHeight = this.size * 2;
      imageX = this.posX - imageWidth / 2;
      imageY = this.posY - this.size;
    }

    this.context.drawImage(this.image, imageX, imageY, imageWidth, imageHeight);
    this.context.restore();
    this.context.strokeStyle = this.borderColor;
    this.context.stroke();
  }
}
