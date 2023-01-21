// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands#online-streaming-recognition

import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

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

const run = async () => {
  await tf.setBackend("webgl");

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

  const onCommand = async (
    result: speechCommands.SpeechCommandRecognizerResult
  ) => {
    // - result.scores contains the probability scores that correspond to
    //   recognizer.wordLabels().
    // - result.spectrogram contains the spectrogram of the recognized word.

    const maxIndex = indexOfMax(result.scores as Float32Array);
    const score = result.scores[maxIndex];
    const command = recognizer.wordLabels()[maxIndex];
    console.log(`command: ${command}, score: ${score}`);
  };

  // `listen()` takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields such a
  //    - includeSpectrogram
  //    - probabilityThreshold
  //    - includeEmbedding
  recognizer.listen(onCommand, {
    probabilityThreshold: 0.7,
    // the recognizer seems to pick up duplicate commands sometimes, so only take the first one
    suppressionTimeMillis: 1500,
  });
};

run();
