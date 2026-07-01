import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

type MetaFilledProps = BusinessIconImageProps & {
  secondaryColor?: string;
};

const MetaFilled = ({
  size = 24,
  width,
  height,
  alt = '',
  color = 'currentColor',
  secondaryColor = '#fff',
  style,
  ...props
}: MetaFilledProps) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 14 14',
      fill: color,
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
      h('rect', {
        x: '0.5',
        y: '0.5',
        width: '13',
        height: '13',
        rx: '6.5',
        fill: color,
      }),
      h('rect', {
        x: '0.5',
        y: '0.5',
        width: '13',
        height: '13',
        rx: '6.5',
        stroke: secondaryColor,
      }),
      h(
        'g',
        {
          'clip-path': 'url(#clip0_50680_63655)',
        },
        [
          h('path', {
            d: 'M8.67092 4.47656C8.04622 4.47656 7.55788 4.94535 7.11582 5.54086C6.50834 4.77021 6.00031 4.47656 5.39234 4.47656C4.15283 4.47656 3.20312 6.08376 3.20312 7.78489C3.20312 8.8494 3.72001 9.52081 4.58579 9.52081C5.20891 9.52081 5.65707 9.22811 6.45377 7.84055C6.45377 7.84055 6.78588 7.25622 7.01435 6.8537C7.09441 6.98249 7.17873 7.12127 7.26731 7.27003L7.6409 7.89621C8.36866 9.1096 8.77415 9.52081 9.50889 9.52081C10.3523 9.52081 10.8217 8.84022 10.8217 7.75358C10.8217 5.97244 9.8506 4.47656 8.67092 4.47656ZM5.84624 7.46484C5.2003 8.47369 4.97684 8.69982 4.61721 8.69982C4.2471 8.69982 4.02713 8.37608 4.02713 7.79881C4.02713 6.56384 4.64514 5.30104 5.38186 5.30104C5.78081 5.30104 6.11421 5.5306 6.62489 6.25901C6.13998 7.00006 5.84624 7.46484 5.84624 7.46484ZM8.28411 7.33784L7.83742 6.59559C7.71654 6.39971 7.60037 6.21941 7.48891 6.05469C7.8915 5.43559 8.22358 5.1271 8.61854 5.1271C9.43906 5.1271 10.0955 6.33076 10.0955 7.80925C10.0955 8.37281 9.91021 8.69982 9.52635 8.69982C9.15844 8.69982 8.98268 8.45772 8.28411 7.33784Z',
            fill: secondaryColor,
          }),
        ],
      ),
      h('defs', {}, [
        h(
          'clipPath',
          {
            id: 'clip0_50680_63655',
          },
          [
            h('rect', {
              width: '7.61947',
              height: '5.04425',
              fill: secondaryColor,
              transform: 'translate(3.20312 4.47656)',
            }),
          ],
        ),
      ]),
    ],
  );

export default MetaFilled;
