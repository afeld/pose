import * as tf from "@tensorflow/tfjs";
import Stats from "stats.js";
import Video from "./video";
import Canvas from "./canvas";
import Detector from "./detector";
import { getElementById, querySelector } from "./dom_helpers";
import Effect from "./effects/effect";
import { actionForKeyCode, generateActionHelp } from "./actions";
import ListenerController from "./listener_controller";
import Shadow from "./effects/shadow";
import { Pose } from "@tensorflow-models/pose-detection";
import "./controls";

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

/**
 * @param effects gets modified
 */
const sortEfects = (currentPose: Pose, effects: Effect[]) => {
  effects.sort((a, b) => {
    const aVal = a.sortVal(currentPose);
    const bVal = b.sortVal(currentPose);

    if (aVal && bVal) {
      if (aVal < bVal) {
        return -1;
      }
      if (aVal > bVal) {
        return 1;
      }
    }
    // a must be equal to b, or one doesn't have a sortVal()
    return 0;
  });
};

let lastPose: Pose | undefined;

/**
 * the "game loop"
 */
const onAnimationFrame = async (
  stats: Stats,
  detector: Detector,
  canvas: Canvas,
  effects: Effect[]
) => {
  stats.begin();

  if (detector.isReady()) {
    let pose = await detector.detect();
    // if no current pose is detected, use the last one to avoid flickering
    if (!pose) {
      pose = lastPose;
    }

    canvas.loaded();

    canvas.clear();
    if (pose) {
      sortEfects(pose, effects);
      for (const effect of effects) {
        await effect.onAnimationFrame(pose, canvas);
      }
    }

    lastPose = pose;
  }

  stats.end();

  // loop
  requestAnimationFrame(() =>
    onAnimationFrame(stats, detector, canvas, effects)
  );
};

/**
 * avoid being creepy by only watching+listening when the window is visible
 */
const onVisibilityChange = (
  video: Video,
  canvas: Canvas,
  listenerController: ListenerController
) => {
  if (document.hidden) {
    video.turnOffWebcam();
    listenerController.stop();
  } else {
    // try to match output resolution
    video.setUpWebcam(canvas.width(), canvas.height());

    listenerController.startIfAllowed();
  }
};

/**
 * only use the webcam when the window is visible
 */
const handleVisibilityChanges = (
  video: Video,
  canvas: Canvas,
  effects: Effect[]
) => {
  const listenerController = new ListenerController(effects);

  onVisibilityChange(video, canvas, listenerController);
  document.addEventListener(
    "visibilitychange",
    () => onVisibilityChange(video, canvas, listenerController),
    false
  );
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
  showFPS(stats);

  const actionsTable = querySelector(
    "#actions tbody"
  ) as HTMLTableSectionElement;
  generateActionHelp(actionsTable);
};

setup();
