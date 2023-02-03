import { Pose } from "@tensorflow-models/pose-detection";
import Effect, { sortEfects } from "../effects/effect";
import Canvas from "../display/canvas";
import Detector from "../poses/detector";
import {
  drawNoBluetoothWarning,
  updateBluetoothStatus,
} from "../display/bluetooth";

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

    if (pose) {
      sortEfects(pose, effects);

      // do this as late as possible
      canvas.clear();

      for (const effect of effects) {
        await effect.onAnimationFrame(pose, canvas);
      }
    }

    lastPose = pose;
  } else {
    canvas.clear();
  }

  drawNoBluetoothWarning(canvas);

  stats.end();

  // loop
  requestAnimationFrame(() =>
    onAnimationFrame(stats, detector, canvas, effects)
  );
};

// do this outside the animation loop to avoid slowing it down
setInterval(() => updateBluetoothStatus(), 1000);
