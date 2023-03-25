import * as tf from "@tensorflow/tfjs";
import Video from "./display/video";
import Canvas from "./display/canvas";
import Detector from "./poses/detector";
import { getElementById } from "./utils/dom_helpers";
import Effect from "./effects/effect";
import { actionForKeyCode } from "./controllers/actions";
import "./controllers/controls";
import { onAnimationFrame } from "./controllers/loop";
import { handleVisibilityChanges } from "./controllers/visibility";
import { setupFullscreen } from "./display/fullscreen";
import createMonitor from "./display/monitor";
import Static from "./effects/static";

const onKeyPress = (event: KeyboardEvent, effects: Effect[], video: Video) => {
  const action = actionForKeyCode(event.code);
  if (!action) {
    console.warn(`no action for key "${event.code}"`);
    return;
  }

  action.callback(effects, video);
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
  const monitor = createMonitor();
  const detector = new Detector(video);
  const effects: Effect[] = [];
  // start with static
  Static.addTo(effects);

  // kick off the video display
  onAnimationFrame(monitor, detector, canvas, effects);

  document.addEventListener("keypress", (event) =>
    onKeyPress(event, effects, video)
  );
  handleVisibilityChanges(video, canvas, effects);
  setupFullscreen(canvas);
};

setup();
