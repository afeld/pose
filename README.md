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

## Updating the model

When new [commands](src/js/actions.ts) are added, etc., the model will need to be updated.

1. [Open the model in Teachable Machine](https://teachablemachine.withgoogle.com/train/audio/1B3spw3AFZA2FiMZ2d8b1v0vP7CJIAheO)
1. Add a class, add more samples, etc.
1. Train
1. `Save project to Drive`
1. `Export Model`
1. Download
1. Copy the files into `static/model/`
1. Format the files

   ```sh
   npx prettier -w static/model
   ```
