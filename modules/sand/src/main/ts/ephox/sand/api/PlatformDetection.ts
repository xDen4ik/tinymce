import { navigator, window } from '@ephox/dom-globals';
import { Cell } from '@ephox/katamari';

import { Browser as BrowserCore } from '../core/Browser';
import { OperatingSystem as OperatingSystemCore } from '../core/OperatingSystem';
import * as PD from '../core/PlatformDetection';
import { DeviceType as DeviceTypeCore } from '../detect/DeviceType';

export type Browser = BrowserCore;
export type OperatingSystem = OperatingSystemCore;
export type DeviceType = DeviceTypeCore;
export type PlatformDetection = PD.PlatformDetection;

const mediaMatch = (query: string) => window.matchMedia(query).matches;

const platform = Cell<PlatformDetection>(PD.detect(navigator.userAgent, mediaMatch));

/**
 * @deprecated use detectOs/detectBrowser instead
 */
export const detect = (): PlatformDetection => platform.get();

/**
 * @deprecated use overrideOs/overrideBrowser instead
 */
export const override = (overrides: Partial<PlatformDetection>) => {
  platform.set({
    ...platform.get(),
    ...overrides
  });
};

const os = Cell<OperatingSystem>(PD.detectOs(navigator.userAgent));

export const detectOs = (): OperatingSystem => os.get();

export const overrideOs = (override: OperatingSystem) => {
  os.set(override);
};

const browser = Cell<Browser>(PD.detectBrowser(navigator.userAgent));

export const detectBrowser = (): Browser => browser.get();

export const overrideBrowser = (override: Browser) => {
  browser.set(override);
};

const deviceType = Cell<DeviceType>(PD.detectDeviceType(navigator.userAgent, mediaMatch));

export const detectDeviceType = (): DeviceType => deviceType.get();

export const overrideDeviceType = (override: DeviceType) => {
  deviceType.set(override);
};
