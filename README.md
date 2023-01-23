# Pose

[![Tests](https://github.com/afeld/pose/actions/workflows/tests.yml/badge.svg)](https://github.com/afeld/pose/actions/workflows/tests.yml)

Experiment using [Tensorflow.js's BlazePose-MediaPipe model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#readme) and [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/docs).

## To run

1. Install required software:
   - [Google Chrome](https://www.google.com/chrome/index.html)
     - As of this writing, [other browsers aren't supported](https://caniuse.com/speech-recognition).
   - [Node.js](https://nodejs.org/)
1. [Set up Speech-to-Text](https://cloud.google.com/speech-to-text/docs/before-you-begin)
   1. [Set up credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev)
   1. [Impersonate a service account](https://cloud.google.com/iam/docs/create-short-lived-credentials-direct#permissions-user)
   1. [Create a new service account key](https://cloud.google.com/docs/authentication/provide-credentials-adc#local-key)
1. Install dependencies.

   ```sh
   npm install
   ```

1. Start the server.

   ```sh
   npm start
   ```

1. Run the Node server

   ```sh
   GOOGLE_APPLICATION_CREDENTIALS=<key_path> npx ts-node src/js/speech.ts
   ```
