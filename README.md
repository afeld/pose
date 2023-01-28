# Pose

[![Tests](https://github.com/afeld/pose/actions/workflows/tests.yml/badge.svg)](https://github.com/afeld/pose/actions/workflows/tests.yml)

Experiment using [Tensorflow.js's BlazePose-MediaPipe model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#readme) and the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API).

The site is written in Typescript, and the site is built by [Parcel](https://parceljs.org/). The speech detection happens in an iframe (for performance reasons), and recognized commands are sent to the parent window.

## To run

1. Install required software:
   - [Google Chrome](https://www.google.com/chrome/index.html)
     - As of this writing, other browsers aren't supported, due to needing:
       - [OffscreenCanvas](https://caniuse.com/offscreencanvas)
       - [Web Speech API](https://caniuse.com/speech-recognition)
   - [Node.js](https://nodejs.org/)
1. Install dependencies.

   ```sh
   npm install
   ```

1. Start the server.

   ```sh
   npm start
   ```

## Relevant TensorFlow codebases/docs

- [TensorFlow.js docs](https://www.tensorflow.org/js)
- [Pose Detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
  - [BlazePose-Mediapipe](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe)
- MediaPipe
  - [Pose Classification docs](https://google.github.io/mediapipe/solutions/pose_classification.html)
  - [Source code](https://github.com/google/mediapipe)

## Sandbox

The sandbox can be used for testing pieces in isolation.

1. Edit [`sandbox.ts`](src/js/sandbox.ts).
1. Start the server.

   ```sh
   npm start
   ```

1. Visit http://localhost:1234/sandbox.html.
