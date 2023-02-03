import monitor from "./display/monitor";
import Stats from "stats.js";
// https://parceljs.org/languages/javascript/#worklets
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import workletUrl from "worklet:./audio/volume.ts";

const run = async () => {
  const stats = monitor();
  // https://github.com/mrdoob/stats.js/blob/master/examples/custom.html
  const volumePanel = stats.addPanel(new Stats.Panel("volume", "#f8f", "#212"));
  stats.showPanel(3);

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  // https://stackoverflow.com/a/62732195/358804

  const audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule(workletUrl);

  const node = new AudioWorkletNode(audioContext, "volume-meter");
  node.port.onmessage = (event) => {
    // https://github.com/GoogleChromeLabs/web-audio-samples/blob/eed2a8613af551f2b1d166a01c834e8431fdf3c6/src/audio-worklet/basic/volume-meter/main.js#L13
    const volume = event.data * 500;
    console.log(volume);

    volumePanel.update(volume, 100);
  };

  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(node).connect(audioContext.destination);
};

run();
