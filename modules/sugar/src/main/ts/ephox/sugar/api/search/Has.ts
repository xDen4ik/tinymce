import { Arr, Fun } from '@ephox/katamari';
import * as Compare from '../dom/Compare';
import Element from '../node/Element';
import * as PredicateExists from './PredicateExists';
import { Node as DomNode } from '@ephox/dom-globals';

const ancestor = function (element: Element<DomNode>, target: Element<DomNode>) {
  return PredicateExists.ancestor(element, Compare.eqc(target));
};

const anyAncestor = function (element: Element<DomNode>, targets: Element<DomNode>[]) {
  return Arr.exists(targets, function (target) {
    return ancestor(element, target);
  });
};

const sibling = function (element: Element<DomNode>, targets: Element<DomNode>[]) {
  return PredicateExists.sibling(element, (elem) => Arr.exists(targets, Compare.eqc(elem)));
};

const child = function (element: Element<DomNode>, target: Element<DomNode>) {
  return PredicateExists.child(element, Compare.eqc(target));
};

const descendant = function (element: Element<DomNode>, target: Element<DomNode>) {
  return PredicateExists.descendant(element, Compare.eqc(target));
};

export { ancestor, anyAncestor, sibling, child, descendant, };
