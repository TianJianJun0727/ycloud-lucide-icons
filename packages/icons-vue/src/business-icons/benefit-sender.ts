import { h, type FunctionalComponent } from 'vue';
import type { BusinessIconImageProps } from '../businessTypes';

const BenefitSender: FunctionalComponent<BusinessIconImageProps> = ({
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
        d: 'M28.9231 4C29.6575 4 30.3619 4.29176 30.8812 4.81109C31.4005 5.33042 31.6923 6.03478 31.6923 6.76923V25.2308C31.6923 25.9652 31.4005 26.6696 30.8812 27.1889C30.3619 27.7082 29.6575 28 28.9231 28H3.07691C2.34246 28 1.6381 27.7082 1.11877 27.1889C0.599436 26.6696 0.307678 25.9652 0.307678 25.2308V6.76923C0.307678 6.03478 0.599436 5.33042 1.11877 4.81109C1.6381 4.29176 2.34246 4 3.07691 4H28.9231ZM27.0769 19.6923H4.92306V22.4615H27.0769V19.6923ZM14.1538 8.61539H4.92306V16.9231H14.1538V8.61539ZM27.0769 14.1538H16V16.9231H27.0769V14.1538ZM11.3846 11.3846V14.1538H7.69229V11.3846H11.3846Z',
      }),
    ],
  );

export default BenefitSender;
