// https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/body_pix#usage

import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import Video from "./video";

export default class Detector {
  _segmenter: bodySegmentation.BodySegmenter | undefined;
  video: Video;

  constructor(video: Video) {
    this.getSegmenter();
    this.video = video;
  }

  async getSegmenter() {
    if (!this._segmenter) {
      const model = bodySegmentation.SupportedModels.BodyPix;
      this._segmenter = await bodySegmentation.createSegmenter(model, {
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.5,
      });
    }

    return this._segmenter;
  }

  isReady() {
    return this.video.isLoaded();
  }

  async detect() {
    const segmenter = await this.getSegmenter();
    const people = await segmenter.segmentPeople(this.video.el, {
      multiSegmentation: false,
      segmentBodyParts: false,
    });

    return people[0];
  }
}
