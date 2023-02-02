const DEFAULT_DEVICE_ID = "default";

const isDefaultInput = (device: MediaDeviceInfo) =>
  device.kind === "audioinput" && device.deviceId === DEFAULT_DEVICE_ID;

/**
 * @returns the default audio input device, if available
 */
const getDefaultInput = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const device = devices.find(isDefaultInput);
  if (device) {
    return device;
  }
  return null;
};

export const isDefaultDeviceBluetooth = async () => {
  const device = await getDefaultInput();
  if (!device) {
    return false;
  }
  return device.label.toLowerCase().includes("bluetooth");
};
