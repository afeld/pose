import * as tf from "@tensorflow/tfjs";
import Stats from "stats.js";
import Video from "./video";
import Canvas from "./canvas";
import Detector from "./detector";
import { getElementById } from "./dom_helpers";
import Effect from "./effects/effect";
import { actionForKeyCode } from "./actions";
import Shadow from "./effects/shadow";
import "./controls";
import { onAnimationFrame } from "./loop";
import { handleVisibilityChanges } from "./visibility";
import { setupFullscreen } from "./fullscreen";

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const onPageError = (event: ErrorEvent, detector: Detector) => {
  const error = event.error as Error;
  if (event.filename.includes("wasm") && error.name === "RuntimeError") {
    // For some reason, a WASM error happens in the pose detection sometimes, which stops it. Restart it.
    console.warn("WASM error, restarting pose detection");
    detector.reset();
  }
};

const onKeyPress = (event: KeyboardEvent, effects: Effect[]) => {
  const action = actionForKeyCode(event.code);
  if (!action) {
    console.warn(`no action for key "${event.code}"`);
    return;
  }

  action.callback(effects);
};

const createCanvas = () => {
  const canvasEl = getElementById("canvas") as HTMLCanvasElement;
  const loadingIndicator = getElementById("loading");
  return new Canvas(canvasEl, loadingIndicator);
};

const setup = async () => {
  // https://www.tensorflow.org/js/guide/platform_environment#backends
  tf.setBackend("webgl");
  // https://www.tensorflow.org/js/guide/platform_environment#flags
  tf.enableProdMode();

  const canvas = createCanvas();
  const video = Video.matchCanvas(canvas);
  const stats = new Stats();
  const detector = new Detector(video);
  const effects: Effect[] = [];
  // start with a Shadow
  Shadow.addTo(effects);

  window.addEventListener("error", (event) => {
    onPageError(event, detector);
  });

  // kick off the video display
  onAnimationFrame(stats, detector, canvas, effects);

  document.addEventListener("keypress", (event) => onKeyPress(event, effects));
  handleVisibilityChanges(video, canvas, effects);
  setupFullscreen(canvas);
  showFPS(stats);
};

setup();
