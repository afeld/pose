# Pose

[![Tests](https://github.com/afeld/pose/actions/workflows/tests.yml/badge.svg)](https://github.com/afeld/pose/actions/workflows/tests.yml)

Experiment using [Tensorflow.js's BlazePose-MediaPipe model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#readme) and the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API).

## To run

1. Install required software:
   - [Google Chrome](https://www.google.com/chrome/index.html)
     - You can use a different [supported browser](https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList#browser_compatibility), but will need to modify the `start` command in [`package.json`](package.json).
   - [Node.js](https://nodejs.org/)
1. Install dependencies.

   ```sh
   npm install
   ```

1. Start the server.

   ```sh
   npm start
   ```
