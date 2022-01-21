import * as bodyPix from "@tensorflow-models/body-pix";
import Video from "./video";

export default class Detector {
  _model: bodyPix.BodyPix | undefined;
  video: Video;

  constructor(video: Video) {
    this.getModel();
    this.video = video;
  }

  async getModel() {
    if (!this._model) {
      this._model = await bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.5,
      });
    }

    return this._model;
  }

  isReady() {
    return this.video.isLoaded();
  }

  async detect() {
    const model = await this.getModel();
    return await model.segmentPerson(this.video.el, {
      internalResolution: "medium",
      maxDetections: 1,
    });
  }
}
