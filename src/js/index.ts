import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";
import Skeleton from "./skeleton";
import Video from "./video";
import { Color } from "@tensorflow-models/body-pix/dist/types";

const COLOR_CLEAR = { r: 0, g: 0, b: 0, a: 0 } as Color;
const COLOR_RED = { r: 255, g: 0, b: 0, a: 255 } as Color;

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const getMask = (segmentation: bodyPix.SemanticPersonSegmentation) => {
  const foregroundColor = COLOR_RED;
  const backgroundColor = COLOR_CLEAR;
  const drawContour = true;

  return bodyPix.toMask(
    segmentation,
    foregroundColor,
    backgroundColor,
    drawContour
  );
};

const drawMask = (
  segmentation: bodyPix.SemanticPersonSegmentation,
  canvas: HTMLCanvasElement
) => {
  // TODO move up to be a constant. Moved here because the size wasn't correct when at the top of the file.
  const EMPTY_BACKGROUND = new Image(canvas.clientWidth, canvas.clientHeight);

  const coloredPartImage = getMask(segmentation);
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

const drawSkeleton = (
  segmentation: bodyPix.SemanticPersonSegmentation,
  canvas: HTMLCanvasElement
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

const loadAndPredict = async (
  model: bodyPix.BodyPix,
  video: Video,
  canvas: HTMLCanvasElement
) => {
  const segmentation = await model.segmentPerson(video.el, {
    internalResolution: "medium",
    maxDetections: 1,
  });

  drawMask(segmentation, canvas);
  drawSkeleton(segmentation, canvas);
};

// the "game loop"
const onAnimationFrame = async (
  stats: Stats,
  model: bodyPix.BodyPix,
  video: Video,
  canvas: HTMLCanvasElement
) => {
  stats.begin();
  if (video.isLoaded()) {
    await loadAndPredict(model, video, canvas);
  }
  stats.end();
  // loop
  requestAnimationFrame(() => onAnimationFrame(stats, model, video, canvas));
};

const toggleWebcam = (video: Video, canvas: HTMLCanvasElement) => {
  if (document.hidden) {
    video.turnOffWebcam();
  } else {
    // try to match output resolution
    video.setUpWebcam(canvas.clientWidth, canvas.clientHeight);
  }
};

const setup = async () => {
  const video = new Video(document.getElementById("video") as HTMLVideoElement);
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const stats = new Stats();

  const model = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.5,
  });

  // only use the webcam when the window is visible
  toggleWebcam(video, canvas);
  document.addEventListener(
    "visibilitychange",
    () => toggleWebcam(video, canvas),
    false
  );

  showFPS(stats);
  onAnimationFrame(stats, model, video, canvas);
};

setup();
