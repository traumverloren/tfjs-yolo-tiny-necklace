const piCamera = require('pi-camera');
const { yolo, downloadModel } = require('../src')
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(416, 416)
const ctx = canvas.getContext('2d')
const Webcam = require('./webcam');
const webcam = new Webcam(canvas);
const path = require('path');
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyAMA0', { baudRate: 9600 });

port.write('<Serial Working!>');

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

  // boxes.forEach(box => {
  //   const {
  //     classProb, className,
  //   } = box;
  //   console.log(`${className} Confidence: ${Math.round(classProb * 100)}%`)
  // });

  // Take boxes and reduce to an object with count of objects & send to arduino as a string.
  const summary = boxes.reduce((objectsSeen, object) => {
    if (object.className in objectsSeen) {
      objectsSeen[object.className]++;
    }
    else {
      objectsSeen[object.className] = 1;
    }
    return objectsSeen;
  }, {});

  const summaryString = JSON.stringify(summary).replace(/{|}/gi,'')
  port.write(`<${summaryString}>`);
  console.log(summaryString);

  await timeout(1000);
  await run();
}
