/// <reference path="./npm.d.ts" />
// https://cloud.google.com/speech-to-text/docs/samples/speech-transcribe-streaming-mic

import recorder from "node-record-lpcm16";

// Imports the Google Cloud client library
import speech from "@google-cloud/speech";

// Creates a client
const projectId = "pose-374103";
const client = new speech.SpeechClient({ projectId });

const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize({
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      // https://cloud.google.com/speech-to-text/docs/transcription-model
      model: "command_and_search",
      speechContexts: [
        {
          phrases: ["freeze", "reset", "shadow", "cannon"],
        },
      ],
    },
    interimResults: false, // If you want interim results, set this to true
  })
  .on("error", console.error)
  .on("data", (data) =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : "\n\nReached transcription time limit, press Ctrl+C\n"
    )
  );

// Start recording and send the microphone input to the Speech API.
// Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
recorder
  .record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: "rec", // Try also "arecord" or "sox"
    silence: "10.0",
  })
  .stream()
  .on("error", console.error)
  .pipe(recognizeStream);

console.log("Listening, press Ctrl+C to stop.");
