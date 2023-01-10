import Skeleton from "./skeleton";
import { Pose } from "@tensorflow-models/pose-detection";
import {
  Color,
  Segmentation,
} from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import { toBinaryMask } from "@tensorflow-models/pose-detection/dist/shared/calculators/render_util";
import Canvas from "./canvas";

/* eslint-disable @typescript-eslint/no-unused-vars */
const COLOR_CLEAR: Color = { r: 0, g: 0, b: 0, a: 0 };
const COLOR_RED: Color = { r: 255, g: 0, b: 0, a: 255 };
const COLOR_GREEN: Color = { r: 0, g: 255, b: 0, a: 255 };
/* eslint-enable @typescript-eslint/no-unused-vars */

const getMask = async (segmentation: Segmentation, color = COLOR_RED) => {
  const backgroundColor = COLOR_CLEAR;
  const drawContour = true;

  // https://github.com/tensorflow/tfjs-models/blob/master/body-segmentation/README.md#bodysegmentationtobinarymask
  const coloredPartImage = await toBinaryMask(
    segmentation,
    color,
    backgroundColor,
    drawContour
  );

  return coloredPartImage;
};

export const drawMask = async (
  segmentation: Segmentation,
  canvas: HTMLCanvasElement,
  color = COLOR_RED
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  // Render to offscreen canvas to convert the ImageData to something that can be used by drawImage(), which supports transparency. putImageData() overwrites with transparent pixels.
  // https://stackoverflow.com/a/53239232/358804

  const canvas2 = new OffscreenCanvas(canvas.clientWidth, canvas.clientHeight);
  const ctx2 = canvas2.getContext("2d");
  if (!ctx2) {
    return;
  }

  const coloredPartImage = await getMask(segmentation, color);
  ctx2.putImageData(coloredPartImage, 0, 0);

  ctx.drawImage(canvas2, 0, 0);
};

export const drawSkeleton = (pose: Pose, canvas: Canvas, color = "black") => {
  const skeleton = new Skeleton(pose, color);
  skeleton.draw(canvas);
};
