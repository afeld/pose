// https://parceljs.org/languages/javascript/#worklets
// @ts-ignore
import workletUrl from "worklet:./audio/volume.ts";

const run = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  // https://stackoverflow.com/a/62732195/358804

  const audioContext = new AudioContext();

  // Adding an AudioWorkletProcessor
  // from another script with addModule method
  await audioContext.audioWorklet.addModule(workletUrl);

  // Creating a MediaStreamSource object
  // and sending a MediaStream object granted by
  // the user
  const microphone = audioContext.createMediaStreamSource(stream);

  // Creating AudioWorkletNode sending
  // context and name of processor registered
  // in vumeter-processor.js
  const node = new AudioWorkletNode(audioContext, "vumeter");

  // Listing any message from AudioWorkletProcessor in its
  // process method here where you can know
  // the volume level
  node.port.onmessage = (event) => {
    let _volume = 0;
    let _sensibility = 5; // Just to add any sensibility to our ecuation
    if (event.data.volume) _volume = event.data.volume;
    console.log((_volume * 100) / _sensibility);
  };

  // Now this is the way to
  // connect our microphone to
  // the AudioWorkletNode and output from audioContext
  microphone.connect(node).connect(audioContext.destination);
};

run();
