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
}
