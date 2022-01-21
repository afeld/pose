import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";
import Skeleton from "./skeleton";
import Video from "./video";

const state = {
  video: new Video(document.getElementById("video") as HTMLVideoElement),
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  stats: new Stats(),
};

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const drawMask = (segmentation: bodyPix.SemanticPersonSegmentation) => {
  const coloredPartImage = bodyPix.toMask(segmentation);
  const opacity = 1;
  const flipHorizontal = true;
  const maskBlurAmount = 0;
  // Draw the mask image on top of the original image onto a canvas.
  // The colored part image will be drawn semi-transparent, with an opacity of
  // 0.7, allowing for the original image to be visible under.
  bodyPix.drawMask(
    state.canvas,
    state.video.el,
    coloredPartImage,
    opacity,
    maskBlurAmount,
    flipHorizontal
  );
};

const drawSkeleton = (segmentation: bodyPix.SemanticPersonSegmentation) => {
  let pose = segmentation.allPoses[0];
  if (!pose) {
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
