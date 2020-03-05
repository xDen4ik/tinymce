/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';

declare let html2pdf;

const register = (editor: Editor) => {
  editor.ui.registry.addMenuItem('exportpdf', {
    text: 'Export as pdf...',
    onAction: () => html2pdf(editor.getContent())
  });
};

export default {
  register
};