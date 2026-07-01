import type { SVGAttributes } from 'svelte/elements';

export interface BusinessIconImageProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'color' | 'width' | 'height'
> {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  color?: string;
  secondaryColor?: string;
}
