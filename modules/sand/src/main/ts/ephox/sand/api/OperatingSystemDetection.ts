import { navigator } from '@ephox/dom-globals';
import { Strings } from '@ephox/katamari';

export type OperatingSystem = 'Windows' | 'iOS' | 'Android' | 'Linux' | 'macOS' | 'Solaris' | 'FreeBSD' | 'ChromeOS' | 'Unknown';

type OperatingSystemOverride = OperatingSystem | undefined;

// Yes, a Cell<Option<OperatingSystem>> would be nice, but we'd like to avoid a Katamari dependency here
let override: OperatingSystemOverride;

export const setOverride = (bo: OperatingSystem): void => {
  override = bo;
};

export const clearOverride = (): void => {
  override = undefined;
};

export const getOverride = (): OperatingSystemOverride => override;

const makeGetter = (operatingSystem: OperatingSystem, pred: (lcaseUaString: string) => boolean) => (uastring: string = navigator.userAgent): boolean =>
  override === undefined ? pred(String(uastring).toLowerCase()) : override === operatingSystem;

const checkContains = (target: string) => (uastring: string) => Strings.contains(uastring, target);

const simpleGetter = (os: OperatingSystem, searchString: string) =>
  makeGetter(os, checkContains(searchString));

export const isWindows = simpleGetter('Windows', 'win');

export const isAndroid = simpleGetter('Android', 'android');

export const isMacOs = simpleGetter('macOS', 'mac os x');

export const isLinux = simpleGetter('Linux', 'linux');

export const isSolaris = simpleGetter('Solaris', 'sunos');

export const isFreeBSD = simpleGetter('FreeBSD', 'freebsd');

export const isChromeOS = simpleGetter('ChromeOS', 'cros');

export const isIos = makeGetter('iOS', (uastring) =>
  Strings.contains(uastring, 'iphone') || Strings.contains(uastring, 'ipad')
);
