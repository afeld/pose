import { Pose } from "@tensorflow-models/pose-detection";
import { BLACK } from "../utils/colors";
import { getMask } from "../utils/segment_helpers";

/**
 * wrapper class for the Pose object returned by the PoseDetection API
 */
export default class Body {
  pose: Pose;

  constructor(pose: Pose) {
    this.pose = pose;
  }

  getSegmentation() {
    const segmentation = this.pose.segmentation;
    if (!segmentation) {
      throw new Error("pose.segmentation is undefined");
    }
    return segmentation;
  }

  async getMask(color = BLACK) {
    const segmentation = this.getSegmentation();
    return await getMask(segmentation, color);
  }
}
