declare module "mic" {
  interface MicOpts {
    rate: string;
    channels: string;
    debug: boolean;
    device: string;
  }

  function mic(options: MicOpts): any;
  export = mic;
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

  class Recognizer {
    constructor(opts: RecognizerOpts);
    acceptWaveform(data: any): boolean;
    result(): string;
    finalResult(): string;
    free(): void;
  }
}
