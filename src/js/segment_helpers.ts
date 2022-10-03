import Skeleton from "./skeleton";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import { toMask } from "@tensorflow-models/body-segmentation/dist/body_pix/impl";
import {
  Color,
  SemanticPersonSegmentation,
} from "@tensorflow-models/body-segmentation/dist/body_pix/impl/types";
import Canvas from "./canvas";

const COLOR_CLEAR = { r: 0, g: 0, b: 0, a: 0 } as Color;
const COLOR_RED = { r: 255, g: 0, b: 0, a: 255 } as Color;
const COLOR_GREEN = { r: 0, g: 255, b: 0, a: 255 } as Color;

const getMask = (
  segmentation: SemanticPersonSegmentation,
  color = COLOR_RED
) => {
  const backgroundColor = COLOR_CLEAR;
  const drawContour = true;

  return toMask(segmentation, color, backgroundColor, drawContour);
};

export const drawMask = (
  segmentation: SemanticPersonSegmentation,
  canvas: HTMLCanvasElement,
  color = COLOR_RED
) => {
  // TODO move up to be a constant. Moved here because the size wasn't correct when at the top of the file.
  const EMPTY_BACKGROUND = new Image(canvas.clientWidth, canvas.clientHeight);

  const coloredPartImage = getMask(segmentation, color);
  const opacity = 1;
  const flipHorizontal = true;
  const maskBlurAmount = 0;

  bodySegmentation.drawMask(
    canvas,
    EMPTY_BACKGROUND,
    coloredPartImage,
    opacity,
    maskBlurAmount,
    flipHorizontal
  );
};

export const drawSkeleton = (
  segmentation: SemanticPersonSegmentation,
  canvas: Canvas
) => {
  let pose = segmentation.allPoses[0];
  if (!pose) {
    // no people found
    return;
  }
  // TODO replace
  // pose = bodySegmentation.flipPoseHorizontal(pose, segmentation.width);
  const skeleton = new Skeleton(pose);
  skeleton.draw(canvas);
};
