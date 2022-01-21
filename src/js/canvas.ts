export default class Canvas {
  el: HTMLCanvasElement;
  loadingIndicator: HTMLElement;

  constructor(el: HTMLCanvasElement, loadingIndicator: HTMLElement) {
    this.el = el;
    this.loadingIndicator = loadingIndicator;
  }

  width() {
    return this.el.clientWidth;
  }

  height() {
    return this.el.clientHeight;
  }

  loaded() {
    this.loadingIndicator.remove();
  }
}
