import { HTMLTableCellElement, HTMLTableElement } from '@ephox/dom-globals';
import { Arr, Fun } from '@ephox/katamari';
import { Element, Width } from '@ephox/sugar';
import { Warehouse } from '../model/Warehouse';
import { BarPositions, ColInfo } from '../resize/BarPositions';
import * as ColumnSizes from '../resize/ColumnSizes';
import * as Sizes from '../resize/Sizes';
import * as CellUtils from '../util/CellUtils';

export interface TableSize {
  width: () => number;
  pixelWidth: () => number;
  getWidths: (warehouse: Warehouse, direction: BarPositions<ColInfo>, tableSize: TableSize) => number[];
  getCellDelta: (delta: number) => number;
  singleColumnWidth: (w: number, delta: number) => number[];
  minCellWidth: () => number;
  setElementWidth: (cell: Element<HTMLTableCellElement>, amount: number) => void;
  setTableWidth: (table: Element<HTMLTableElement>, newWidths: number[], delta: number) => void;
}

const noneSize = (element: Element<HTMLTableElement>): TableSize => {
  const getWidth = () => Width.get(element);
  const singleColumnWidth = function (w: number, delta: number) {
    const newNext = Math.max(CellUtils.minWidth(), w + delta);
    return [ newNext - w ];
  };

  return {
    width: getWidth,
    pixelWidth: getWidth,
    getWidths: ColumnSizes.getPercentageWidths,
    getCellDelta: Fun.identity,
    singleColumnWidth,
    minCellWidth: CellUtils.minWidth,
    setElementWidth: Fun.noop,
    setTableWidth: Fun.noop
  };
};

const percentageSize = (width: string, element: Element<HTMLTableElement>): TableSize => {
  const floatWidth = parseFloat(width);
  const pixelWidth = Width.get(element);
  const getCellDelta = function (delta: number) {
    return delta / pixelWidth * 100;
  };
  const singleColumnWidth = function (w: number, _delta: number) {
    // If we have one column in a percent based table, that column should be 100% of the width of the table.
    return [ 100 - w ];
  };
  // Get the width of a 10 pixel wide cell over the width of the table as a percentage
  const minCellWidth = function () {
    return CellUtils.minWidth() / pixelWidth * 100;
  };
  const setTableWidth = function (table: Element, _newWidths: number[], delta: number) {
    const ratio = delta / 100;
    const change = ratio * floatWidth;
    Sizes.setPercentageWidth(table, floatWidth + change);
  };
  return {
    width: Fun.constant(floatWidth),
    pixelWidth: Fun.constant(pixelWidth),
    getWidths: ColumnSizes.getPercentageWidths,
    getCellDelta,
    singleColumnWidth,
    minCellWidth,
    setElementWidth: Sizes.setPercentageWidth,
    setTableWidth
  };
};

const pixelSize = (width: number): TableSize => {
  const getCellDelta = Fun.identity;
  const singleColumnWidth = function (w: number, delta: number) {
    const newNext = Math.max(CellUtils.minWidth(), w + delta);
    return [ newNext - w ];
  };
  const setTableWidth = function (table: Element, newWidths: number[], _delta: number) {
    const total = Arr.foldr(newWidths, function (b, a) { return b + a; }, 0);
    Sizes.setPixelWidth(table, total);
  };
  return {
    width: Fun.constant(width),
    pixelWidth: Fun.constant(width),
    getWidths: ColumnSizes.getPixelWidths,
    getCellDelta,
    singleColumnWidth,
    minCellWidth: CellUtils.minWidth,
    setElementWidth: Sizes.setPixelWidth,
    setTableWidth
  };
};

const chooseSize = (element: Element<HTMLTableElement>, width: string) => {
  const percentMatch = Sizes.percentageBasedSizeRegex().exec(width);
  if (percentMatch !== null) {
    return percentageSize(percentMatch[1], element);
  }
  const pixelMatch = Sizes.pixelBasedSizeRegex().exec(width);
  if (pixelMatch !== null) {
    const intWidth = parseInt(pixelMatch[1], 10);
    return pixelSize(intWidth);
  }
  const fallbackWidth = Width.get(element);
  return pixelSize(fallbackWidth);
};

const getTableSize = (element: Element<HTMLTableElement>) => {
  const width = Sizes.getRawWidth(element);
  return width.fold(
    () => noneSize(element),
    (w) => chooseSize(element, w)
  );
};

export const TableSize = {
  getTableSize,
  pixelSize,
  percentageSize,
  noneSize
};
