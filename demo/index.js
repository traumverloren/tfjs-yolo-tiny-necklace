const piCamera = require('pi-camera');
const { yolo, downloadModel } = require('../src')
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(416, 416)
const webcam = new Webcam(canvas);
const ctx = canvas.getContext('2d')
const Webcam = require('./webcam');
const path = require('path');
let model;

const myCamera = new piCamera({
  mode: 'photo',
  output: `${ __dirname }/test.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

(async function main() {
  try {
    model = await downloadModel();
    run();
  } catch(e) {
    console.error(e);
  }
})();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  // Take a picture
  await myCamera.snap()

  // Load the picture
  const image = await loadImage(path.resolve(__dirname, './test.jpg'))

  // model is expecting 416x416 image
  ctx.drawImage(image, 0, 0, 416, 416)

  const inputImage = webcam.capture();
  const t0 = Date.now();
  const boxes = await yolo(inputImage, model);

  inputImage.dispose();

  const t1 = Date.now();
  console.log("YOLO inference took " + (t1 - t0) + " milliseconds.");
  // console.log(boxes)
  boxes.forEach(box => {
    const {
      classProb, className,
    } = box;

    console.log(`${className} Confidence: ${Math.round(classProb * 100)}%`)
  });

  await timeout(1000);
  await run();
}
