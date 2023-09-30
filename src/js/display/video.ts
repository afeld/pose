import Canvas from "./canvas";

export default class Video {
  el: HTMLVideoElement;
  metadataLoaded: boolean;
  dataLoaded: boolean;

  constructor(el: HTMLVideoElement) {
    this.el = el;
    this.metadataLoaded = false;
    this.dataLoaded = false;

    this.setUpListeners();
  }

  setUpListeners() {
    // based on https://github.com/tensorflow/tfjs-models/blob/af59ff3eb3350986173ac8c8ae504806b02dad39/body-pix/demo/index.js/#L135-L137
    this.el.addEventListener("loadedmetadata", () => {
      this.el.width = this.el.videoWidth;
      this.el.height = this.el.videoHeight;
      this.metadataLoaded = true;
    });

    this.el.addEventListener("loadeddata", () => {
      this.dataLoaded = true;
    });
  }

  async getWebCam() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices.find(
      (device) =>
        device.kind === "videoinput" &&
        device.label.toLowerCase().includes("webcam")
    );
  }

  async setUpCamera(targetWidth: number, targetHeight: number) {
    // favor the webcam, if available
    const webcam = await this.getWebCam();

    const constraints = {
      audio: false,
      video: {
        width: targetWidth,
        height: targetHeight,
        deviceId: webcam?.deviceId,
      },
    } as MediaStreamConstraints;

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.el.srcObject = stream;
  }

  turnOffWebcam() {
    this.metadataLoaded = false;
    this.dataLoaded = false;

    const stream = this.el.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());

    this.el.srcObject = null;
  }

  isLoaded() {
    return this.metadataLoaded && this.dataLoaded;
  }

  /**
   * @returns a Video instance with a "virtual" element (outside of the DOM) matching the size of the provided canvas
   */
  static matchCanvas(canvas: Canvas) {
    const videoEl = document.createElement("video");
    videoEl.autoplay = true;
    videoEl.width = canvas.width();
    videoEl.height = canvas.height();
    return new Video(videoEl);
  }
}
