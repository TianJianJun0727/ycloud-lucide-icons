import type { JSX } from 'solid-js';

export interface BusinessIconImageProps extends Omit<
  JSX.SvgSVGAttributes<SVGSVGElement>,
  'color' | 'width' | 'height'
> {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  color?: string;
  secondaryColor?: string;
}
