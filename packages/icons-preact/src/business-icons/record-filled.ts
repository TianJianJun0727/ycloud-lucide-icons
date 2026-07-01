import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

const RecordFilled = ({
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
      viewBox: '0 0 25 25',
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
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M16.159 7.11407C16.159 7.70782 16.6408 8.18961 17.2346 8.18961H20.3933V20.7228C20.3933 21.4998 19.8674 22.1309 19.2194 22.1309H5.73277C5.08473 22.1309 4.55884 21.4998 4.55884 20.7228V4.5389C4.55884 3.76193 5.08134 3.13086 5.72937 3.13086H16.159V7.11407ZM11.1783 16.9737L16.0776 12.0744C16.2167 11.9353 16.2167 11.708 16.0776 11.5689L14.5949 10.0862C14.4558 9.94711 14.2285 9.94711 14.0894 10.0862L9.19009 14.9855C9.13919 15.0364 9.10527 15.0975 9.09169 15.1687L8.72527 17.0178C8.67437 17.2689 8.89491 17.4894 9.14598 17.4385L10.9951 17.0721C11.0629 17.0585 11.1274 17.0246 11.1783 16.9737ZM17.5942 6.75783V3.97568L19.959 6.75783H17.5942Z',
      }),
    ],
  );

export default RecordFilled;
