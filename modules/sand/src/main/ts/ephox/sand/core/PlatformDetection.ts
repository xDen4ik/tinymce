import { Browser } from './Browser';
import { OperatingSystem } from './OperatingSystem';
import { DeviceType } from '../detect/DeviceType';
import { UaString } from '../detect/UaString';
import * as PlatformInfo from '../info/PlatformInfo';

export interface PlatformDetection {
  readonly browser: Browser;
  readonly os: OperatingSystem;
  readonly deviceType: DeviceType;
}

/**
 * @deprecated Please detect OS, Browser and DeviceType separately.
 * @param userAgent
 * @param mediaMatch
 */
export const detect = function (userAgent: string, mediaMatch: (query: string) => boolean): PlatformDetection {
  const browsers = PlatformInfo.browsers;
  const oses = PlatformInfo.oses;

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
  return UaString.detectBrowser(PlatformInfo.browsers, userAgent).fold(
    Browser.unknown,
    Browser.nu
  );
};

export const detectOs = function (userAgent: string): OperatingSystem {
  return UaString.detectOs(PlatformInfo.oses, userAgent).fold(
    OperatingSystem.unknown,
    OperatingSystem.nu
  );
};

export const detectDeviceType = function (userAgent: string, mediaMatch: (query: string) => boolean): DeviceType {
  const browsers = PlatformInfo.browsers;
  const oses = PlatformInfo.oses;

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
