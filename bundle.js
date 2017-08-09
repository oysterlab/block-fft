(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var centerX = void 0,
    centerY = void 0,
    blockWidth = void 0,
    blockHeight = void 0;

var soundFile = void 0,
    fft = void 0,
    filter = void 0;

var options = {
  blockRowCount: 16,
  blockWidth: 40,
  blockHeight: 20,
  baseBlockHeight: 20,
  amp: 0.3
};

function controller() {
  var gui = new dat.GUI();
  gui.add(options, 'blockRowCount');
  gui.add(options, 'blockWidth');
  gui.add(options, 'blockHeight');
  gui.add(options, 'baseBlockHeight');
  var control = gui.add(options, 'amp');
  dat.gui.GUI.toggleHide();

  window.addEventListener('keydown', function (e) {
    if (e.key == 'c') dat.gui.GUI.toggleHide();
  });
}

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('sample/sample');
}

function setup() {
  controller();
  createCanvas(windowWidth, windowHeight);
  soundFile.loop();

  filter = new p5.LowPass();

  updateCanvasSize(windowWidth, windowHeight);

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
  // blockWidth = map(windowWidth, 200, 1024, options.blockWidth * 0.5, options.blockWidth)
  // blockHeight = map(windowWidth, 200, 1024, options.blockHeight * 0.5, options.blockHeight)
}

function draw() {
  background(255);
  var blockRowCount = options.blockRowCount,
      blockWidth = options.blockWidth,
      blockHeight = options.blockHeight,
      baseBlockHeight = options.baseBlockHeight,
      amp = options.amp;


  var spectrum = fft.analyze();

  var width = blockWidth;
  var height = blockHeight;

  var size = blockRowCount;
  translate(centerX, centerY);
  for (var y = 0; y < size; y++) {
    var rc = y < size * 0.5 ? y + 1 : size - y - 1;

    var yi = y - size * 0.5;
    for (var x = 0; x < rc; x++) {
      push();

      var xi = x - rc * 0.5;
      translate(width * xi, height * 0.5 * yi);
      var h = -baseBlockHeight + spectrum[x + y * size] * amp;
      var z = 0;

      //top
      fill(255);
      beginShape();
      vertex(0, 0 - h);
      vertex(width / 2, height / 2 - h);
      vertex(0, height - h);
      vertex(-width / 2, height / 2 - h);
      endShape(CLOSE);

      //left
      fill(245);
      beginShape();
      vertex(-width / 2, height / 2 - h);
      vertex(0, height - h);
      vertex(0, 2 * height);
      vertex(-width / 2, height + height / 2);
      endShape(CLOSE);

      //right
      fill(235);
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

},{}]},{},[1]);
