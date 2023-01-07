import { getSize } from "./dom_helpers";

export default class Canvas {
  el: HTMLCanvasElement;
  loadingIndicator: HTMLElement;

  constructor(el: HTMLCanvasElement, loadingIndicator: HTMLElement) {
    this.el = el;
    this.loadingIndicator = loadingIndicator;

    this.setSize();
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

  context() {
    const ctx = this.el.getContext("2d");
    if (!ctx) {
      throw new Error("context couldn't be retrieved");
    }
    return ctx;
  }

  clear() {
    const ctx = this.context();
    ctx.clearRect(0, 0, this.width(), this.height());
  }
}
