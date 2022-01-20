import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

const video = document.getElementById("video") as HTMLVideoElement;

const loadAndPredict = async () => {
  const net = await bodyPix.load();

  const segmentation = await net.segmentPerson(video);
  console.log(segmentation);

  // loop
  requestAnimationFrame(loadAndPredict);
};

const setUpWebcam = async () => {
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

setUpWebcam();
