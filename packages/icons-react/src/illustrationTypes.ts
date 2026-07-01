import type { SVGProps } from 'react';

export interface IllustrationProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number | string;
  height?: number | string;
  alt?: string;
}
