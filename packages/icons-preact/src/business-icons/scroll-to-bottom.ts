import { h } from 'preact';
import type { BusinessIconImageProps } from '../businessTypes';

const ScrollToBottom = ({
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
      viewBox: '0 0 26 26',
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
        'g',
        {
          'clip-path': 'url(#clip0_3626_8464)',
        },
        [
          h('path', {
            'fill-rule': 'evenodd',
            'clip-rule': 'evenodd',
            d: 'M18.0235 8.29806C18.3183 7.98306 18.302 7.48866 17.987 7.1938C17.672 6.89894 17.1776 6.91527 16.8828 7.23027L12.9934 11.3853L9.11697 7.23116C8.8226 6.9157 8.32823 6.8986 8.01278 7.19297C7.69732 7.48735 7.68022 7.98171 7.97459 8.29717L12.4213 13.0624C12.5689 13.2206 12.7755 13.3105 12.9919 13.3107C13.2083 13.3109 13.415 13.2213 13.5629 13.0633L18.0235 8.29806ZM18.0235 14.0042C18.3183 13.6892 18.302 13.1948 17.987 12.9C17.672 12.6051 17.1776 12.6214 16.8828 12.9364L12.9934 17.0915L9.11697 12.9373C8.8226 12.6219 8.32823 12.6048 8.01278 12.8992C7.69732 13.1935 7.68022 13.6879 7.97459 14.0033L12.4213 18.7686C12.5689 18.9268 12.7755 19.0167 12.9919 19.0169C13.2083 19.017 13.415 18.9275 13.5629 18.7695L18.0235 14.0042Z',
            fill: 'currentColor',
          }),
        ],
      ),
      h('defs', {}, [
        h(
          'clipPath',
          {
            id: 'clip0_3626_8464',
          },
          [
            h('rect', {
              width: '25',
              height: '25',
              fill: 'currentColor',
              transform: 'matrix(0 1 -1 0 25.5 0.5)',
            }),
          ],
        ),
      ]),
    ],
  );

export default ScrollToBottom;
