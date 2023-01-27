import { Pose } from "@tensorflow-models/pose-detection";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "../canvas";
import { MaxSizeQueue } from "../queue";
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
  return 4 * Math.log(numExistingCannons + 1) + 6;
};

export default class Cannon extends Effect {
  delay: number;
  poses: MaxSizeQueue<Pose>;
  color: Color;

  // there isn't a way to retrieve from Stats, so hard code
  // TODO calculate this based on the time since the last call to onAnimationFrame()
  FRAMES_PER_SECOND = 63;

  /** @param delay - the amount of time to wait, in seconds */
  constructor({ delay = 1, color = colors.BLACK }) {
    super();
    this.delay = delay;
    this.color = color;

    const framesToKeep = this.delay * this.FRAMES_PER_SECOND;
    this.poses = new MaxSizeQueue<Pose>(framesToKeep);
  }

  /**
   * @returns the oldest saved frame
   */
  poseToDisplay() {
    return this.poses.peek();
  }

  sortVal(_currentPose: Pose) {
    const oldPose = this.poseToDisplay();
    // TODO confirm whether this race condition still exists
    if (!oldPose) {
      return null;
    }
    return getShoulderWidth(oldPose.keypoints);
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    this.poses.push(pose);

    const oldPose = this.poseToDisplay();
    drawSkeleton(oldPose, canvas, this.color);
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
