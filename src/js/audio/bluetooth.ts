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
