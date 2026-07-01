import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

const BenefitSimple = ({
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
      viewBox: '0 0 32 32',
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
        d: 'M16 1.06689C7.78665 1.06689 1.06665 7.78689 1.06665 16.0002C1.06665 24.2136 7.78665 30.9336 16 30.9336C16.4267 30.9336 16.8 30.5602 16.8 30.1336V17.4936C16.8 17.1202 17.12 16.8002 17.4933 16.8002H30.1333C30.56 16.8002 30.9333 16.4269 30.9333 16.0002C30.9333 7.78689 24.2133 1.06689 16 1.06689Z',
      }),
      h('path', {
        d: 'M29.3866 19.6802H20.4799C20.0533 19.6802 19.6799 20.0535 19.6799 20.4802V29.3868C19.6799 29.8135 20.0533 30.1868 20.4799 30.1868H29.3866C29.8133 30.1868 30.1866 29.8135 30.1866 29.3868V20.4802C30.1866 20.0002 29.8133 19.6802 29.3866 19.6802Z',
      }),
    ],
  );

export default BenefitSimple;
