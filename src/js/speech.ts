import * as tf from "@tensorflow/tfjs";
import Listener from "./listener";

const run = async () => {
  await tf.setBackend("webgl");

  const listener = new Listener();
  listener.onCommand((result) => console.log(result));
  listener.start();
};

run();
