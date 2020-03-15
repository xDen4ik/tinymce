import { Assert, UnitTest } from '@ephox/bedrock-client';
import { Arr } from '@ephox/katamari';
import * as BrowserDetection from 'ephox/sand/api/BrowserDetection';
import fc from 'fast-check';

const check = (
  uaStrings: string[],
  isIE: boolean,
  isChrome: boolean,
  isEdge: boolean,
  isFirefox: boolean,
  isOpera: boolean,
  isPhantomJS: boolean,
  isSafari: boolean
) => {
  Arr.each(uaStrings, (s) => {
    Assert.eq('isIE: ' + s, isIE, BrowserDetection.isIE(s));
    Assert.eq('isChrome: ' + s, isChrome, BrowserDetection.isChrome(s));
    Assert.eq('isEdge: ' + s, isEdge, BrowserDetection.isEdge(s));
    Assert.eq('isFirefox: ' + s, isFirefox, BrowserDetection.isFirefox(s));
    Assert.eq('isOpera: ' + s, isOpera, BrowserDetection.isOpera(s));
    Assert.eq('isPhantomJs: ' + s, isPhantomJS, BrowserDetection.isPhantomJS(s));
    Assert.eq('isSafari: ' + s, isSafari, BrowserDetection.isSafari(s));
  });
};

const ieStrings = [
  'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; InfoPath.3)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; WOW64; Trident/4.0; chromeframe/10.0.648.204; SLCC1; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 1.1.4322; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30729)',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; WOW64; Trident/4.0; SLCC1; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 1.1.4322; .NET CLR 3.5.21022; .NET CLR 3.5.30729; .NET CLR 3.0.30729)',
  'Mozilla/4.0 (compatible; MSIE 7.0; chromeframe/10.0.648.204; Windows NT 5.1)',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)',
  'Mozilla/4.0 (compatible; MSIE 6.0; chromeframe/10.0.648.204; Windows NT 5.1; SV1)'
];

const checkIE = () => {
  check(ieStrings, true, false, false, false, false, false, false);
};

UnitTest.test('BrowserDetectionTest: IE', checkIE);

UnitTest.test('BrowserDetectionTest: Edge', () => {
  check([
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
  ], false, false, true, false, false, false, false);
});

UnitTest.test('BrowserdetectionTest: Chrome', () => {
  check([
    'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/3.0.195.38 Safari/532.0',
    'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/4.0.195.38 Safari/532.0',
    'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.127 Safari/533.4',
    'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.53 Safari/534.3',
    'Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.127 Safari/533.4',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.53 Safari/534.3',
    'Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19',
    'Mozilla/5.0 (X11; CrOS x86_64 12499.66.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.106 Safari/537.36'
  ], false, true, false, false, false, false, false);
});

UnitTest.test('BrowserDetectionTest: Safari', () => {
  check([
    'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.28 (KHTML, like Gecko) Version/3.2.2 Safari/525.28.1',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-au) AppleWebKit/533.17.8 (KHTML, like Gecko) Version/5.0.1 Safari/533.17.8',
    'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A537a Safari/419.3',
    'Mozilla/5.0 (iPad; CPU OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13E230',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Safari/605.1.15' // iPadOS 13
  ], false, false, false, false, false, false, true);
});

UnitTest.test('BrowserDetectionTest: Opera', () => {
  check([
    'Opera/9.80 (Windows NT 6.1; U; en) Presto/2.5.22 Version/10.50',
    'Opera/9.63 (Windows NT 5.1; U; en) Presto/2.1.1'
  ], false, false, false, false, true, false, false);
});

UnitTest.test('BrowserDetectionTest: PhantomJS', () => {
  check([
    'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1'
  ], false, false, false, false, false, true, false);
});

UnitTest.test('BrowserdetectionTest: Override', () => {
  try {
    fc.assert(fc.property(fc.oneof(fc.string(), fc.constantFrom(...ieStrings)), (ua) => {
      BrowserDetection.setOverride('IE');
      check([ua], true, false, false, false, false, false, false);

      BrowserDetection.setOverride('Chrome');
      check([ua], false, true, false, false, false, false, false);

      BrowserDetection.setOverride('Safari');
      check([ua], false, false, false, false, false, false, true);

      BrowserDetection.setOverride('Edge');
      check([ua], false, false, true, false, false, false, false);

      BrowserDetection.setOverride('Opera');
      check([ua], false, false, false, false, true, false, false);

      BrowserDetection.setOverride('PhantomJS');
      check([ua], false, false, false, false, false, true, false);

      BrowserDetection.setOverride('Unknown');
      check([ua], false, false, false, false, false, false, false);

      BrowserDetection.setOverride('Firefox');
      check([ua], false, false, false, true, false, false, false);

    }));
  } finally {
    BrowserDetection.clearOverride();
    checkIE();
  }
});
