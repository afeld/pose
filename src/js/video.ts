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

  async setUpWebcam(targetWidth: number, targetHeight: number) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: targetWidth,
        height: targetHeight,
      },
    });
    this.el.srcObject = stream;
  }

  turnOffWebcam() {
    this.metadataLoaded = false;
    this.dataLoaded = false;

    const stream = this.el.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());

    this.el.srcObject = null;
  }

  isLoaded() {
    return this.metadataLoaded && this.dataLoaded;
  }

  // creates a Video instance with a "virtual" element (outside of the DOM) matching the size of the provided canvas
  static matchCanvas(canvas: HTMLCanvasElement) {
    const videoEl = document.createElement("video");
    videoEl.autoplay = true;
    videoEl.width = canvas.clientWidth;
    videoEl.height = canvas.clientHeight;
    return new Video(videoEl);
  }
}
