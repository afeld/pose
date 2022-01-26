import { actionForCommand, allCommands } from "./actions";
import { getElementById } from "./dom_helpers";
import Effect from "./effects/effect";
import Listener from "./listener";

export default class ListenerController {
  el: HTMLInputElement;
  listener: Listener;
  effects: Effect[];

  constructor(effects: Effect[]) {
    const commands = allCommands();
    this.listener = new Listener(commands);
    this.effects = effects;
    this.listener.onCommand(this.onVoiceCommand);

    this.el = getElementById("enable-speech") as HTMLInputElement;
    this.el.addEventListener("change", this.onCheckboxChange);
  }

  onVoiceCommand = (command: string) => {
    console.log("command:", command);

    const action = actionForCommand(command);
    if (!action) {
      console.warn(`command "${command}" not found`);
      return;
    }
    action.callback(this.effects);
  };

  onCheckboxChange = () => {
    if (this.el.checked) {
      this.startIfAllowed();
    } else {
      this.stop();
    }
  };

  isAllowed() {
    return this.el.checked;
  }

  startIfAllowed() {
    if (this.isAllowed()) {
      this.listener.start();
      console.log("voice commands enabled");
    }
  }

  stop() {
    this.listener.stop();
    console.log("voice commands disabled");
  }
}
