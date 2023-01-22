# Pose

[![Tests](https://github.com/afeld/pose/actions/workflows/tests.yml/badge.svg)](https://github.com/afeld/pose/actions/workflows/tests.yml)

Experiment using [Tensorflow.js's BlazePose-MediaPipe model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#readme) and the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API).

## To run

1. Install required software:
   - [Google Chrome](https://www.google.com/chrome/index.html)
     - As of this writing, [other browsers aren't supported](https://caniuse.com/speech-recognition).
   - [Node.js](https://nodejs.org/)
1. Install dependencies.

   ```sh
   npm install
   ```

1. Start the server.

   ```sh
   npm run server
   ```

1. Start the front end.

   ```sh
   npm start
   ```
