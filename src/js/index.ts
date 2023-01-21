import * as tf from "@tensorflow/tfjs";
import Stats from "stats.js";
import Canvas from "./canvas";
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

const onDetection = async (canvas: Canvas, pose: Pose, effects: Effect[]) => {
  canvas.loaded();

  canvas.clear();
  sortEfects(pose, effects);
  for (const effect of effects) {
    await effect.onAnimationFrame(pose, canvas);
  }
};

/**
 * the "game loop"
 */
const onAnimationFrame = async (
  stats: Stats,
  detectorWindow: Window,
  canvas: Canvas,
  effects: Effect[]
) => {
  stats.begin();
  detectorWindow.postMessage("detect", "*");
  stats.end();

  // loop
  requestAnimationFrame(() =>
    onAnimationFrame(stats, detectorWindow, canvas, effects)
  );
};

/**
 * avoid being creepy by only watching+listening when the window is visible
 */
const onVisibilityChange = (
  canvas: Canvas,
  listenerController: ListenerController
) => {
  if (document.hidden) {
    listenerController.stop();
  } else {
    listenerController.startIfAllowed();
  }
};

/**
 * only use the webcam when the window is visible
 */
const handleVisibilityChanges = (canvas: Canvas, effects: Effect[]) => {
  const listenerController = new ListenerController(effects);

  onVisibilityChange(canvas, listenerController);
  document.addEventListener(
    "visibilitychange",
    () => onVisibilityChange(canvas, listenerController),
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
  const stats = new Stats();

  const detectorIFrame = getElementById("detect") as HTMLIFrameElement;
  const detectorWindow = detectorIFrame.contentWindow;
  if (!detectorWindow) {
    throw new Error("no detectorWindow");
  }
  window.addEventListener("message", async (event) => {
    const pose = event.data as Pose;
    // https://github.com/tensorflow/tfjs-models/blob/4e8fa791175b9f637cbecdbc579ab71d3f35e48c/pose-detection/src/blazepose_mediapipe/detector.ts/#L48-L51
    pose.segmentation.maskValueToLabel = () => "person";

    onDetection(canvas, event.data, effects);
  });

  const effects: Effect[] = [];
  // start with a Shadow
  Shadow.addTo(effects);

  // kick off the video display
  onAnimationFrame(stats, detectorWindow, canvas, effects);

  document.addEventListener("keypress", (event) => onKeyPress(event, effects));
  handleVisibilityChanges(canvas, effects);
  showFPS(stats);

  const actionsTable = querySelector(
    "#actions tbody"
  ) as HTMLTableSectionElement;
  generateActionHelp(actionsTable);
};

setup();
