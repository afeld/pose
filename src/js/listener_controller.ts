import { actionForCommand } from "./actions";
import Effect from "./effects/effect";
import Listener from "./listener";
import { config, speechDetectionController } from "./controls";

export default class ListenerController {
  listener: Listener;
  effects: Effect[];

  constructor(effects: Effect[]) {
    this.listener = new Listener();
    this.effects = effects;

    // set up handlers
    this.listener.onCommand(this.onVoiceCommand);
    speechDetectionController.onChange(this.onCheckboxChange);
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

  onCheckboxChange = (value: boolean) => {
    if (value) {
      this.startIfAllowed();
    } else {
      this.stop();
    }
  };

  isAllowed() {
    return config.speechDetection;
  }

  startIfAllowed() {
    if (this.isAllowed()) {
      // this.listener.start();
      console.log("voice commands enabled");
    }
  }

  stop() {
    this.listener.stop();
    console.log("voice commands disabled");
  }
}
