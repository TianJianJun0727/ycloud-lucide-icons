import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

const MobilePhone = ({
  size = 24,
  width,
  height,
  alt = '',
  color = 'currentColor',
  style,
  ...props
}: BusinessIconImageProps) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 16 16',
      fill: 'currentColor',
      width: width ?? size,
      height: height ?? size,
      role: alt ? 'img' : undefined,
      'aria-label': alt || undefined,
      'aria-hidden': alt ? undefined : true,
      color,
      style,
      ...props,
    },
    [
      h('path', {
        d: 'M10.4638 2.66675H5.63293C5.10153 2.66675 4.66675 3.10311 4.66675 3.63644V12.3637C4.66675 12.8971 5.10153 13.3334 5.63293 13.3334H10.4638C10.9953 13.3334 11.43 12.8971 11.43 12.3637V3.63644C11.43 3.10311 10.9953 2.66675 10.4638 2.66675ZM10.4638 11.394H5.63293V4.60614H10.4638V11.394Z',
      }),
    ],
  );

export default MobilePhone;
