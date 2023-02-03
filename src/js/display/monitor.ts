import Stats from "stats.js";
// https://parceljs.org/languages/javascript/#worklets
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import workletUrl from "worklet:../audio/volume.ts";

export interface Monitor {
  stats: Stats;
  volumePanel: Stats.Panel;
}

interface VolumeCallback {
  (volume: number): void;
}

const listenForAudio = async (callback: VolumeCallback) => {
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
    callback(volume);
  };

  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(node).connect(audioContext.destination);
};

const setUpVolumePanel = (stats: Stats) => {
  // https://github.com/mrdoob/stats.js/blob/master/examples/custom.html
  const volumePanel = stats.addPanel(new Stats.Panel("volume", "#f8f", "#212"));
  listenForAudio((volume) => volumePanel.update(volume, 70));

  // workaround to show both Panels
  const volumeEl = stats.dom.children[3] as HTMLCanvasElement;
  volumeEl.style.display = "block";

  return volumePanel;
};

const createMonitor = () => {
  const stats = new Stats();
  stats.showPanel(0);

  const volumePanel = setUpVolumePanel(stats);

  document.body.appendChild(stats.dom);

  const monitor: Monitor = { stats, volumePanel };
  return monitor;
};

export default createMonitor;
