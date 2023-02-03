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

    const baseColor = colors.RED;
    const redMax = Object.assign({}, baseColor, { a: 0.6 });
    const redMin = Object.assign({}, baseColor, { a: 0 });

    const pctOfHeight = 0.1;

    // bottom

    const rect1YStart = canvas.height() * (1 - pctOfHeight);

    const gradient1 = ctx.createLinearGradient(
      0,
      canvas.height(),
      0,
      rect1YStart
    );
    gradient1.addColorStop(0, colors.toRGBA(redMax));
    gradient1.addColorStop(1, colors.toRGBA(redMin));
    ctx.fillStyle = gradient1;

    ctx.fillRect(0, rect1YStart, canvas.width(), canvas.height());

    // top

    const rect2YStop = canvas.height() * pctOfHeight;

    const gradient2 = ctx.createLinearGradient(0, 0, 0, rect2YStop);
    gradient2.addColorStop(0, colors.toRGBA(redMax));
    gradient2.addColorStop(1, colors.toRGBA(redMin));
    ctx.fillStyle = gradient2;

    ctx.fillRect(0, 0, canvas.width(), rect2YStop);
  }
};
