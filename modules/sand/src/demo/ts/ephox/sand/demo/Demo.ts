import { document } from '@ephox/dom-globals';
import * as PlatformDetection from 'ephox/sand/api/PlatformDetection';

const browser = PlatformDetection.detectBrowser();

const ephoxUi = document.querySelector('#ephox-ui');
ephoxUi.innerHTML = 'You are using: ' + browser.current;
