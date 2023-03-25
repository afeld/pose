import { Pose } from "@tensorflow-models/pose-detection";
import Canvas from "../display/canvas";
import Effect from "./effect";
import * as liveVideo from "./live_video";

export default class Static extends Effect {
  idata: ImageData | undefined;

  /**
   * @returns an arbitrary low value, so that this effect always appears in the back
   */
  sortVal(_currentPose: Pose) {
    // ensure the live video appears above this
    return liveVideo.SORT_VAL - 1000;
  }

  async onAnimationFrame(_pose: Pose, canvas: Canvas) {
    // https://stackoverflow.com/q/22003491/358804

    if (
      !this.idata ||
      this.idata.width !== canvas.width() ||
      this.idata.height !== canvas.height()
    ) {
      this.idata = canvas.context.createImageData(
        canvas.width(),
        canvas.height()
      );
    }

    for (let i = 0; i < this.idata.data.length; i += 4) {
      const color = Math.random() < 0.5 ? 0 : 255;
      this.idata.data[i] = color;
      this.idata.data[i + 1] = color;
      this.idata.data[i + 2] = color;
      this.idata.data[i + 3] = 255;
    }
    canvas.context.putImageData(this.idata, 0, 0);
  }

  static addTo(effects: Effect[]) {
    const effect = new Static();
    effects.unshift(effect);
  }
}
