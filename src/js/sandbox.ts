// const tf = require("@tensorflow/tfjs");
const speechCommands = require("@tensorflow-models/speech-commands");

const run = async () => {
  // When calling `create()`, you must provide the type of the audio input.
  // The two available options are `BROWSER_FFT` and `SOFT_FFT`.
  // - BROWSER_FFT uses the browser's native Fourier transform.
  // - SOFT_FFT uses JavaScript implementations of Fourier transform
  //   (not implemented yet).
  const recognizer = speechCommands.create("BROWSER_FFT");

  // Make sure that the underlying model and metadata are loaded via HTTPS
  // requests.
  await recognizer.ensureModelLoaded();

  // See the array of words that the recognizer is trained to recognize.
  console.log(recognizer.wordLabels());

  // `listen()` takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields such a
  //    - includeSpectrogram
  //    - probabilityThreshold
  //    - includeEmbedding
  recognizer.listen(
    (result) => {
      // - result.scores contains the probability scores that correspond to
      //   recognizer.wordLabels().
      // - result.spectrogram contains the spectrogram of the recognized word.
      console.log(result);
    },
    {
      includeSpectrogram: true,
      probabilityThreshold: 0.75,
    }
  );
};

run();
