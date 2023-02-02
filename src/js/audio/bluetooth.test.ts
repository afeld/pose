import { describe, test, expect } from "@jest/globals";
import { isDefaultDeviceBluetooth } from "./bluetooth";

const mockDevices = (devices: MediaDeviceInfo[]) => {
  return {
    enumerateDevices: async () => devices,
  } as MediaDevices;
};

describe("isDefaultDeviceBluetooth()", () => {
  test("without bluetooth", async () => {
    const md = mockDevices([
      {
        deviceId: "default",
        groupId: "123",
        kind: "audioinput",
        label: "Default - MacBook Pro Microphone (Built-in)",
      } as MediaDeviceInfo,
    ]);

    const bluetooth = await isDefaultDeviceBluetooth(md);
    expect(bluetooth).toBe(false);
  });

  test("with bluetooth", async () => {
    const md = mockDevices([
      {
        deviceId: "default",
        groupId: "123",
        kind: "audioinput",
        label: "Default - Jabra Elite 75t (Bluetooth)",
      } as MediaDeviceInfo,
      {
        deviceId: "456",
        groupId: "789",
        kind: "audioinput",
        label: "MacBook Pro Microphone (Built-in)",
      } as MediaDeviceInfo,
    ]);

    const bluetooth = await isDefaultDeviceBluetooth(md);
    expect(bluetooth).toBe(true);
  });
});
