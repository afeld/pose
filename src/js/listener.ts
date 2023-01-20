// based on
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands#online-streaming-recognition

import * as speechCommands from "@tensorflow-models/speech-commands";
import { EventEmitter } from "events";

// returns the index of the maximum value in an array
const indexOfMax = (arr: Float32Array) => {
  // https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array#comment54083228_30850912
  return arr.reduce(
    (bestIndexSoFar, currentlyTestedValue, currentlyTestedIndex, array) =>
      currentlyTestedValue > array[bestIndexSoFar]
        ? currentlyTestedIndex
        : bestIndexSoFar,
    0
  );
};

export default class Listener {
  recognizer: speechCommands.SpeechCommandRecognizer;
  eventEmitter: EventEmitter;

  constructor(commands: string[]) {
    this.recognizer = speechCommands.create("BROWSER_FFT");
    this.eventEmitter = new EventEmitter();
    this.setupListeners();
  }

  async setupListeners() {
    await this.recognizer.ensureModelLoaded();
  }

  listenCallback = async (
    result: speechCommands.SpeechCommandRecognizerResult
  ) => {
    const maxIndex = indexOfMax(result.scores as Float32Array);
    const score = result.scores[maxIndex];
    const command = this.recognizer.wordLabels()[maxIndex];
    console.log(`command: ${command}, score: ${score}`);
    this.eventEmitter.emit("command", command);
  };

  // register event handler
  onCommand(callback: (command: string) => void) {
    this.eventEmitter.on("command", callback);
  }

  start() {
    this.recognizer.listen(this.listenCallback, {
      probabilityThreshold: 0.99,
      // the recognizer seems to pick up duplicate commands sometimes, so only take the first one
      suppressionTimeMillis: 1500,
    });
  }

  stop() {
    this.recognizer.stopListening();
  }
}
