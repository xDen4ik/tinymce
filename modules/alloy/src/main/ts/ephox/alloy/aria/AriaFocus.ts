import { Option } from '@ephox/katamari';
import { Compare, Focus, PredicateFind, Traverse, Element } from '@ephox/sugar';

const preserve = <T>(f: (e: Element) => T, container: Element): T => {
  const ownerDoc = Traverse.owner(container);

  const refocus = Focus.active(ownerDoc).bind((focused: Element) => {
    const hasFocus = Compare.eqc(focused);
    return hasFocus(container) ? Option.some(container) : PredicateFind.descendant(container, hasFocus);
  });

  const result = f(container);

  // If there is a focused element, the F function may cause focus to be lost (such as by hiding elements). Restore it afterwards.
  refocus.each((oldFocus: Element) => {
    if (Focus.active(ownerDoc).filter(Compare.eqc(oldFocus)).isNone()) {
      // Only refocus if the focus has changed, otherwise we break IE
      Focus.focus(oldFocus);
    }
  });
  return result;
};

export {
  preserve
};
