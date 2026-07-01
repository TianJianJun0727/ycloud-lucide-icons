import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const MouseFilled: FunctionalComponent<BusinessIconImageProps> = ({
  size = 24,
  width,
  height,
  alt = '',
  color = 'currentColor',
  style,
  ...props
}) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 20 20',
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
        d: 'M14.8585 11.0575L14.2798 6.72176C14.0174 4.75762 12.0907 3.33301 9.95057 3.33301C7.81039 3.33301 5.88374 4.75762 5.62131 6.72013L5.04266 11.0559C4.67103 13.8302 6.7623 16.6663 9.9522 16.6663C13.1405 16.6663 15.2317 13.8302 14.8585 11.0575ZM10.8634 7.81223C10.8634 8.31589 10.4542 8.72502 9.95057 8.72502C9.4469 8.72502 9.03777 8.31589 9.03777 7.81223V5.75844C9.03777 5.25477 9.4469 4.84564 9.95057 4.84564C10.4542 4.84564 10.8634 5.25477 10.8634 5.75844V7.81223Z',
      }),
    ],
  );

export default MouseFilled;
