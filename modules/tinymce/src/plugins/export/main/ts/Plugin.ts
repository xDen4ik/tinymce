/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import Buttons from './ui/Buttons';
import { document } from '@ephox/dom-globals';

export default function () {
  // DO NOT DO THIS, USE RESOURCE INSTEAD
  const script = document.createElement('script');
  script.type = 'application/javascript';
  script.src = 'https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js';
  document.head.appendChild(script);

  PluginManager.add('fullscreen', (editor) => {
    Buttons.register(editor);
  });
}
