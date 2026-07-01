import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const BenefitAnalytics: FunctionalComponent<BusinessIconImageProps> = ({
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
        d: 'M7.05473 32.917H0.503966C0.226818 32.917 6.10352e-05 32.6902 6.10352e-05 32.4131V23.3428C6.10352e-05 23.0656 0.226818 22.8389 0.503966 22.8389H7.05473C7.33188 22.8389 7.55863 23.0656 7.55863 23.3428V32.4131C7.55863 32.6902 7.33188 32.917 7.05473 32.917ZM19.1484 32.4131V16.2881C19.1484 16.011 18.9217 15.7842 18.6445 15.7842H12.0938C11.8166 15.7842 11.5899 16.011 11.5899 16.2881V32.4131C11.5899 32.6902 11.8166 32.917 12.0938 32.917H18.6445C18.9217 32.917 19.1484 32.6902 19.1484 32.4131ZM31.8977 8.98148L26.8909 0.311791C26.6511 -0.10393 26.258 -0.10393 26.0182 0.311791L21.0124 8.98148C20.7725 9.3972 20.9686 9.73733 21.4488 9.73733H23.1797V32.4131C23.1797 32.6902 23.4064 32.917 23.6836 32.917H29.2265C29.5037 32.917 29.7304 32.6902 29.7304 32.4131V9.73733H31.4614C31.9411 9.73733 32.1376 9.3972 31.8977 8.98148Z',
      }),
    ],
  );

export default BenefitAnalytics;
