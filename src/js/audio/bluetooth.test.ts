/**
 * @jest-environment jsdom
 */

import { describe, test, expect, afterEach, jest } from "@jest/globals";
import { isDefaultDeviceBluetooth } from "./bluetooth";

// https://jestjs.io/docs/jest-object#jestreplacepropertyobject-propertykey-value
afterEach(() => {
  jest.restoreAllMocks();
});

const mockDevices = (devices: MediaDeviceInfo[]) => {
  const mockNavigator = {
    mediaDevices: {
      enumerateDevices: async () => devices,
    },
  } as Navigator;
  jest.spyOn(global, "navigator", "get").mockReturnValue(mockNavigator);
};

describe("isDefaultDeviceBluetooth()", () => {
  test("without bluetooth", async () => {
    mockDevices([
      {
        deviceId: "default",
        groupId: "123",
        kind: "audioinput",
        label: "Default - MacBook Pro Microphone (Built-in)",
      } as MediaDeviceInfo,
    ]);

    const bluetooth = await isDefaultDeviceBluetooth();
    expect(bluetooth).toBe(false);
  });

  test("with bluetooth", async () => {
    mockDevices([
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

    const bluetooth = await isDefaultDeviceBluetooth();
    expect(bluetooth).toBe(true);
  });
});
