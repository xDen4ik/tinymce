import { Assertions, Log, Pipeline, Step } from '@ephox/agar';
import { Element } from '@ephox/sugar';
import { UnitTest } from '@ephox/bedrock-client';
import { document } from '@ephox/dom-globals';
import { TinyLoader } from '@ephox/mcagar';
import DomQuery from 'tinymce/core/api/dom/DomQuery';
import Plugin from 'tinymce/plugins/lists/Plugin';
import SilverTheme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('tinymce.lists.browser.BackspaceDeleteInlineTest', (success, failure) => {
  Plugin();
  SilverTheme();

  const teardown = function (editor, div) {
    editor.remove();
    div.parentNode.removeChild(div);
  };

  TinyLoader.setupFromElement((editor, onSuccess, onFailure) => {
    // const div = document.createElement('div');
    // div.innerHTML = (
    //   '<div id="lists">' +
    //   '<ul><li>before</li></ul>' +
    //   '<ul id="inline"><li>x</li></ul>' +
    //   '<ul><li>after</li></ul>' +
    //   '</div>'
    // );
    // document.body.appendChild(div);

    Pipeline.async({}, [
      Log.step('', 'Lists: Backspace at beginning of LI on body UL', Step.sync(() => {
        editor.focus();
        editor.selection.setCursorLocation(editor.getBody().firstChild.firstChild, 0);
        editor.plugins.lists.backspaceDelete();
        Assertions.assertEq('Assert number of ul', 3, DomQuery('#lists ul').length);
        Assertions.assertEq('Assert number of li', 3, DomQuery('#lists li').length);
      })),
      Log.step('', 'Lists: Delete at end of LI on body UL', Step.sync(() => {
        editor.focus();
        editor.selection.setCursorLocation(editor.getBody().firstChild.firstChild, 1);
        editor.plugins.lists.backspaceDelete(true);
        Assertions.assertEq('Assert number of ul', 3, DomQuery('#lists ul').length);
        Assertions.assertEq('Assert number of li', 3, DomQuery('#lists li').length);
      }))
    ], Element.fromHtml(), 
    () => {
      teardown(editor, div);
      onSuccess();
    }, 
    (e) => {
      teardown(editor, div);
      onFailure(e);
    });
  }, {
    inline: true,
    add_unload_trigger: false,
    skin: false,
    plugins: 'lists',
    disable_nodechange: true,
    valid_styles: {
      '*': 'color,font-size,font-family,background-color,font-weight,font-style,text-decoration,float,' +
      'margin,margin-top,margin-right,margin-bottom,margin-left,display,position,top,left,list-style-type'
    }
  }, success, failure);
});
