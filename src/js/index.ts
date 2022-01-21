import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";
import Skeleton from "./skeleton";
import Video from "./video";
import { Color } from "@tensorflow-models/body-pix/dist/types";

const state = {
  video: new Video(document.getElementById("video") as HTMLVideoElement),
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  stats: new Stats(),
};

const EMPTY_BACKGROUND = new Image(
  state.canvas.clientWidth,
  state.canvas.clientHeight
);
const COLOR_CLEAR = { r: 0, g: 0, b: 0, a: 0 } as Color;
const COLOR_RED = { r: 255, g: 0, b: 0, a: 255 } as Color;

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const drawMask = (segmentation: bodyPix.SemanticPersonSegmentation) => {
  const coloredPartImage = bodyPix.toMask(
    segmentation,
    COLOR_RED,
    COLOR_CLEAR,
    true
  );

  const opacity = 1;
  const flipHorizontal = true;
  const maskBlurAmount = 0;

  bodyPix.drawMask(
    state.canvas,
    EMPTY_BACKGROUND,
    coloredPartImage,
    opacity,
    maskBlurAmount,
    flipHorizontal
  );
};

const drawSkeleton = (segmentation: bodyPix.SemanticPersonSegmentation) => {
  let pose = segmentation.allPoses[0];
  if (!pose) {
    // no people found
    return;
  }
  pose = bodyPix.flipPoseHorizontal(pose, segmentation.width);
  const skeleton = new Skeleton(pose);
  skeleton.draw(state.canvas);
};

const loadAndPredict = async () => {
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.5,
  });

  const segmentation = await net.segmentPerson(state.video.el, {
    internalResolution: "low",
    maxDetections: 1,
  });

  drawMask(segmentation);
  drawSkeleton(segmentation);
};

const onAnimationFrame = async () => {
  state.stats.begin();
  if (state.video.isLoaded()) {
    await loadAndPredict();
  }
  state.stats.end();
  // loop
  requestAnimationFrame(onAnimationFrame);
};

const toggleWebcam = () => {
  if (document.hidden) {
    state.video.turnOffWebcam();
  } else {
    // try to match output resolution
    state.video.setUpWebcam(
      state.canvas.clientWidth,
      state.canvas.clientHeight
    );
  }
};

toggleWebcam();
document.addEventListener("visibilitychange", toggleWebcam, false);

showFPS(state.stats);
onAnimationFrame();
