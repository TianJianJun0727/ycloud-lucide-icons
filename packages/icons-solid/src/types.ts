import type { JSX } from 'solid-js/jsx-runtime';

export type IconNode = [elementName: keyof JSX.IntrinsicElements, attrs: Record<string, string>][];
export type SVGAttributes = Partial<JSX.SvgSVGAttributes<SVGSVGElement>>;

export interface YCloudIconsProps extends SVGAttributes {
  key?: string | number;
  class?: string;
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type YCloudIcon = (props: YCloudIconsProps) => JSX.Element;
