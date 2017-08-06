let centerX, centerY, blockWidth, blockHeight;

let soundFile, fft, filter;
function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('sample/sample')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  soundFile.loop();

  filter = new p5.LowPass();

  updateCanvasSize(windowWidth, windowHeight)

  soundFile.disconnect();
  soundFile.connect(filter);
  fft = new p5.FFT();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateCanvasSize(windowWidth, windowHeight);
}

function updateCanvasSize(windowWidth, windowHeight) {

  centerX = windowWidth * 0.5;
  centerY = windowHeight * 0.5;
  blockWidth = map(windowWidth, 200, 1024, 20, 40)
  blockHeight = map(windowWidth, 200, 1024, 20, 20)
}

function draw() {
  background(255);

  const spectrum = fft.analyze();

  const width = blockWidth;
  const height = blockHeight;

  const size = 16
  translate(centerX, centerY);
  for(let y = 0; y < size; y++) {
    const rc = (y < size * 0.5) ? y + 1 : size - y - 1;

    const yi = y - size * 0.5;
    for(let x = 0; x < rc; x++) {
      push();

      const xi = x - rc * 0.5;
      translate(width * xi, height * 0.5 * yi);
      let h = spectrum[(x + y * size)] * 0.2
      let z = 0;

      //top
      fill(255);
      beginShape();
      vertex(0, 0 - h);
      vertex(width / 2, height / 2 - h);
      vertex(0, height - h);
      vertex(-width / 2, height / 2 - h);
      endShape(CLOSE);

      //left
      fill(240);
      beginShape();
      vertex(-width / 2, height / 2 - h);
      vertex(0, height - h);
      vertex(0, 2 * height);
      vertex(-width / 2, height + height / 2);
      endShape(CLOSE);

      //right
      fill(220);
      beginShape();
      vertex(width / 2, height / 2 - h);
      vertex(0, height - h);
      vertex(0, 2 * height);
      vertex(width / 2, height + height / 2);
      endShape(CLOSE);

      pop();

      noStroke();
    }
  }
}
