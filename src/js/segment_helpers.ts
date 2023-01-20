import Skeleton from "./skeleton";
import { Pose } from "@tensorflow-models/pose-detection";
import {
  Color,
  Segmentation,
} from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "./canvas";

/* eslint-disable @typescript-eslint/no-unused-vars */
const COLOR_CLEAR: Color = { r: 0, g: 0, b: 0, a: 0 };
const COLOR_RED: Color = { r: 255, g: 0, b: 0, a: 255 };
const COLOR_GREEN: Color = { r: 0, g: 255, b: 0, a: 255 };
/* eslint-enable @typescript-eslint/no-unused-vars */

const scriptUrl = new URL("segment.worker.ts", import.meta.url);
const worker = new Worker(scriptUrl);

const getMask = async (segmentation: Segmentation, color = COLOR_RED) => {
  const backgroundColor = COLOR_CLEAR;
  const drawContour = true;

  const promise = new Promise<ImageData>((resolve, reject) => {
    worker.onmessage = (e) => resolve(e.data);
    worker.postMessage({
      segmentation,
      color,
      backgroundColor,
      drawContour,
    });
  });

  return promise;
};

const drawImageDataWithTransparency = (
  canvas: Canvas,
  imageData: ImageData
) => {
  const ctx = canvas.context();

  // Render to offscreen canvas to convert the ImageData to something that can be used by drawImage(), which supports transparency. putImageData() overwrites with transparent pixels.
  // https://stackoverflow.com/a/53239232/358804

  const canvas2 = new OffscreenCanvas(canvas.width(), canvas.height());
  const ctx2 = canvas2.getContext("2d");
  if (!ctx2) {
    return;
  }

  ctx2.putImageData(imageData, 0, 0);
  ctx.drawImage(canvas2, 0, 0);
};

export const drawMask = async (
  segmentation: Segmentation,
  canvas: Canvas,
  color = COLOR_RED
) => {
  const coloredPartImage = await getMask(segmentation, color);
  drawImageDataWithTransparency(canvas, coloredPartImage);
};

export const drawSkeleton = (pose: Pose, canvas: Canvas, color = "black") => {
  const skeleton = new Skeleton(pose, color);
  skeleton.draw(canvas);
};
