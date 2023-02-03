// https://github.com/GoogleChromeLabs/web-audio-samples/blob/main/src/audio-worklet/basic/volume-meter/volume-meter-processor.js

const SMOOTHING_FACTOR = 0.8;
const FRAME_PER_SECOND = 60;
const FRAME_INTERVAL = 1 / FRAME_PER_SECOND;

class VolumeMeter extends AudioWorkletProcessor {
  _lastUpdate: number;
  _volume: number;

  constructor() {
    super();
    this._lastUpdate = currentTime;
    this._volume = 0;
  }

  calculateRMS(inputChannelData: Float32Array) {
    // Calculate the squared-sum.
    let sum = 0;
    for (let i = 0; i < inputChannelData.length; i++) {
      sum += inputChannelData[i] * inputChannelData[i];
    }

    // Calculate the RMS level and update the volume.
    const rms = Math.sqrt(sum / inputChannelData.length);
    this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);
  }

  process(inputs: Float32Array[][]) {
    // This example only handles mono channel.
    const inputChannelData = inputs[0][0];

    // Post a message to the node every 16ms.
    if (currentTime - this._lastUpdate > FRAME_INTERVAL) {
      this.calculateRMS(inputChannelData);
      this.port.postMessage(this._volume);
      this._lastUpdate = currentTime;
    }

    return true;
  }
}

registerProcessor("volume-meter", VolumeMeter);
