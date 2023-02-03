// https://parceljs.org/languages/javascript/#worklets
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import workletUrl from "worklet:./audio/volume.ts";

const run = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  // https://stackoverflow.com/a/62732195/358804

  const audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule(workletUrl);

  const node = new AudioWorkletNode(audioContext, "volume-meter");
  node.port.onmessage = (event) => {
    const volume = event.data;
    // https://github.com/GoogleChromeLabs/web-audio-samples/blob/eed2a8613af551f2b1d166a01c834e8431fdf3c6/src/audio-worklet/basic/volume-meter/main.js#L13
    console.log(volume * 500);
  };

  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(node).connect(audioContext.destination);
};

run();
