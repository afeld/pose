import { getSize } from "../utils/dom_helpers";

export default class Canvas {
  el: HTMLCanvasElement;
  loadingIndicator: HTMLElement;
  context: CanvasRenderingContext2D;

  constructor(el: HTMLCanvasElement, loadingIndicator: HTMLElement) {
    this.el = el;
    this.loadingIndicator = loadingIndicator;

    this.setSize();

    const ctx = this.el.getContext("2d");
    if (!ctx) {
      throw new Error("context couldn't be retrieved");
    }
    this.context = ctx;
  }

  // canvas needs the width and height set explicitly
  // https://stackoverflow.com/a/2588404
  setSize() {
    const { width, height } = getSize(this.el);
    this.el.width = width;
    this.el.height = height;
  }

  width() {
    return this.el.width;
  }

  height() {
    return this.el.height;
  }

  loaded() {
    this.loadingIndicator.remove();
  }

  clear() {
    // https://stackoverflow.com/a/2142549/358804
    this.context.clearRect(0, 0, this.width(), this.height());
  }
}
