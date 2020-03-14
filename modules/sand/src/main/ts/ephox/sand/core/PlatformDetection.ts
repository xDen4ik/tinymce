import { Browser } from './Browser';
import { OperatingSystem } from './OperatingSystem';
import { DeviceType } from '../detect/DeviceType';
import { UaString } from '../detect/UaString';
import { PlatformInfo } from '../info/PlatformInfo';

export interface PlatformDetection {
  browser: Browser;
  os: OperatingSystem;
  deviceType: DeviceType;
}

/**
 * @deprecated Please detect OS, Browser and DeviceType separately.
 * @param userAgent
 * @param mediaMatch
 */
export const detect = function (userAgent: string, mediaMatch: (query: string) => boolean): PlatformDetection {
  const browsers = PlatformInfo.browsers();
  const oses = PlatformInfo.oses();

  const browser = UaString.detectBrowser(browsers, userAgent).fold(
    Browser.unknown,
    Browser.nu
  );
  const os = UaString.detectOs(oses, userAgent).fold(
    OperatingSystem.unknown,
    OperatingSystem.nu
  );
  const deviceType = DeviceType(os, browser, userAgent, mediaMatch);

  return {
    browser,
    os,
    deviceType
  };
};

export const detectBrowser = function (userAgent: string): Browser {
  const browsers = PlatformInfo.browsers();

  return UaString.detectBrowser(browsers, userAgent).fold(
    Browser.unknown,
    Browser.nu
  );
};

export const detectOs = function (userAgent: string): OperatingSystem {
  const oses = PlatformInfo.oses();

  return UaString.detectOs(oses, userAgent).fold(
    OperatingSystem.unknown,
    OperatingSystem.nu
  );
};

export const detectDeviceType = function (userAgent: string, mediaMatch: (query: string) => boolean): DeviceType {
  const browsers = PlatformInfo.browsers();
  const oses = PlatformInfo.oses();

  const browser = UaString.detectBrowser(browsers, userAgent).fold(
    Browser.unknown,
    Browser.nu
  );
  const os = UaString.detectOs(oses, userAgent).fold(
    OperatingSystem.unknown,
    OperatingSystem.nu
  );
  return DeviceType(os, browser, userAgent, mediaMatch);
};
