/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Arr, Fun, Option } from '@ephox/katamari';
import { Compare, Insert, Replication, Element, Fragment, Node, SelectorFind, Traverse } from '@ephox/sugar';
import * as ElementType from '../dom/ElementType';
import Parents from '../dom/Parents';
import * as SelectionUtils from './SelectionUtils';
import SimpleTableModel from './SimpleTableModel';
import TableCellSelection from './TableCellSelection';
import { Range } from '@ephox/dom-globals';

const findParentListContainer = (parents: Element[]): Option<Element> => {
  return Arr.find(parents, (elm: Element): boolean => {
    return Node.name(elm) === 'ul' || Node.name(elm) === 'ol';
  });
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

const getWrapElements = (rootNode: Element, rng: Range): Element[] => {
  const commonAnchorContainer = Element.fromDom(rng.commonAncestorContainer);
  const parents = Parents.parentsAndSelf(commonAnchorContainer, rootNode);
  const wrapElements = Arr.filter(parents, (elm: Element): boolean => {
    return ElementType.isInline(elm) || ElementType.isHeading(elm);
  });
  const listWrappers = getFullySelectedListWrappers(parents, rng);
  const allWrappers = wrapElements.concat(listWrappers.length ? listWrappers : directListWrappers(commonAnchorContainer));
  return Arr.map(allWrappers, Replication.shallow);
};

const emptyFragment = (): Element => {
  return Fragment.fromElements([]);
};

const getFragmentFromRange = (rootNode: Element, rng: Range): Element => {
  return wrap(Element.fromDom(rng.cloneContents()), getWrapElements(rootNode, rng));
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

const getSelectionFragment = (rootNode: Element, ranges: Range[]): Element => {
  return ranges.length > 0 && ranges[0].collapsed ? emptyFragment() : getFragmentFromRange(rootNode, ranges[0]);
};

const read = (rootNode: Element, ranges: Range[]): Element => {
  const selectedCells = TableCellSelection.getCellsFromElementOrRanges(ranges, rootNode);
  return selectedCells.length > 0 ? getTableFragment(rootNode, selectedCells) : getSelectionFragment(rootNode, ranges);
};

export default {
  read
};