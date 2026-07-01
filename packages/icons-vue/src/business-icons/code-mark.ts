import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const CodeMark: FunctionalComponent<BusinessIconImageProps> = ({
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
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M12.6849 3.60744C12.7787 3.27524 12.5854 2.92993 12.2532 2.83616C11.921 2.7424 11.5757 2.93568 11.4819 3.26788L7.83606 16.1845C7.7423 16.5167 7.93559 16.8621 8.26779 16.9558C8.59998 17.0496 8.9453 16.8563 9.03906 16.5241L12.6849 3.60744ZM4.00007 10.0002L7.25006 13.2502C7.57506 13.5752 7.57506 14.0918 7.25006 14.4168C6.92506 14.7418 6.4084 14.7418 6.0834 14.4168L2.2584 10.5835C1.9334 10.2585 1.9334 9.73351 2.2584 9.40851L6.0834 5.58351C6.4084 5.25851 6.92506 5.25851 7.25006 5.58351C7.57506 5.90851 7.57506 6.42518 7.25006 6.75018L4.00007 10.0002ZM16.8334 10.0002L13.5834 13.2502C13.2584 13.5752 13.2584 14.0918 13.5834 14.4168C13.9084 14.7418 14.4251 14.7418 14.7501 14.4168L18.5751 10.5835C18.9001 10.2585 18.9001 9.73351 18.5751 9.40851L14.7501 5.58351C14.4251 5.25851 13.9084 5.25851 13.5834 5.58351C13.2584 5.90851 13.2584 6.42518 13.5834 6.75018L16.8334 10.0002Z',
      }),
    ],
  );

export default CodeMark;
