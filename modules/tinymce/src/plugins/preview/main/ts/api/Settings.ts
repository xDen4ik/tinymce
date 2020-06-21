/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */
import Editor from 'tinymce/core/api/Editor';

const getPreviewDialogWidth = function (editor: Editor) {
  return parseInt(editor.getParam('plugin_preview_width', '650'), 10);
};

const getPreviewDialogHeight = function (editor: Editor) {
  return parseInt(editor.getParam('plugin_preview_height', '500'), 10);
};

const getContentStyle = function (editor: Editor) {
  return editor.getParam('content_style', '');
};

const shouldUseContentCssCors = (editor: Editor): boolean => editor.getParam('content_css_cors', false, 'boolean');


const getBodyClassByHash = (editor: Editor): string => {
  const bodyClass = editor.getParam('body_class', '', 'string');

  return bodyClass[editor.id] || '';
};

const getBodyClass = (editor: Editor): string => {
  const bodyClass = editor.getParam('body_class', '', 'string');

  if (bodyClass.indexOf('=') === -1) {
    return bodyClass;
  }

  return getBodyClassByHash(editor);
};

const getBodyIdByHash = (editor: Editor): string => {
  const bodyId = editor.getParam('body_id', '', 'hash');
  return bodyId[editor.id] || bodyId;
};

const getBodyId = (editor: Editor): string => {
  const bodyId = editor.getParam('body_id', 'tinymce', 'string');

  if (bodyId.indexOf('=') === -1) {
    return bodyId;
  }

  return getBodyIdByHash(editor);
};

export {
  getPreviewDialogWidth,
  getPreviewDialogHeight,
  getContentStyle,
  shouldUseContentCssCors,
  getBodyClass,
  getBodyId,
};
