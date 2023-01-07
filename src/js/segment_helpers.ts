import Skeleton from "./skeleton";
import { Pose } from "@tensorflow-models/pose-detection";
import {
  Color,
  Segmentation,
} from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import {
  drawMask as drawMaskUtil,
  toBinaryMask,
} from "@tensorflow-models/pose-detection/dist/shared/calculators/render_util";
import Canvas from "./canvas";

/* eslint-disable @typescript-eslint/no-unused-vars */
const COLOR_CLEAR = { r: 0, g: 0, b: 0, a: 0 } as Color;
const COLOR_RED = { r: 255, g: 0, b: 0, a: 255 } as Color;
const COLOR_GREEN = { r: 0, g: 255, b: 0, a: 255 } as Color;
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
  // TODO move up to be a constant. Moved here because the size wasn't correct when at the top of the file.
  const EMPTY_BACKGROUND = new Image(canvas.clientWidth, canvas.clientHeight);

  const coloredPartImage = await getMask(segmentation, color);
  const opacity = 1;
  const maskBlurAmount = 0;

  await drawMaskUtil(
    canvas,
    EMPTY_BACKGROUND,
    coloredPartImage,
    opacity,
    maskBlurAmount
  );
};

export const drawSkeleton = (
  pose: Pose,
  canvas: Canvas,
  { color = "black", strokeWidth = 6 }
) => {
  const skeleton = new Skeleton(pose, { color, strokeWidth });
  skeleton.draw(canvas);
};
