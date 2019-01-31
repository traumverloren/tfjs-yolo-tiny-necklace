const { box_iou } = require('./postprocess');

test('identical boxes have IoU of 1', () => {
  const box = [1,1,2,2];
  expect(box_iou(box, box)).toBe(1);
  console.log("box_iou", box_iou(box, box))
});

test('disjoint boxes have IoU of 0', () => {
  const box = [1,1,2,2];
  const box1 = [4,4,6,6];
  expect(box_iou(box, box1)).toBe(0);
  console.log("box_iou", box_iou(box, box1))
});

test('quarter overlap boxes have IoU of 1/7', () => {
  const box = [0,0,2,2];
  const box1 = [1,1,3,3];
  expect(box_iou(box, box1)).toBeCloseTo(1/7);
  console.log("box_iou", box_iou(box, box1))

});