import { Pose } from "@tensorflow-models/pose-detection";
import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import Canvas from "../display/canvas";
import { MaxSizeQueue } from "../utils/queue";
import { getShoulderWidth } from "../utils/math";
import Effect from "./effect";
import * as colors from "../utils/colors";
import { drawMask } from "../utils/segment_helpers";
import Body from "../poses/body";

/**
 * increases the delay on a logarithmic scale, so that there's a greater delay up front and closer together the more Cannons are added
 */
const computeDelay = (effects: Effect[]) => {
  const numExistingCannons = effects.reduce(
    (prev, effect) => (effect instanceof Cannon ? prev + 1 : prev),
    0
  );
  // the numbers are somewhat arbitrary; played around until it looked good
  return 2 * Math.log(numExistingCannons + 1) + 6;
};

export default class Cannon extends Effect {
  delay: number;
  bodies: MaxSizeQueue<Body>;
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
    this.bodies = new MaxSizeQueue<Body>(framesToKeep);
  }

  /**
   * @returns the oldest saved frame
   */
  bodyToDisplay() {
    return this.bodies.peek();
  }

  sortVal(_currentPose: Pose) {
    const oldBody = this.bodyToDisplay();
    // TODO confirm whether this race condition still exists
    if (!oldBody) {
      return null;
    }
    return getShoulderWidth(oldBody.pose.keypoints);
  }

  async onAnimationFrame(body: Body, canvas: Canvas) {
    this.bodies.push(body);

    const oldBody = this.bodyToDisplay();
    await drawMask(oldBody, canvas, this.color);
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
