import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../canvas";
import { drawSkeleton } from "../segment_helpers";
import Effect from "./effect";

export default class Freeze implements Effect {
  frame: Pose | undefined;

  onAnimationFrame(pose: Pose, canvas: Canvas) {
    if (!this.frame) {
      this.frame = pose;
    }

    drawSkeleton(this.frame, canvas);
  }
}
