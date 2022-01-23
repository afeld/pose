// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
const iSpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const iSpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;

const createGrammar = (commands: string[]) => {
  const speechRecognitionList = new iSpeechGrammarList();
  const grammar =
    "#JSGF V1.0; grammar commands; public <command> = " +
    commands.join(" | ") +
    " ;";
  speechRecognitionList.addFromString(grammar, 1);
  return speechRecognitionList;
};

export default class Listener {
  recognition: SpeechRecognition;
  commands = [
    "aqua",
    "azure",
    "beige",
    "bisque",
    "black",
    "blue",
    "brown",
    "chocolate",
    "coral",
  ];

  constructor() {
    this.recognition = new iSpeechRecognition();
    this.setup();
  }

  setup() {
    const speechRecognitionList = createGrammar(this.commands);
    this.recognition.grammars = speechRecognitionList;

    this.recognition.continuous = true;
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener("result", (event) => {
      const lastCommand = event.results[event.results.length - 1][0].transcript;
      console.log(lastCommand);
    });
    this.recognition.addEventListener("nomatch", () => {
      console.log("no match for voice command");
    });

    // ensure it runs continuously
    // https://stackoverflow.com/questions/29996350/speech-recognition-run-continuously
    let autoRestart = true;
    this.recognition.addEventListener("error", (event) => {
      console.log("error in speech recognition:", event.error);

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          autoRestart = false;
      }
    });
    this.recognition.addEventListener("speechend", () => {
      console.log("speech ended");

      setTimeout(() => {
        if (autoRestart) {
          this.recognition.start();
        }
      }, 1000);
    });
  }

  start() {
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }
}
