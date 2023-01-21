import * as tf from "@tensorflow/tfjs";
import Listener from "./listener";

const run = async () => {
  await tf.setBackend("webgl");

  const listener = new Listener();
  listener.onCommand((result) => window.postMessage(result));

  window.addEventListener("message", (event) => {
    switch (event.data) {
      case "start":
        listener.start();
        break;
      case "stop":
        listener.stop();
        break;
      default:
        console.error("Unknown message", event.data);
    }
  });
};

run();
