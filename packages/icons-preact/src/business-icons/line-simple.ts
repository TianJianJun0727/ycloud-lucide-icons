import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

const LineSimple = ({
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
      viewBox: '0 0 24 24',
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
        d: 'M2.34961 4C2.34961 3.64101 2.64101 3.34961 3 3.34961C3.35899 3.34961 3.65039 3.64101 3.65039 4V18.9496C3.65039 19.1705 3.82948 19.3496 4.05039 19.3496H21C21.359 19.3496 21.6504 19.641 21.6504 20C21.6504 20.359 21.359 20.6504 21 20.6504H3.34961C2.79732 20.6504 2.34961 20.2027 2.34961 19.6504V4Z',
        fill: 'currentColor',
      }),
      h('line', {
        x1: '7.15',
        y1: '12.65',
        x2: '7.15',
        y2: '16.35',
        stroke: 'currentColor',
        'stroke-width': '1.3',
        'stroke-linecap': 'round',
      }),
      h('line', {
        x1: '10.65',
        y1: '9.65',
        x2: '10.65',
        y2: '16.35',
        stroke: 'currentColor',
        'stroke-width': '1.3',
        'stroke-linecap': 'round',
      }),
      h('line', {
        x1: '18.65',
        y1: '6.65',
        x2: '18.65',
        y2: '16.35',
        stroke: 'currentColor',
        'stroke-width': '1.3',
        'stroke-linecap': 'round',
      }),
      h('line', {
        x1: '14.65',
        y1: '10.65',
        x2: '14.65',
        y2: '16.35',
        stroke: 'currentColor',
        'stroke-width': '1.3',
        'stroke-linecap': 'round',
      }),
    ],
  );

export default LineSimple;
