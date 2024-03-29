import { Pose } from "@tensorflow-models/pose-detection";
import Effect, { sortEfects } from "../effects/effect";
import Canvas from "../display/canvas";
import Detector from "../poses/detector";
import {
  drawNoBluetoothWarning,
  updateBluetoothStatus,
} from "../display/bluetooth";
import { Monitor } from "../display/monitor";

let lastPose: Pose | undefined;

/**
 * the "game loop"
 */
export const onAnimationFrame = async (
  monitor: Monitor,
  detector: Detector,
  canvas: Canvas,
  effects: Effect[]
) => {
  monitor.stats.begin();

  if (detector.isReady()) {
    let pose: Pose | undefined;
    try {
      pose = await detector.detect();
    } catch (error) {
      // For some reason, a WASM error happens in the pose detection sometimes, which stops it. Restart it.
      console.warn("WASM error, restarting pose detection");
      console.warn(error);
      detector.reset();
    }

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

  monitor.stats.end();

  // loop
  requestAnimationFrame(() =>
    onAnimationFrame(monitor, detector, canvas, effects)
  );
};

// do this outside the animation loop to avoid slowing it down
setInterval(() => updateBluetoothStatus(), 1000);
