// https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#usage

import * as poseDetection from "@tensorflow-models/pose-detection";
import Video from "./video";

export default class Detector {
  _detector: poseDetection.PoseDetector | undefined;
  video: Video;

  constructor(video: Video) {
    this.getDetector();
    this.video = video;
  }

  async getDetector() {
    if (!this._detector) {
      const model = poseDetection.SupportedModels.BlazePose;
      this._detector = await poseDetection.createDetector(model, {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
        enableSegmentation: true,
      });
    }

    return this._detector;
  }

  isReady() {
    return this.video.isLoaded();
  }

  async detect() {
    const detector = await this.getDetector();
    const poses = await detector.estimatePoses(this.video.el);
    // their type signature is wrong
    const pose: poseDetection.Pose | undefined = poses[0];
    return pose;
  }
}
