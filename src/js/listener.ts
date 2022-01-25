// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
// https://github.com/mdn/content/pull/12412
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
    let autoRestart = true;
    this.recognition.addEventListener("error", (event) => {
      console.error("error in speech recognition:", event.error);

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          autoRestart = false;
      }
    });
    this.recognition.addEventListener("speechend", () => {
      setTimeout(() => {
        if (autoRestart) {
          this.recognition.start();
        }
      }, 100);
    });
  }

  onCommand(callback: (command: string) => void) {
    this.recognition.addEventListener("result", (event) => {
      const lastCommand = event.results[event.results.length - 1][0].transcript;
      const cleanCommand = lastCommand.toLowerCase().trim();
      if (this.commands.includes(cleanCommand)) {
        callback(cleanCommand);
      } else {
        console.warn("unknown command:", cleanCommand);
      }
    });
  }

  start() {
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }
}
