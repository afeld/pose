import "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

const img = document.getElementById("image") as HTMLImageElement;
const video = document.getElementById("video") as HTMLVideoElement;

async function loadAndPredict() {
  const net = await bodyPix.load();

  const segmentation = await net.segmentPerson(img);
  console.log(segmentation);
}
loadAndPredict();

const setUpWebcam = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
};
setUpWebcam();
