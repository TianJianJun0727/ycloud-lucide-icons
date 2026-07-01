import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const BenefitLanguages: FunctionalComponent<BusinessIconImageProps> = ({
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
        d: 'M15.6172 30.6006C13.2218 30.6006 10.9543 30.0561 8.93302 29.0846C7.68365 28.4841 1.26773 32.7746 0.234354 31.8757C-1.01454 30.7894 3.17536 24.4514 2.33219 23.0189C0.998688 20.753 0.234354 18.1154 0.234354 15.3003C0.234354 6.85008 7.12137 0 15.6172 0C24.113 0 31 6.85008 31 15.3003C31 23.7506 24.113 30.6006 15.6172 30.6006ZM7.92577 20.4004V22.9505H23.3086V20.4004H7.92577ZM14.5679 5.10521L9.66851 17.8504H11.9118L13.0784 14.6552H18.4444L19.6109 17.8504H21.8543L16.9548 5.10521H14.5679ZM13.7065 12.9415L15.7345 7.35435H15.8063L17.8163 12.9415H13.7065Z',
      }),
    ],
  );

export default BenefitLanguages;
