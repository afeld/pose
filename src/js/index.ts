import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";
import Skeleton from "./skeleton";
import Video from "./video";
import { Color } from "@tensorflow-models/body-pix/dist/types";
import Canvas from "./canvas";
import Detector from "./detector";

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
  detector: Detector,
  canvas: HTMLCanvasElement
) => {
  const segmentation = await detector.detect();
  drawMask(segmentation, canvas);
  drawSkeleton(segmentation, canvas);
};

// the "game loop"
const onAnimationFrame = async (
  stats: Stats,
  detector: Detector,
  canvas: Canvas
) => {
  stats.begin();

  if (detector.isReady()) {
    await loadAndPredict(detector, canvas.el);
    canvas.loaded();
  }

  stats.end();

  // loop
  requestAnimationFrame(() => onAnimationFrame(stats, detector, canvas));
};

const toggleWebcam = (video: Video, canvas: Canvas) => {
  if (document.hidden) {
    video.turnOffWebcam();
  } else {
    // try to match output resolution
    video.setUpWebcam(canvas.width(), canvas.height());
  }
};

const getElementById = (selector: string) => {
  const el = document.getElementById(selector);
  if (!el) {
    throw new Error(`Element '${el}' not found`);
  }
  return el;
};

const setup = async () => {
  const canvasEl = getElementById("canvas") as HTMLCanvasElement;
  const loadingIndicator = getElementById("loading");
  const canvas = new Canvas(canvasEl, loadingIndicator);
  const video = Video.matchCanvas(canvas);
  const stats = new Stats();
  const detector = new Detector(video);

  // only use the webcam when the window is visible
  toggleWebcam(video, canvas);
  document.addEventListener(
    "visibilitychange",
    () => toggleWebcam(video, canvas),
    false
  );

  showFPS(stats);
  onAnimationFrame(stats, detector, canvas);
};

setup();
