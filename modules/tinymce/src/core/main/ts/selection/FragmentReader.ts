/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Arr, Fun } from '@ephox/katamari';
import { Compare, Insert, Replication, Element, Fragment, Node, SelectorFind, Traverse } from '@ephox/sugar';
import * as ElementType from '../dom/ElementType';
import Parents from '../dom/Parents';
import * as SelectionUtils from './SelectionUtils';
import SimpleTableModel from './SimpleTableModel';
import TableCellSelection from './TableCellSelection';

const findParentListContainer = function (parents) {
  return Arr.find(parents, function (elm) {
    return Node.name(elm) === 'ul' || Node.name(elm) === 'ol';
  });
};

const getFullySelectedParagraphWrappers = function (parents, rng) {
  return Arr.find(parents, function (elm) {
    return Node.name(elm) === 'p' && SelectionUtils.hasAllContentsSelected(elm, rng);
  }).fold(
    Fun.constant([]),
    (p) => [
      p
    ]
  );
};

const getFullySelectedListWrappers = function (parents, rng) {
  return Arr.find(parents, function (elm) {
    return Node.name(elm) === 'li' && SelectionUtils.hasAllContentsSelected(elm, rng);
  }).fold(
    Fun.constant([]),
    function (li) {
      return findParentListContainer(parents).map(function (listCont) {
        return [
          Element.fromTag('li'),
          Element.fromTag(Node.name(listCont))
        ];
      }).getOr([]);
    }
  );
};

const wrap = function (innerElm, elms) {
  const wrapped = Arr.foldl(elms, function (acc, elm) {
    Insert.append(elm, acc);
    return elm;
  }, innerElm);
  return elms.length > 0 ? Fragment.fromElements([wrapped]) : wrapped;
};

const directListWrappers = function (commonAnchorContainer) {
  if (ElementType.isListItem(commonAnchorContainer)) {
    return Traverse.parent(commonAnchorContainer).filter(ElementType.isList).fold(
      Fun.constant([]),
      function (listElm) {
        return [ commonAnchorContainer, listElm ];
      }
    );
  } else {
    return ElementType.isList(commonAnchorContainer) ? [ commonAnchorContainer ] : [ ];
  }
};

const requiresP = (dom, listWrappers, commonAnchorContainer) => {
  if (listWrappers.length > 0) {
    return false;
  }
  const textInlinesMap = dom.schema.getTextInlineElements();
  const nodeName = Node.name(commonAnchorContainer);
  return Node.isText(commonAnchorContainer) || textInlinesMap[nodeName.toLowerCase()];
};

const getWrapElements = (dom, rootNode, rng) => {
  const commonAnchorContainer = Element.fromDom(rng.commonAncestorContainer);
  const parents = Parents.parentsAndSelf(commonAnchorContainer, rootNode);
  const wrapElements = Arr.filter(parents, function (elm) {
    return ElementType.isInline(elm) || ElementType.isHeading(elm);
  });
  const listWrappers = getFullySelectedListWrappers(parents, rng);
  const pWrappers = requiresP(dom, listWrappers, commonAnchorContainer) ? getFullySelectedParagraphWrappers(parents, rng) : listWrappers;
  const allWrappers = wrapElements.concat(pWrappers.length ? pWrappers : directListWrappers(commonAnchorContainer));
  return Arr.map(allWrappers, Replication.shallow);
};

const emptyFragment = () => {
  return Fragment.fromElements([]);
};

const getFragmentFromRange = (dom, rootNode, rng) => {
  return wrap(Element.fromDom(rng.cloneContents()), getWrapElements(dom, rootNode, rng));
};

const getParentTable = function (rootElm, cell) {
  return SelectorFind.ancestor(cell, 'table', Fun.curry(Compare.eq, rootElm));
};

const getTableFragment = function (rootNode, selectedTableCells) {
  return getParentTable(rootNode, selectedTableCells[0]).bind(function (tableElm) {
    const firstCell = selectedTableCells[0];
    const lastCell = selectedTableCells[selectedTableCells.length - 1];
    const fullTableModel = SimpleTableModel.fromDom(tableElm);

    return SimpleTableModel.subsection(fullTableModel, firstCell, lastCell).map(function (sectionedTableModel) {
      return Fragment.fromElements([SimpleTableModel.toDom(sectionedTableModel)]);
    });
  }).getOrThunk(emptyFragment);
};

const getSelectionFragment = (dom, rootNode, ranges) => {
  return ranges.length > 0 && ranges[0].collapsed ? emptyFragment() : getFragmentFromRange(dom, rootNode, ranges[0]);
};

const read = (dom, rootNode, ranges) => {
  const selectedCells = TableCellSelection.getCellsFromElementOrRanges(ranges, rootNode);
  return selectedCells.length > 0 ? getTableFragment(rootNode, selectedCells) : getSelectionFragment(dom, rootNode, ranges);
};

export default {
  read
};