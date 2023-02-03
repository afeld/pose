import Canvas from "../display/canvas";

const DEFAULT_DEVICE_ID = "default";

const isDefaultInput = (device: MediaDeviceInfo) =>
  device.kind === "audioinput" && device.deviceId === DEFAULT_DEVICE_ID;

/**
 * @returns the default audio input device, if available
 */
const getDefaultInput = async (md: MediaDevices) => {
  const devices = await md.enumerateDevices();
  const device = devices.find(isDefaultInput);
  if (device) {
    return device;
  }
  return null;
};

/**
 * @param md accepts the navigator.mediaDevices as dependency injection for easier testing
 */
export const isDefaultDeviceBluetooth = async (md: MediaDevices) => {
  const device = await getDefaultInput(md);
  if (!device) {
    return false;
  }
  return device.label.toLowerCase().includes("bluetooth");
};

let showBluetoothWarning = false;

export const updateBluetoothStatus = async () => {
  const isBluetooth = await isDefaultDeviceBluetooth(navigator.mediaDevices);
  showBluetoothWarning = !isBluetooth;
};

/**
 * if a warning should be shown, draws an indicator on the screen
 */
export const drawNoBluetoothWarning = (canvas: Canvas) => {
  if (showBluetoothWarning) {
    const ctx = canvas.context;

    const rectY = canvas.height() * 0.75;

    const gradient = ctx.createLinearGradient(
      canvas.width() / 2,
      canvas.height(),
      canvas.width() / 2,
      rectY
    );
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    ctx.fillStyle = gradient;

    ctx.fillRect(0, rectY, canvas.width(), canvas.height());
  }
};
