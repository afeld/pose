import { getElementById } from "./dom_helpers";
import Listener from "./listener";

export default class ListenerController {
  el: HTMLInputElement;
  listener: Listener;

  constructor(listener: Listener) {
    this.listener = listener;
    this.el = getElementById("enable-speech") as HTMLInputElement;

    this.el.addEventListener("change", () => {
      if (this.el.checked) {
        this.startIfAllowed();
      } else {
        this.stop();
      }
    });
  }

  isAllowed() {
    return this.el.checked;
  }

  startIfAllowed() {
    if (this.isAllowed()) {
      this.listener.start();
    }
  }

  stop() {
    this.listener.stop();
  }
}
