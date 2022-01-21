import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";

const state = {
  video: document.getElementById("video") as HTMLVideoElement,
  videoLoaded: false,
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  stats: new Stats(),
};

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const drawMask = (segmentation: bodyPix.SemanticPersonSegmentation) => {
  const coloredPartImage = bodyPix.toMask(segmentation);
  const opacity = 0.7;
  const flipHorizontal = true;
  const maskBlurAmount = 0;
  // Draw the mask image on top of the original image onto a canvas.
  // The colored part image will be drawn semi-transparent, with an opacity of
  // 0.7, allowing for the original image to be visible under.
  bodyPix.drawMask(
    state.canvas,
    state.video,
    coloredPartImage,
    opacity,
    maskBlurAmount,
    flipHorizontal
  );
};

const loadAndPredict = async () => {
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.5,
  });

  const segmentation = await net.segmentPerson(state.video, {
    internalResolution: "low",
    maxDetections: 1,
  });
  drawMask(segmentation);
};

const onAnimationFrame = async () => {
  state.stats.begin();
  if (state.videoLoaded) {
    await loadAndPredict();
  }
  state.stats.end();
  // loop
  requestAnimationFrame(onAnimationFrame);
};

const setUpWebcam = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // try to match output resolution
      width: state.canvas.clientWidth,
      height: state.canvas.clientHeight,
    },
  });
  state.video.srcObject = stream;
};

const turnOffWebcam = () => {
  state.videoLoaded = false;

  const stream = state.video.srcObject as MediaStream;
  stream.getTracks().forEach((track) => track.stop());

  state.video.srcObject = null;
};

const toggleWebcam = () => {
  if (document.hidden) {
    turnOffWebcam();
  } else {
    setUpWebcam();
  }
};

// based on https://github.com/tensorflow/tfjs-models/blob/af59ff3eb3350986173ac8c8ae504806b02dad39/body-pix/demo/index.js/#L135-L137
state.video.addEventListener("loadedmetadata", () => {
  state.video.width = state.video.videoWidth;
  state.video.height = state.video.videoHeight;
});

state.video.addEventListener("loadeddata", () => {
  state.videoLoaded = true;
});

toggleWebcam();
document.addEventListener("visibilitychange", toggleWebcam, false);

showFPS(state.stats);
onAnimationFrame();
