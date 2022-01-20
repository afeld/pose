import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Stats from "stats.js";

const video = document.getElementById("video") as HTMLVideoElement;
const stats = new Stats();

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const loadAndPredict = async () => {
  stats.begin();

  const net = await bodyPix.load();

  const segmentation = await net.segmentPerson(video);
  console.log(segmentation);

  stats.end();

  // loop
  requestAnimationFrame(loadAndPredict);
};

const setUpWebcam = async (video: HTMLVideoElement) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // try to match output resolution
      width: video.clientWidth,
      height: video.clientHeight,
    },
  });
  video.srcObject = stream;
};

video.addEventListener("loadeddata", () => {
  requestAnimationFrame(loadAndPredict);
});
setUpWebcam(video);

showFPS(stats);
