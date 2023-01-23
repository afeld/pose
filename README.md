# Pose

[![Tests](https://github.com/afeld/pose/actions/workflows/tests.yml/badge.svg)](https://github.com/afeld/pose/actions/workflows/tests.yml)

Experiment using [Tensorflow.js's BlazePose-MediaPipe model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#readme) and the [Vosk](https://alphacephei.com/vosk/) for speech recognition.

## Architecture

There's a server that runs locally to do speech detection, while the front end runs via [Parcel](https://parceljs.org/). Recognized commands are sent from the server to the front end via [Socket.IO](https://socket.io/).

## To run

1. Install required software:
   - [Google Chrome](https://www.google.com/chrome/index.html)
     - As of this writing, [other browsers aren't supported](https://caniuse.com/speech-recognition).
   - [Node.js](https://nodejs.org/)
1. [Download the model](https://alphacephei.com/vosk/models) and unzip to `models/` in this directory.
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

There's a bug in the server where it can't be stopped with `Control`+`C`, so use `killall node`.
