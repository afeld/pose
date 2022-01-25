import "@tensorflow/tfjs";
import Stats from "stats.js";
import Video from "./video";
import Canvas from "./canvas";
import Detector from "./detector";
import { getElementById } from "./dom_helpers";
import { drawMask } from "./segment_helpers";
import Cannon from "./effects/cannon";
import Freeze from "./effects/freeze";
import Effect from "./effects/effect";
import Listener from "./listener";

const actions = [
  {
    keycode: "KeyC",
    // handle both spellings
    commands: [
      "cannon",
      "canon",
      "start cannon",
      "start canon",
      "add cannon",
      "add canon",
    ],
    callback: (effects: Effect[]) => {
      addCannon(effects);
    },
  },
];

const showFPS = (stats: Stats) => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};

const loadAndPredict = async (
  detector: Detector,
  canvas: HTMLCanvasElement
) => {
  const segmentation = await detector.detect();
  drawMask(segmentation, canvas);
  return segmentation;
};

// the "game loop"
const onAnimationFrame = async (
  stats: Stats,
  detector: Detector,
  canvas: Canvas,
  effects: Effect[]
) => {
  stats.begin();

  if (detector.isReady()) {
    const segmentation = await loadAndPredict(detector, canvas.el);
    canvas.loaded();

    effects.forEach((effect) => effect.onAnimationFrame(segmentation, canvas));
  }

  stats.end();

  // loop
  requestAnimationFrame(() =>
    onAnimationFrame(stats, detector, canvas, effects)
  );
};

// avoid being creepy by only watching+listening when the window is visible
const onVisibilityChange = (
  video: Video,
  canvas: Canvas,
  listener: Listener
) => {
  if (document.hidden) {
    video.turnOffWebcam();
    listener.stop();
  } else {
    // try to match output resolution
    video.setUpWebcam(canvas.width(), canvas.height());

    listener.start();
  }
};

/**
 * Adds a Cannon to the list of effects, delaying by one more second each time.
 * @param effects - gets modified
 */
const addCannon = (effects: Effect[]) => {
  // increase the delay by one for each added
  const numCannons = effects.reduce(
    (prev, effect) => (effect instanceof Cannon ? prev + 1 : prev),
    0
  );
  const delay = numCannons + 1;
  const effect = new Cannon(delay);
  effects.push(effect);
};

const onVoiceCommand = (effects: Effect[], command: string) => {
  console.log("command:", command);

  const action = actions.find((action) => action.commands.includes(command));
  if (!action) {
    console.warn(`command "${command}" not found`);
    return;
  }
  action.callback(effects);
};

const setup = async () => {
  const canvasEl = getElementById("canvas") as HTMLCanvasElement;
  const loadingIndicator = getElementById("loading");
  const canvas = new Canvas(canvasEl, loadingIndicator);

  const video = Video.matchCanvas(canvas);
  const stats = new Stats();
  const detector = new Detector(video);
  const effects = [new Freeze()];

  document.addEventListener("keypress", (event) => {
    const action = actions.find((action) => action.keycode === event.code);
    if (!action) {
      console.warn(`no action for key "${event.code}"`);
      return;
    }

    action.callback(effects);
  });

  const allCommands = actions.map((action) => action.commands).flat();
  const listener = new Listener(allCommands);
  listener.onCommand((command) => onVoiceCommand(effects, command));

  // only use the webcam when the window is visible
  onVisibilityChange(video, canvas, listener);
  document.addEventListener(
    "visibilitychange",
    () => onVisibilityChange(video, canvas, listener),
    false
  );

  showFPS(stats);
  onAnimationFrame(stats, detector, canvas, effects);
};

setup();
