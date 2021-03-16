// https://codepen.io/DonKarlssonSan/pen/RwRJZqO?editors=0010

class CirclePattern {
  constructor(element, options) {
    const defaults = {
      radius: 50,
    };

    this.canvas = element;
    this.context = this.canvas.getContext("2d");
    this.options = Object.assign(this, defaults, options);

    this.resize();
    this.addEventListeners();
    this.update();
  }

  resize() {
    const { innerHeight, innerWidth } = window;

    this.width = innerWidth;
    this.height = innerHeight;

    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.resize());
  }

  drawCircle(x, y, radius, angle) {
    this.context.save();

    this.context.translate(x, y);
    this.context.rotate(angle);
    this.context.beginPath();
    this.context.arc(0, 0, radius, 0, Math.PI, true);
    this.context.stroke();

    this.context.restore();
  }

  drawCircles() {
    const cols = Math.round(this.width / this.radius / 2) + 1;
    const rows = Math.round(this.height / this.radius) + 2;

    for (let col = 0; col < cols; col += 1) {
      const angle = Math.PI * (col % 2);

      for (let row = 0; row < rows; row += 1) {
        const angle2 = angle + (Math.PI / 2) * (row % 4);
        const xOffset = (row % 2) * this.radius;

        const x = col * this.radius * 2 + xOffset;
        const y = row * this.radius;

        this.drawCircle(x, y, this.radius, angle2);
      }
    }
  }

  render() {
    this.drawCircles();
  }

  update() {
    const { height, width } = this;

    this.context.clearRect(0, 0, width, height);
    this.render();

    requestAnimationFrame(() => this.update());
  }
}

const circlePattern = new CirclePattern(document.querySelector(".js-canvas"));
const gui = new dat.GUI();

gui.add(circlePattern.options, "radius").min(10).max(100).step(1);
