/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Arr, Fun, Option, Obj } from '@ephox/katamari';
import { Compare, Insert, Replication, Element, Fragment, Node, SelectorFind, Traverse } from '@ephox/sugar';
import * as ElementType from '../dom/ElementType';
import Parents from '../dom/Parents';
import * as SelectionUtils from './SelectionUtils';
import SimpleTableModel from './SimpleTableModel';
import TableCellSelection from './TableCellSelection';
import DOMUtils from '../api/dom/DOMUtils';
import { Range } from '@ephox/dom-globals';

const findParentListContainer = (parents: Element[]): Option<Element> => {
  return Arr.find(parents, (elm: Element): boolean => {
    return Node.name(elm) === 'ul' || Node.name(elm) === 'ol';
  });
};

const getFullySelectedParagraphWrappers = (parents: Element[], rng: Range, forcedRootBlock: string): Element[] => {
  return Arr.find(parents, (elm: Element): boolean => {
    return Node.name(elm) === forcedRootBlock && SelectionUtils.hasAllContentsSelected(elm, rng);
  }).fold(
    Fun.constant([]),
    (p: Element): Element[] => [
      p
    ]
  );
};

const getFullySelectedListWrappers = (parents: Element[], rng: Range): Element[] => {
  return Arr.find(parents, (elm: Element): boolean => {
    return Node.name(elm) === 'li' && SelectionUtils.hasAllContentsSelected(elm, rng);
  }).fold(
    Fun.constant([]),
    (li: Element): Element[] => {
      return findParentListContainer(parents).map((listCont: Element): Element[] => {
        return [
          Element.fromTag('li'),
          Element.fromTag(Node.name(listCont))
        ];
      }).getOr([]);
    }
  );
};

const wrap = (innerElm: Element, elms: Element[]): Element => {
  const wrapped = Arr.foldl(elms, (acc: Element, elm: Element): Element => {
    Insert.append(elm, acc);
    return elm;
  }, innerElm);
  return elms.length > 0 ? Fragment.fromElements([wrapped]) : wrapped;
};

const directListWrappers = (commonAnchorContainer: Element): Element[] => {
  if (ElementType.isListItem(commonAnchorContainer)) {
    return Traverse.parent(commonAnchorContainer).filter(ElementType.isList).fold(
      Fun.constant([]),
      (listElm: Element): Element[] => {
        return [ commonAnchorContainer, listElm ];
      }
    );
  } else {
    return ElementType.isList(commonAnchorContainer) ? [ commonAnchorContainer ] : [ ];
  }
};

const requiresP = (dom: DOMUtils, listWrappers: Element[], commonAnchorContainer: Element, readBlockParent: boolean): boolean => {
  if (listWrappers.length > 0 || !readBlockParent) {
    return false;
  }
  const textInlinesMap = dom.schema.getTextInlineElements();
  const nodeName = Node.name(commonAnchorContainer);
  return Node.isText(commonAnchorContainer) || Obj.has(textInlinesMap, nodeName.toLowerCase());
};

const getWrapElements = (dom: DOMUtils, rootNode: Element, rng: Range, forcedRootBlock: string, readBlockParent: boolean): Element[] => {
  const commonAnchorContainer = Element.fromDom(rng.commonAncestorContainer);
  const parents = Parents.parentsAndSelf(commonAnchorContainer, rootNode);
  const wrapElements = Arr.filter(parents, (elm: Element): boolean => {
    return ElementType.isInline(elm) || ElementType.isHeading(elm);
  });
  const listWrappers = getFullySelectedListWrappers(parents, rng);
  const pWrappers = requiresP(dom, listWrappers, commonAnchorContainer, readBlockParent) ? getFullySelectedParagraphWrappers(parents, rng, forcedRootBlock) : listWrappers;
  const allWrappers = wrapElements.concat(pWrappers.length ? pWrappers : directListWrappers(commonAnchorContainer));
  return Arr.map(allWrappers, Replication.shallow);
};

const emptyFragment = (): Element => {
  return Fragment.fromElements([]);
};

const getFragmentFromRange = (dom: DOMUtils, rootNode: Element, rng: Range, forcedRootBlock: string, readBlockParent: boolean): Element => {
  return wrap(Element.fromDom(rng.cloneContents()), getWrapElements(dom, rootNode, rng, forcedRootBlock, readBlockParent));
};

const getParentTable = (rootElm: Element, cell: Element): Option<Element> => {
  return SelectorFind.ancestor(cell, 'table', Fun.curry(Compare.eq, rootElm));
};

const getTableFragment = (rootNode: Element, selectedTableCells: Element[]): Element => {
  return getParentTable(rootNode, selectedTableCells[0]).bind((tableElm: Element) => {
    const firstCell = selectedTableCells[0];
    const lastCell = selectedTableCells[selectedTableCells.length - 1];
    const fullTableModel = SimpleTableModel.fromDom(tableElm);

    return SimpleTableModel.subsection(fullTableModel, firstCell, lastCell).map(function (sectionedTableModel) {
      return Fragment.fromElements([SimpleTableModel.toDom(sectionedTableModel)]);
    });
  }).getOrThunk(emptyFragment);
};

const getSelectionFragment = (dom: DOMUtils, rootNode: Element, ranges: Range[], forcedRootBlock: string, readBlockParent: boolean): Element => {
  return ranges.length > 0 && ranges[0].collapsed ? emptyFragment() : getFragmentFromRange(dom, rootNode, ranges[0], forcedRootBlock, readBlockParent);
};

const read = (dom: DOMUtils, rootNode: Element, ranges: Range[], forcedRootBlock: string, readBlockParent: boolean): Element => {
  const selectedCells = TableCellSelection.getCellsFromElementOrRanges(ranges, rootNode);
  return selectedCells.length > 0 ? getTableFragment(rootNode, selectedCells) : getSelectionFragment(dom, rootNode, ranges, forcedRootBlock, readBlockParent);
};

export default {
  read
};