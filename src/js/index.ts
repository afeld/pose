import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";

const video = document.getElementById("video") as HTMLVideoElement;
let videoLoaded = false;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const stats = new Stats();

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
    canvas,
    video,
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

  const segmentation = await net.segmentPerson(video, {
    internalResolution: "low",
    maxDetections: 1,
  });
  drawMask(segmentation);
};

const onAnimationFrame = async () => {
  stats.begin();
  if (videoLoaded) {
    await loadAndPredict();
  }
  stats.end();
  // loop
  requestAnimationFrame(onAnimationFrame);
};

const setUpWebcam = async (video: HTMLVideoElement) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // try to match output resolution
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    },
  });
  video.srcObject = stream;
};

const turnOffWebcam = (video: HTMLVideoElement) => {
  videoLoaded = false;

  const stream = video.srcObject as MediaStream;
  stream.getTracks().forEach((track) => track.stop());

  video.srcObject = null;
};

const toggleWebcam = () => {
  if (document.hidden) {
    turnOffWebcam(video);
  } else {
    setUpWebcam(video);
  }
};

// based on https://github.com/tensorflow/tfjs-models/blob/af59ff3eb3350986173ac8c8ae504806b02dad39/body-pix/demo/index.js/#L135-L137
video.addEventListener("loadedmetadata", () => {
  video.width = video.videoWidth;
  video.height = video.videoHeight;
  videoLoaded = true;
});

toggleWebcam();
document.addEventListener("visibilitychange", toggleWebcam, false);

showFPS(stats);
onAnimationFrame();
