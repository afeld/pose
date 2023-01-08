import throttle from "lodash.throttle";
import speech from "@google-cloud/speech";

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {
  // The path to the remote LINEAR16 file
  const gcsUri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw";

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}
quickstart();

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
const iSpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const iSpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;

const createGrammar = (commands: string[]) => {
  const speechRecognitionList = new iSpeechGrammarList();
  const commandStr = commands.join(" | ");
  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commandStr} ;`;
  speechRecognitionList.addFromString(grammar, 1);
  return speechRecognitionList;
};

const createRecognizer = (commands: string[]) => {
  const recognition = new iSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const speechRecognitionList = createGrammar(commands);
  recognition.grammars = speechRecognitionList;

  return recognition;
};

export default class Listener {
  commands: string[];
  recognition: SpeechRecognition;
  autoRestart = true;

  constructor(commands: string[]) {
    this.commands = commands;

    this.recognition = createRecognizer(this.commands);
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
        alert("Access not allowed; please restart.");
        this.autoRestart = false;
        break;
      case "network":
        this.autoRestart = false;
        alert("Must be online to use voice commands; please restart.");
        break;
      case "no-speech":
        // Chrome automaticaly stops after ~7 seconds (as of 1/7/23); we will restart it below
        break;
      default:
        alert("Unexpected error in speech recognition");
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
