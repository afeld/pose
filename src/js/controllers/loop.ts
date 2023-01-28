import { Pose } from "@tensorflow-models/pose-detection";
import Effect, { sortEfects } from "../effects/effect";
import Canvas from "../display/canvas";
import Detector from "../poses/detector";
import Body from "../poses/body";

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

      // this ensures that the Body is only created once per frame, allowing the mask to be reused across Effects
      const body = new Body(pose);
      for (const effect of effects) {
        await effect.onAnimationFrame(body, canvas);
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
