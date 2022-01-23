import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";
import Skeleton from "./skeleton";
import Video from "./video";
import { Color } from "@tensorflow-models/body-pix/dist/types";
import Canvas from "./canvas";
import Detector from "./detector";
import { getElementById } from "./dom_helpers";

const COLOR_CLEAR = { r: 0, g: 0, b: 0, a: 0 } as Color;
const COLOR_RED = { r: 255, g: 0, b: 0, a: 255 } as Color;
const COLOR_GREEN = { r: 0, g: 255, b: 0, a: 255 } as Color;

// effects
let freezeFrame: bodyPix.SemanticPersonSegmentation | undefined;
const cannon = [] as bodyPix.SemanticPersonSegmentation[];

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const getMask = (
  segmentation: bodyPix.SemanticPersonSegmentation,
  color = COLOR_RED
) => {
  const backgroundColor = COLOR_CLEAR;
  const drawContour = true;

  return bodyPix.toMask(segmentation, color, backgroundColor, drawContour);
};

const drawMask = (
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

const drawSkeleton = (
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

const loadAndPredict = async (
  detector: Detector,
  canvas: HTMLCanvasElement
) => {
  const segmentation = await detector.detect();
  drawMask(segmentation, canvas);
  return segmentation;
};

// the "game loop"
const onAnimationFrame = async (
  stats: Stats,
  detector: Detector,
  canvas: Canvas
) => {
  stats.begin();

  if (detector.isReady()) {
    const segmentation = await loadAndPredict(detector, canvas.el);
    canvas.loaded();
    cannon.push(segmentation);
  }

  if (freezeFrame) {
    drawSkeleton(freezeFrame, canvas);
  }

  // in seconds
  const DELAY_TIME = 1;
  // there isn't a way to retrieve from Stats, so hard code
  const FRAMES_PER_SECOND = 17;

  if (cannon.length > DELAY_TIME * FRAMES_PER_SECOND) {
    const oldSeg = cannon.shift();
    if (oldSeg) {
      drawSkeleton(oldSeg, canvas);
    }
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

  document.addEventListener("keypress", async (event) => {
    if (event.code === "Space" && detector.isReady()) {
      freezeFrame = await detector.detect();
      setTimeout(() => {
        freezeFrame = undefined;
      }, 1000);
    }
  });
};

setup();
