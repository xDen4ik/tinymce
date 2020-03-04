import { Fun, Option } from '@ephox/katamari';
import { Element } from '@ephox/sugar';

interface IdentifiedInput {
  boxes: Option<Element[]>;
  start: Element;
  finish: Element;
}

export interface Identified {
  boxes: () => Option<Element[]>;
  start: () => Element;
  finish: () => Element;
}

export interface IdentifiedExt {
  boxes: () => Element[];
  start: () => Element;
  finish: () => Element;
}

const create = (obj: IdentifiedInput): Identified => ({
  boxes: Fun.constant(obj.boxes),
  start: Fun.constant(obj.start),
  finish: Fun.constant(obj.finish)
});

export const Identified = {
  create
};
