# Pose

[![Tests](https://github.com/afeld/pose/actions/workflows/tests.yml/badge.svg)](https://github.com/afeld/pose/actions/workflows/tests.yml)

Experiment using Tensorflow.js's [BlazePose-MediaPipe](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#readme) and [Speech Command Recognizer](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands) models. The latter uses a model trained with [Teachable Machine](https://teachablemachine.withgoogle.com/train/audio).

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
   npm start
   ```
