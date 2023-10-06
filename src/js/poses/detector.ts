// https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#usage

import * as poseDetection from "@tensorflow-models/pose-detection";
import Video from "../display/video";

export const MODEL = poseDetection.SupportedModels.BlazePose;

export default class Detector {
  _detector: poseDetection.PoseDetector | undefined;
  video: Video;

  constructor(video: Video) {
    this.getDetector();
    this.video = video;
  }

  async getDetector() {
    if (!this._detector) {
      this._detector = await poseDetection.createDetector(MODEL, {
        runtime: "mediapipe",
        enableSegmentation: true,
        enableSmoothing: true,
        smoothSegmentation: true,
        modelType: "lite",

        // model is copied with the site build via a Parcel plugin so it can be loaded locally
        // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#create-a-detector
        // https://github.com/elwin013/parcel-reporter-static-files-copy#customization
        solutionPath: "node_modules/@mediapipe/pose",
      });
    }

    return this._detector;
  }

  isReady() {
    return this.video.isLoaded();
  }

  reset() {
    this._detector?.reset();
  }

  async detect() {
    const detector = await this.getDetector();
    const poses = await detector.estimatePoses(this.video.el, {
      flipHorizontal: false,
    });
    // their type signature is wrong
    const pose = poses[0] as poseDetection.Pose | undefined;
    return pose;
  }
}
