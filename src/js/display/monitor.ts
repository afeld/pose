import Stats from "stats.js";

export const createMonitor = () => {
  const stats = new Stats();
  stats.showPanel(0);

  document.body.appendChild(stats.dom);

  return stats;
};

export const setUpVolumePanel = (stats: Stats) => {
  // https://github.com/mrdoob/stats.js/blob/master/examples/custom.html
  const volumePanel = stats.addPanel(new Stats.Panel("volume", "#f8f", "#212"));

  // workaround to show both Panels
  const volumeEl = stats.dom.children[3] as HTMLCanvasElement;
  volumeEl.style.display = "block";

  return volumePanel;
};
