import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

const BillingFilled = ({
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
        d: 'M16.4316 4.5C17.2048 4.5 17.832 5.12719 17.832 5.90039H5.40039V6.37012H17.4365C19.0733 6.37015 20.4002 7.6972 20.4004 9.33398V16.25C20.4003 17.8869 19.0734 19.2138 17.4365 19.2139H6.96387C5.32701 19.2138 4.00007 17.8868 4 16.25V5.87012H4.00098C4.01709 5.1109 4.63731 4.5 5.40039 4.5H16.4316ZM15.1914 12.1006C14.8096 12.1007 14.5001 12.4102 14.5 12.792C14.5 13.1739 14.8095 13.4833 15.1914 13.4834H17.0088C17.3906 13.4832 17.7002 13.1738 17.7002 12.792C17.7001 12.4103 17.3905 12.1008 17.0088 12.1006H15.1914Z',
      }),
    ],
  );

export default BillingFilled;
