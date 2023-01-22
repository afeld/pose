declare class Waveform {}

declare module "mic" {
  interface MicOpts {
    rate: string;
    channels: string;
    debug: boolean;
    device: string;
  }

  class AudioStream {
    on(event: string, callback: (data: Waveform) => void): void;
  }

  class MicInstance {
    getAudioStream(): AudioStream;
    start(): void;
    stop(): void;
  }

  export default function mic(options: MicOpts): MicInstance;
  // export = mic;
}

declare module "vosk" {
  function setLogLevel(level: number): void;

  class Model {
    constructor(modelPath: string);
    free(): void;
  }

  interface RecognizerOpts {
    model: Model;
    sampleRate: number;
    grammar: string[];
  }

  interface Result {
    text: string;
  }

  class Recognizer {
    constructor(opts: RecognizerOpts);
    acceptWaveform(data: Waveform): boolean;
    result(): Result;
    finalResult(): Result;
    free(): void;
  }
}
