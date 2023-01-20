setInterval(async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const inputDevices = devices.filter((device) => device.kind === "audioinput");
  const labels = inputDevices.map((device) => device.label);
  console.log(labels);
}, 100);
