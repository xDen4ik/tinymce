import { navigator } from '@ephox/dom-globals';
import { Strings } from '@ephox/katamari';

// TODO: Add ChromeEdge, Brave, Chromium
export type Browser = 'IE' | 'Edge' | 'Chrome' | 'Opera' | 'Firefox' | 'Safari' | 'PhantomJS' | 'Unknown';

type BrowserOverride = Browser | undefined;

// Yes, a Cell<Option<Browser>> would be nice, but we'd like to avoid a Katamari dependency here
let override: BrowserOverride;

export const setOverride = (bo: Browser): void => {
  override = bo;
};

export const clearOverride = (): void => {
  override = undefined;
};

export const getOverride = (): BrowserOverride => override;

const makeGetter = (browser: Browser, pred: (lcaseUaString: string) => boolean) => (uastring: string = navigator.userAgent): boolean =>
  override === undefined ? pred(String(uastring).toLowerCase()) : override === browser;

export const isIE = makeGetter('IE', (uastring) =>
  Strings.contains(uastring, 'msie') || Strings.contains(uastring, 'trident')
);

export const isEdge = makeGetter('Edge', (lcaseUaString) =>
  Strings.containsAll(lcaseUaString, ['edge/', 'chrome', 'safari', 'applewebkit'])
);

export const isChrome = makeGetter('Chrome', (lcaseUaString) =>
  Strings.contains(lcaseUaString, 'chrome') &&
  !Strings.contains(lcaseUaString, 'chromeframe') &&
  !Strings.contains(lcaseUaString, 'edge')
);

export const isOpera = makeGetter('Opera', (lcaseUaString) =>
  Strings.contains(lcaseUaString, 'opera')
);

export const isFirefox = makeGetter('Firefox', (lcaseUaString) =>
  Strings.contains(lcaseUaString, 'firefox')
);

export const isSafari = makeGetter('Safari', (lcaseUaString) =>
  (Strings.contains(lcaseUaString, 'safari') || Strings.contains(lcaseUaString, 'mobile/')) &&
  Strings.contains(lcaseUaString, 'applewebkit') &&
  !Strings.contains(lcaseUaString, 'edge') &&
  !Strings.contains(lcaseUaString, 'phantomjs') &&
  !Strings.contains(lcaseUaString, 'chrome')
);

export const isPhantomJS = makeGetter('PhantomJS', (lcaseUaString) =>
  Strings.contains(lcaseUaString, 'phantomjs')
);
