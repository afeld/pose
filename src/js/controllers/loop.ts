import { Pose } from "@tensorflow-models/pose-detection";
import Effect, { sortEfects } from "../effects/effect";
import Canvas from "../display/canvas";
import Detector from "../poses/detector";

let lastPose: Pose | undefined;

/**
 * the "game loop"
 */
export const onAnimationFrame = async (
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
