import { Pose } from "@tensorflow-models/pose-detection";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import { getShoulderWidth } from "../skeleton";
import Effect from "./effect";
import * as colors from "../colors";

/**
 * increases the delay on a logarithmic scale, so that there's a greater delay up front and closer together the more Cannons are added
 */
const computeDelay = (effects: Effect[]) => {
  const numExistingCannons = effects.reduce(
    (prev, effect) => (effect instanceof Cannon ? prev + 1 : prev),
    0
  );
  // the numbers are somewhat arbitrary; played around until it looked good
  return 3 * Math.log(numExistingCannons + 1) + 8;
};

export default class Cannon extends Effect {
  delay: number;
  poses: Pose[];
  color: Color;

  /**
   * used if the value can't otherwise be calculated
   */
  DEFAULT_FRAMES_PER_SECOND = 30;
  /**
   * in milliseconds since the epoch
   */
  lastFrameTime?: number;

  /** @param delay - the amount of time to wait, in seconds */
  constructor({ delay = 1, color = colors.BLACK }) {
    super();
    this.delay = delay;
    this.color = color;
    this.poses = [];
  }

  /**
   * @returns the oldest saved frame
   */
  poseToDisplay() {
    return this.poses[0];
  }

  sortVal(_currentPose: Pose) {
    const oldPose = this.poseToDisplay();
    // TODO confirm whether this race condition still exists
    if (!oldPose) {
      return null;
    }
    return getShoulderWidth(oldPose.keypoints);
  }

  computeFPS(now: number) {
    if (this.lastFrameTime) {
      const elapsed = now - this.lastFrameTime;
      return Math.round(1000 / elapsed);
    } else {
      return this.DEFAULT_FRAMES_PER_SECOND;
    }
  }

  trimPoses(now: number) {
    const numPoses = this.poses.length;
    const fps = this.computeFPS(now);
    console.log(fps);
    const framesToKeep = this.delay * fps;
    if (numPoses > framesToKeep) {
      // shorten to most recent frames
      const numToShift = numPoses - framesToKeep;
      this.poses = this.poses.slice(numToShift);
    }
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    this.poses.push(pose);

    const oldPose = this.poseToDisplay();
    drawSkeleton(oldPose, canvas, this.color);

    const now = Date.now();
    this.trimPoses(now);
    this.lastFrameTime = now;
  }

  /**
   * Adds a Cannon to the list of effects.
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    const delay = computeDelay(effects);
    const color = colors.getNext();
    const effect = new Cannon({ delay, color });
    effects.push(effect);
  }
}
