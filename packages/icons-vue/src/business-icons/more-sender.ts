import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const MoreSender: FunctionalComponent<BusinessIconImageProps> = ({
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
      viewBox: '0 0 48 48',
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
        d: 'M36.9231 12C37.6575 12 38.3619 12.2918 38.8812 12.8111C39.4006 13.3304 39.6923 14.0348 39.6923 14.7692V33.2308C39.6923 33.9652 39.4006 34.6696 38.8812 35.1889C38.3619 35.7082 37.6575 36 36.9231 36H11.0769C10.3425 36 9.63811 35.7082 9.11878 35.1889C8.59945 34.6696 8.30769 33.9652 8.30769 33.2308V14.7692C8.30769 14.0348 8.59945 13.3304 9.11878 12.8111C9.63811 12.2918 10.3425 12 11.0769 12H36.9231ZM35.0769 27.6923H12.9231V30.4615H35.0769V27.6923ZM22.1538 16.6154H12.9231V24.9231H22.1538V16.6154ZM35.0769 22.1538H24V24.9231H35.0769V22.1538ZM19.3846 19.3846V22.1538H15.6923V19.3846H19.3846Z',
      }),
    ],
  );

export default MoreSender;
