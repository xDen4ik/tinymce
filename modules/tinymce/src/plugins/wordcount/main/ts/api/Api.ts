/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { countCharacters, countCharactersWithoutSpaces, Counter, countWords } from '../core/Count';

export type CountGetter = () => number;

interface CountGetters {
  getWordCount: CountGetter;
  getCharacterCount: CountGetter;
  getCharacterCountWithoutSpaces: CountGetter;
}

export interface WordCountApi {
  body: CountGetters;
  selection: CountGetters;
}

const get = (editor: Editor): WordCountApi => {
  const createBodyCounter = (count: Counter): CountGetter => () =>
    count(editor.getBody(), editor.schema);

  const createSelectionCounter = (count: Counter): CountGetter => () =>
    count(editor.selection.getRng().cloneContents(), editor.schema);

  const bodyWordCounter = createBodyCounter(countWords);

  return {
    body: {
      getWordCount: bodyWordCounter,
      getCharacterCount: createBodyCounter(countCharacters),
      getCharacterCountWithoutSpaces: createBodyCounter(countCharactersWithoutSpaces)
    },
    selection: {
      getWordCount: createSelectionCounter(countWords),
      getCharacterCount: createSelectionCounter(countCharacters),
      getCharacterCountWithoutSpaces: createSelectionCounter(countCharactersWithoutSpaces)
    }
  };
};

export {
  get
};
