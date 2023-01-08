import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import { getShoulderWidth } from "../skeleton";
import Effect from "./effect";

const COLORS = ["black", "fuchsia", "green", "purple"];

const getColor = (effectIndex: number) => {
  // cycle through the colors
  const colorIndex = effectIndex % (COLORS.length - 1);
  return COLORS[colorIndex];
};

export default class Cannon extends Effect {
  delay: number;
  poses: Pose[];
  color: string;

  // there isn't a way to retrieve from Stats, so hard code
  // TODO calculate this based on the time since the last call to onAnimationFrame()
  FRAMES_PER_SECOND = 30;

  /** @param delay - the amount of time to wait, in seconds */
  constructor({ delay = 1, color = "black" }) {
    super();
    this.delay = delay;
    this.color = color;
    this.poses = [];
  }

  // returns the oldest saved frame
  poseToDisplay() {
    return this.poses[0];
  }

  sortVal(_currentPose: Pose) {
    const oldPose = this.poseToDisplay();
    return getShoulderWidth(oldPose.keypoints);
  }

  async onAnimationFrame(pose: Pose, canvas: Canvas) {
    this.poses.push(pose);

    const oldPose = this.poseToDisplay();
    drawSkeleton(oldPose, canvas, this.color);

    const numPoses = this.poses.length;
    const framesToKeep = this.delay * this.FRAMES_PER_SECOND;
    if (numPoses > framesToKeep) {
      // shorten to most recent frames
      const numToShift = numPoses - framesToKeep;
      this.poses = this.poses.slice(numToShift);
    }
  }

  /**
   * Adds a Cannon to the list of effects, delaying by one more second each time.
   * @param effects - gets modified
   */
  static addTo(effects: Effect[]) {
    // increase the delay by one for each added
    const numCannons = effects.reduce(
      (prev, effect) => (effect instanceof Cannon ? prev + 1 : prev),
      0
    );
    const delay = numCannons + 1;
    const color = getColor(numCannons);

    const effect = new Cannon({ delay, color });
    effects.push(effect);
  }
}
