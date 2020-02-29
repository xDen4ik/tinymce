import { Universe } from '@ephox/boss';
import { Arr, Fun } from '@ephox/katamari';

const isDuplicate = function <E, D> (universe: Universe<E, D>, rest: E[], item: E) {
  return Arr.exists(rest, Fun.curry2(universe.eq, item));
};

const isChild = function <E, D> (universe: Universe<E, D>, rest: E[], item: E) {
  const parents = universe.up().all(item);
  return Arr.exists(parents, function (p) {
    return isDuplicate(universe, rest, p);
  });
};

/**
 * Flattens the item list into just the top-most elements in the tree.
 *
 * In other words, removes duplicates and children.
 */
const simplify = function <E, D> (universe: Universe<E, D>, items: E[]) {
// FIX: Horribly inefficient.
  return Arr.filter(items, function (x, i) {
    const left = items.slice(0, i);
    const right = items.slice(i + 1);
    const rest = left.concat(right);
    return !(isDuplicate(universe, right, x) || isChild(universe, rest, x));
  });
};

export {
  simplify
};
