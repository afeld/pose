import Skeleton from "./skeleton";
import { Color } from "@tensorflow-models/body-pix/dist/types";
import * as bodyPix from "@tensorflow-models/body-pix";
import Canvas from "./canvas";

const COLOR_CLEAR = { r: 0, g: 0, b: 0, a: 0 } as Color;
const COLOR_RED = { r: 255, g: 0, b: 0, a: 255 } as Color;
const COLOR_GREEN = { r: 0, g: 255, b: 0, a: 255 } as Color;

const getMask = (
  segmentation: bodyPix.SemanticPersonSegmentation,
  color = COLOR_RED
) => {
  const backgroundColor = COLOR_CLEAR;
  const drawContour = true;

  return bodyPix.toMask(segmentation, color, backgroundColor, drawContour);
};

export const drawMask = (
  segmentation: bodyPix.SemanticPersonSegmentation,
  canvas: HTMLCanvasElement,
  color = COLOR_RED
) => {
  // TODO move up to be a constant. Moved here because the size wasn't correct when at the top of the file.
  const EMPTY_BACKGROUND = new Image(canvas.clientWidth, canvas.clientHeight);

  const coloredPartImage = getMask(segmentation, color);
  const opacity = 1;
  const flipHorizontal = true;
  const maskBlurAmount = 0;

  bodyPix.drawMask(
    canvas,
    EMPTY_BACKGROUND,
    coloredPartImage,
    opacity,
    maskBlurAmount,
    flipHorizontal
  );
};

export const drawSkeleton = (
  segmentation: bodyPix.SemanticPersonSegmentation,
  canvas: Canvas
) => {
  let pose = segmentation.allPoses[0];
  if (!pose) {
    // no people found
    return;
  }
  pose = bodyPix.flipPoseHorizontal(pose, segmentation.width);
  const skeleton = new Skeleton(pose);
  skeleton.draw(canvas);
};
