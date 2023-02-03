import Canvas from "../display/canvas";
import * as colors from "../utils/colors";

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

    const purpleMax = Object.assign({}, colors.PURPLE);
    purpleMax.a = 0.6;
    const purpleMin = Object.assign({}, colors.PURPLE);
    purpleMin.a = 0;

    const rectY = canvas.height() * 0.9;

    const gradient = ctx.createLinearGradient(0, canvas.height(), 0, rectY);
    gradient.addColorStop(0, colors.toRGBA(purpleMax));
    gradient.addColorStop(1, colors.toRGBA(purpleMin));
    ctx.fillStyle = gradient;

    ctx.fillRect(0, rectY, canvas.width(), canvas.height());
  }
};
