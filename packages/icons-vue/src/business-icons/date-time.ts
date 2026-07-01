import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const DateTime: FunctionalComponent<BusinessIconImageProps> = ({
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
      h(
        'mask',
        {
          maskUnits: 'userSpaceOnUse',
          x: '3',
          y: '3',
          width: '18',
          height: '18',
        },
        [
          h('path', {
            d: 'M18.2999 4.8H17.3999V3.9C17.3999 3.405 16.9949 3 16.4999 3C16.0049 3 15.5999 3.405 15.5999 3.9V4.8H8.3999V3.9C8.3999 3.405 7.9949 3 7.4999 3C7.0049 3 6.5999 3.405 6.5999 3.9V4.8H5.6999C4.7009 4.8 3.9089 5.61 3.9089 6.6L3.8999 19.2C3.8999 20.19 4.7009 21 5.6999 21H18.2999C19.2899 21 20.0999 20.19 20.0999 19.2V6.6C20.0999 5.61 19.2899 4.8 18.2999 4.8ZM18.2999 18.3C18.2999 18.795 17.8949 19.2 17.3999 19.2H6.5999C6.1049 19.2 5.6999 18.795 5.6999 18.3V9.3H18.2999V18.3ZM7.4999 11.1H9.2999V12.9H7.4999V11.1ZM11.0999 11.1H12.8999V12.9H11.0999V11.1ZM14.6999 11.1H16.4999V12.9H14.6999V11.1Z',
            fill: 'currentColor',
          }),
        ],
      ),
      h(
        'g',
        {
          mask: 'url(#mask0_2866_4619)',
        },
        [
          h('path', {
            d: 'M18.2999 4.8H17.3999V3.9C17.3999 3.405 16.9949 3 16.4999 3C16.0049 3 15.5999 3.405 15.5999 3.9V4.8H8.3999V3.9C8.3999 3.405 7.9949 3 7.4999 3C7.0049 3 6.5999 3.405 6.5999 3.9V4.8H5.6999C4.7009 4.8 3.9089 5.61 3.9089 6.6L3.8999 19.2C3.8999 20.19 4.7009 21 5.6999 21H18.2999C19.2899 21 20.0999 20.19 20.0999 19.2V6.6C20.0999 5.61 19.2899 4.8 18.2999 4.8ZM18.2999 18.3C18.2999 18.795 17.8949 19.2 17.3999 19.2H6.5999C6.1049 19.2 5.6999 18.795 5.6999 18.3V9.3H18.2999V18.3ZM7.4999 11.1H9.2999V12.9H7.4999V11.1ZM11.0999 11.1H12.8999V12.9H11.0999V11.1ZM14.6999 11.1H16.4999V12.9H14.6999V11.1Z',
          }),
        ],
      ),
    ],
  );

export default DateTime;
