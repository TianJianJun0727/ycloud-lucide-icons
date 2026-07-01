import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const CompassFilled: FunctionalComponent<BusinessIconImageProps> = ({
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
        d: 'M13 21.5C8.02919 21.5 4 17.4708 4 12.5C4 7.52919 8.02919 3.5 13 3.5C17.9708 3.5 22 7.52919 22 12.5C22 17.4708 17.9708 21.5 13 21.5ZM12.8706 14.2089C12.4173 14.2089 11.9825 14.0288 11.6619 13.7082C11.3413 13.3876 11.1612 12.9528 11.1612 12.4994C11.1612 12.0461 11.3413 11.6113 11.6619 11.2907C11.9825 10.9701 12.4173 10.79 12.8706 10.79C13.324 10.79 13.7588 10.9701 14.0794 11.2907C14.4 11.6113 14.5801 12.0461 14.5801 12.4994C14.5801 12.9528 14.4 13.3876 14.0794 13.7082C13.7588 14.0288 13.324 14.2089 12.8706 14.2089ZM16.9094 7.48138L10.4941 9.90631C10.3068 9.97719 10.1599 10.1313 10.0947 10.3265L7.97575 16.6496C7.79462 17.1896 8.29356 17.7088 8.81781 17.5248L15.2056 15.2787C15.4008 15.2101 15.5543 15.0521 15.6207 14.8501L17.7655 8.34762C17.9461 7.80088 17.4342 7.28225 16.9094 7.48138Z',
      }),
    ],
  );

export default CompassFilled;
