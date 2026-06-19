import type { SVGAttributes } from 'svelte/elements';
import type { Snippet, Component } from 'svelte';

export type Attrs = SVGAttributes<SVGSVGElement>;
type IconNodeElements =
  | 'circle'
  | 'ellipse'
  | 'g'
  | 'line'
  | 'path'
  | 'polygon'
  | 'polyline'
  | 'rect';

export type IconNode = [elementName: IconNodeElements, attrs: Attrs][];

export interface YCloudIconsProps extends Attrs {
  name?: string;
  color?: string;
  size?: number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  iconNode?: IconNode;
  children?: Snippet;
  title?: string;
}

export type IconProps = YCloudIconsProps;

export type YCloudIcon = Component<YCloudIconsProps>;

export type IconEvents = {
  [evt: string]: CustomEvent<any>;
};

export type IconSlots = {
  default: {};
};
