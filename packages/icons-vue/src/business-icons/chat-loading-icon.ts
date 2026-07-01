import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const ChatLoadingIcon: FunctionalComponent<BusinessIconImageProps> = ({
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
      h('circle', {
        cx: '5',
        cy: '12.2285',
        r: '1.5',
        fill: 'currentColor',
      }),
      h('circle', {
        cx: '12',
        cy: '12.2285',
        r: '1.5',
        fill: 'currentColor',
        'fill-opacity': '0.8',
      }),
      h('circle', {
        cx: '19',
        cy: '12.2285',
        r: '1.5',
        fill: 'currentColor',
        'fill-opacity': '0.3',
      }),
    ],
  );

export default ChatLoadingIcon;
