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

const toggleWebcam = (video: Video, canvas: Canvas) => {
  if (document.hidden) {
    video.turnOffWebcam();
  } else {
    // try to match output resolution
    video.setUpWebcam(canvas.width(), canvas.height());
  }
};

const setup = async () => {
  const canvasEl = getElementById("canvas") as HTMLCanvasElement;
  const loadingIndicator = getElementById("loading");
  const canvas = new Canvas(canvasEl, loadingIndicator);
  const video = Video.matchCanvas(canvas);
  const stats = new Stats();
  const detector = new Detector(video);
  const effects = [new Cannon(), new Freeze()];

  // only use the webcam when the window is visible
  toggleWebcam(video, canvas);
  document.addEventListener(
    "visibilitychange",
    () => toggleWebcam(video, canvas),
    false
  );

  showFPS(stats);
  onAnimationFrame(stats, detector, canvas, effects);
};

setup();
