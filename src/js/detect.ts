import * as tf from "@tensorflow/tfjs";
import Video from "./video";
import Detector from "./detector";

const setup = async () => {
  // https://www.tensorflow.org/js/guide/platform_environment#backends
  tf.setBackend("webgl");
  // https://www.tensorflow.org/js/guide/platform_environment#flags
  tf.enableProdMode();

  const videoEl = document.createElement("video");
  videoEl.autoplay = true;
  videoEl.width = 1024;
  videoEl.height = 768;
  const video = new Video(videoEl);
  // try to match output resolution
  video.setUpWebcam(videoEl.width, videoEl.height);

  const detector = new Detector(video);

  window.addEventListener("message", async () => {
    if (!detector.isReady()) {
      return;
    }

    const pose = await detector.detect();
    if (!pose) {
      return;
    }

    // TODO do this in a more type-safe way
    delete pose.segmentation.maskValueToLabel;
    window.parent.postMessage(pose, "*");
  });
};

setup();
