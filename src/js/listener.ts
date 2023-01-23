// based on
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands#online-streaming-recognition

import * as speechCommands from "@tensorflow-models/speech-commands";
import { EventEmitter } from "events";
import { allCommands } from "./actions";

const DEFAULT_DEVICE_ID = "default";

/**
 * @returns the index of the maximum value in an array
 */
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

const isPreferredDevice = (device: MediaDeviceInfo) => {
  return (
    device.kind === "audioinput" &&
    device.deviceId !== DEFAULT_DEVICE_ID &&
    device.label.toLowerCase().includes("bluetooth")
  );
};

/**
 * @returns the device ID of the first bluetooth audio input device, if available
 */
const getDeviceID = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const device = devices.find(isPreferredDevice);
  if (device) {
    return device.deviceId;
  }
  return DEFAULT_DEVICE_ID;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
/**
 * @returns the items in setA that aren't in setB
 */
const difference = (setA: any[], setB: any[]) => {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
};

export default class Listener {
  recognizer: speechCommands.SpeechCommandRecognizer;
  eventEmitter: EventEmitter;

  constructor() {
    // can't use URL Dependencies (https://parceljs.org/languages/javascript/#url-dependencies) because the .bin file gets loaded under the hood, and there isn't a clear way to tell the model the URL for that
    // https://github.com/googlecreativelab/teachablemachine-community/blob/master/snippets/markdown/audio/tensorflowjs/javascript.md
    this.recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      `${location.origin}/model/model.json`,
      `${location.origin}/model/metadata.json`
    );
    this.eventEmitter = new EventEmitter();
    this.setupListeners();
  }

  async setupListeners() {
    await this.recognizer.ensureModelLoaded();

    const classLabels = this.recognizer.wordLabels();
    const desiredCommands = allCommands();
    const diff = difference(desiredCommands, classLabels);
    if (diff.size > 0) {
      console.log("Commands missing in the model:", diff);
    }
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

  async start(deviceId: string | undefined = undefined) {
    if (this.recognizer.isListening()) {
      return;
    }

    if (!deviceId) {
      deviceId = await getDeviceID();
    }
    console.log("Using audio input device", deviceId);

    if (deviceId === DEFAULT_DEVICE_ID) {
      this.waitForBluetooth();
    }

    await this.recognizer.listen(this.listenCallback, {
      probabilityThreshold: 0.9,
      // per https://github.com/googlecreativelab/teachablemachine-community/blob/master/snippets/markdown/audio/tensorflowjs/javascript.md
      overlapFactor: 0.75,
      // the recognizer seems to pick up duplicate commands sometimes, so only take the first one
      suppressionTimeMillis: 1500,
      audioTrackConstraints: {
        deviceId: deviceId,
      },
    });
  }

  /**
   * it takes a moment for bluetooth devices to get connected, so wait to see if one does
   */
  waitForBluetooth() {
    const intervalID = setInterval(async () => {
      const deviceId = await getDeviceID();
      if (deviceId === DEFAULT_DEVICE_ID) {
        return;
      }

      clearInterval(intervalID);
      console.log("Reconnecting audio");
      await this.stop();
      this.start(deviceId);
    }, 1000);
  }

  async stop() {
    if (this.recognizer.isListening()) {
      await this.recognizer.stopListening();
    }
  }
}
