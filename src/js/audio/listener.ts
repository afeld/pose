import throttle from "lodash/throttle";
import { allCommands } from "../controllers/actions";
import { createGrammarList } from "./grammar";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
const iSpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

const createRecognizer = () => {
  const recognition = new iSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const speechRecognitionList = createGrammarList();
  recognition.grammars = speechRecognitionList;

  return recognition;
};

export default class Listener {
  commands: string[];
  recognition: SpeechRecognition;
  autoRestart = true;

  constructor() {
    this.commands = allCommands();

    this.recognition = createRecognizer();
    this.setupListeners();
  }

  setupListeners() {
    this.recognition.addEventListener("nomatch", () => {
      console.log("no match for voice command");
    });

    // ensure it runs continuously
    // https://stackoverflow.com/questions/29996350/speech-recognition-run-continuously
    this.recognition.addEventListener("error", this.onError);
    // only restart once
    const endCallback = throttle(this.onEnd, 100, {
      leading: true,
      trailing: false,
    });
    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#events
    for (const event of ["audioend", "end", "soundend", "speechend"]) {
      this.recognition.addEventListener(event, endCallback);
    }
  }

  // callback
  onError = (event: SpeechRecognitionErrorEvent) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent/error#value
    switch (event.error) {
      case "not-allowed":
      case "service-not-allowed":
        console.error("Access not allowed; please restart.");
        this.autoRestart = false;
        break;
      case "network":
        this.autoRestart = false;
        console.error("Must be online to use voice commands; please restart.");
        break;
      case "no-speech":
        // Chrome automaticaly stops after ~7 seconds (as of 1/7/23); we will restart it below
        break;
      default:
        console.error("Unexpected error in speech recognition:");
        console.error(event.error);
    }
  };

  // callback
  onEnd = () => {
    setTimeout(() => {
      if (this.autoRestart) {
        console.log("restarting speech recognition");
        this.start();
      }
    }, 100);
  };

  /**
   * register event handler
   */
  onCommand(callback: (command: string) => void) {
    this.recognition.addEventListener("result", (event) => {
      const lastResult = event.results[event.results.length - 1];
      const lastCommand = lastResult[0].transcript;
      const cleanCommand = lastCommand.toLowerCase().trim();
      if (this.commands.includes(cleanCommand)) {
        callback(cleanCommand);
      } else {
        console.warn("unknown command:", cleanCommand);
      }
    });
  }

  start() {
    this.autoRestart = true;
    try {
      this.recognition.start();
    } catch (DomException) {
      // already started; safe to ignore
    }
  }

  stop() {
    this.autoRestart = false;
    this.recognition.stop();
  }
}
