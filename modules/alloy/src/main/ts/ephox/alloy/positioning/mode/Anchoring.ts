import { Option } from '@ephox/katamari';
import { Element, SimRange } from '@ephox/sugar';

import { Bounds } from '../../alien/Boxes';
import { AlloyComponent } from '../../api/component/ComponentApi';
import { Bubble } from '../layout/Bubble';
import { AnchorBox, AnchorLayout } from '../layout/LayoutTypes';
import { OriginAdt } from '../layout/Origins';

// doPlace(component, origin, anchoring, posConfig, placee);
export type AnchorPlacement =
  (comp: AlloyComponent, origin: OriginAdt, anchoring: Anchoring, getBounds: Option<() => Bounds>, placee: AlloyComponent) => void;

export interface CommonAnchorSpec {
  readonly anchor: string;
}

export type AnchorSpec = SelectionAnchorSpec | HotspotAnchorSpec | SubmenuAnchorSpec | MakeshiftAnchorSpec | NodeAnchorSpec;

export interface AnchorDetail<D> {
  readonly placement: (comp: AlloyComponent, anchor: D, origin: OriginAdt) => Option<Anchoring>;
}

export type MaxHeightFunction =  (elem: Element, available: number) => void;
export type MaxWidthFunction =  (elem: Element, available: number) => void;
export interface AnchorOverrides {
  readonly maxHeightFunction?: MaxHeightFunction;
  readonly maxWidthFunction?: MaxWidthFunction;
}

export interface LayoutsDetail {
  readonly onLtr: (elem: Element) => AnchorLayout[];
  readonly onRtl: (elem: Element) => AnchorLayout[];
  readonly onBottomLtr: Option<(elem: Element) => AnchorLayout[]>;
  readonly onBottomRtl: Option<(elem: Element) => AnchorLayout[]>;
}

export interface HasLayoutAnchor {
  readonly layouts: Option<LayoutsDetail>;
}

export interface Layouts {
  readonly onLtr: (elem: Element) => AnchorLayout[];
  readonly onRtl: (elem: Element) => AnchorLayout[];
  readonly onBottomLtr?: (elem: Element) => AnchorLayout[];
  readonly onBottomRtl?: (elem: Element) => AnchorLayout[];
}

export interface HasLayoutAnchorSpec {
  readonly layouts?: Layouts;
}

export interface SelectionAnchorSpec extends CommonAnchorSpec, HasLayoutAnchorSpec {
  readonly anchor: 'selection';
  readonly getSelection?: () => Option<SimRange>;
  readonly root: Element;
  readonly bubble?: Bubble;
  readonly overrides?: AnchorOverrides;
  readonly showAbove?: boolean;
}

export interface SelectionAnchor extends AnchorDetail<SelectionAnchor>, HasLayoutAnchor {
  readonly getSelection: Option<() => Option<SimRange>>;
  readonly root: Element;
  readonly bubble: Option<Bubble>;
  readonly overrides: AnchorOverrides;
  readonly showAbove: boolean;
}

export interface NodeAnchorSpec extends CommonAnchorSpec, HasLayoutAnchorSpec {
  readonly anchor: 'node';
  readonly node: Option<Element>;
  readonly root: Element;
  readonly bubble?: Bubble;
  readonly overrides?: AnchorOverrides;
  readonly showAbove?: boolean;
}

export interface NodeAnchor extends AnchorDetail<NodeAnchor>, HasLayoutAnchor {
  readonly node: Option<Element>;
  readonly root: Element;
  readonly bubble: Option<Bubble>;
  readonly overrides: AnchorOverrides;
  readonly showAbove: boolean;
}

export interface HotspotAnchorSpec extends CommonAnchorSpec, HasLayoutAnchorSpec {
  readonly anchor: 'hotspot';
  readonly hotspot: AlloyComponent;
  readonly bubble?: Bubble;
  readonly overrides?: AnchorOverrides;
}

export interface HotspotAnchor extends AnchorDetail<HotspotAnchor>, HasLayoutAnchor {
  readonly hotspot: AlloyComponent;
  readonly bubble: Option<Bubble>;
  readonly overrides: AnchorOverrides;
}

export interface SubmenuAnchorSpec extends CommonAnchorSpec, HasLayoutAnchorSpec {
  readonly anchor: 'submenu';
  readonly overrides?: AnchorOverrides;
  readonly item: AlloyComponent;
}

export interface SubmenuAnchor extends AnchorDetail<SubmenuAnchor>, HasLayoutAnchor {
  readonly item: AlloyComponent;
  readonly overrides: AnchorOverrides;
}

export interface MakeshiftAnchorSpec extends CommonAnchorSpec {
  readonly anchor: 'makeshift';
  readonly x: number;
  readonly y: number;
  readonly height?: number;
  readonly width?: number;
  readonly bubble?: Bubble;
  readonly overrides?: AnchorOverrides;
}

export interface MakeshiftAnchor extends AnchorDetail<MakeshiftAnchor>, HasLayoutAnchor {
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly width: number;
  readonly bubble: Bubble;
  readonly overrides: AnchorOverrides;
}

export interface Anchoring {
  readonly anchorBox: AnchorBox;
  readonly bubble: Bubble;
  readonly overrides: AnchorOverrides;
  readonly layouts: AnchorLayout[];
  readonly placer: Option<AnchorPlacement>;
}

const nu: (spec: Anchoring) => Anchoring = (x) => x;

export {
  nu
};
