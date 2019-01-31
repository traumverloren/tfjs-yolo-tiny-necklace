const tf = require('@tensorflow/tfjs-node');
const { yolo, downloadModel } = require('../src')
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(416, 416)
const ctx = canvas.getContext('2d')
const Webcam = require('./webcam');
const path = require('path');
let model;

(async function main() {
  try {
    model = await downloadModel();

    // Draw cat with lime helmet
    await loadImage(path.resolve(__dirname, './people.jpeg')).then((image) => {
      ctx.drawImage(image, 0, 0, 416, 416)
    })

    const webcam = new Webcam(canvas);

    run(webcam);
  } catch(e) {
    console.error(e);
  }
})();

async function run(webcam) {
  const inputImage = webcam.capture();
  const t0 = Date.now();
  const boxes = await yolo(inputImage, model);

  inputImage.dispose();

  const t1 = Date.now();
  console.log("YOLO inference took " + (t1 - t0) + " milliseconds.");
  console.log('tf.memory(): ', tf.memory());
  console.log(boxes)
  boxes.forEach(box => {
    const {
      classProb, className,
    } = box;

    console.log(`${className} Confidence: ${Math.round(classProb * 100)}%`)
  });
}
