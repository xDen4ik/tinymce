import { Browser } from 'ephox/sand/core/Browser';

const isEdge = (browser: Browser) => browser.isEdge();

const isChrome = (browser: Browser) => browser.isChrome();

const isFirefox = (browser: Browser) => browser.isFirefox();

const isIE11 = (browser: Browser) => isIE(browser) && browser.version.major === 11;

const isIE = (browser: Browser) => browser.isIE();

const isSafari = (browser: Browser) => browser.isSafari();

const isOpera = (browser: Browser) => browser.isOpera();

export {
  isEdge,
  isChrome,
  isFirefox,
  isOpera,
  isIE11,
  isIE,
  isSafari
};
