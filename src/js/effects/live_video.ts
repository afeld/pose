import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../display/canvas";
import Video from "../display/video";
import Effect from "./effect";

export const SORT_VAL = -1000;

export default class LiveVideo extends Effect {
  video: Video;

  constructor(video: Video) {
    super();
    this.video = video;
  }

  /**
   * @returns an arbitrary low value, so that this effect always appears in the back
   */
  sortVal(_currentPose: Pose) {
    return SORT_VAL;
  }

  async onAnimationFrame(_pose: Pose, canvas: Canvas) {
    canvas.context.drawImage(this.video.el, 0, 0);
  }

  static addTo(effects: Effect[], video: Video) {
    const effect = new LiveVideo(video);
    effects.unshift(effect);
  }
}
