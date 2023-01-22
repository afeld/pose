import * as Vosk from "vosk-browser";
const downloadUrl = new URL("../model.tar.gz", import.meta.url);

const createGrammar = (commands: string[]) => {
  return JSON.stringify(commands);
};

const createRecognizer = async (commands: string[]) => {
  // https://github.com/ccoreilly/vosk-browser#basic-example

  const model = await Vosk.createModel(downloadUrl.toString());
  const sampleRate = 16000;
  const speechRecognitionList = createGrammar(commands);
  const recognizer = new model.KaldiRecognizer(
    sampleRate
    // speechRecognitionList
  );

  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      channelCount: 1,
      sampleRate,
    },
  });

  const audioContext = new AudioContext();
  const recognizerNode = audioContext.createScriptProcessor(4096, 1, 1);
  recognizerNode.onaudioprocess = (event) => {
    try {
      recognizer.acceptWaveform(event.inputBuffer);
    } catch (error) {
      console.error("acceptWaveform failed", error);
    }
  };
  const source = audioContext.createMediaStreamSource(mediaStream);
  source.connect(recognizerNode);

  return recognizer;
};

export default class Listener {
  commands: string[];
  recognizerPromise: Promise<Vosk.KaldiRecognizer>;
  autoRestart = true;

  constructor(commands: string[]) {
    this.commands = commands;
    this.recognizerPromise = createRecognizer(this.commands);
  }

  // register event handler
  async onCommand(callback: (command: string) => void) {
    const recognizer = await this.recognizerPromise;
    recognizer.on("result", (message) => {
      const command = message.result.text;
      console.log(`Result: ${command}`);
      callback(command);
    });
  }

  start() {
    this.autoRestart = true;
    // TODO
  }

  stop() {
    this.autoRestart = false;
    // TODO
  }
}
