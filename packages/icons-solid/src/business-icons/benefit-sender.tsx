import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M28.9231%204C29.6575%204%2030.3619%204.29176%2030.8812%204.81109C31.4005%205.33042%2031.6923%206.03478%2031.6923%206.76923V25.2308C31.6923%2025.9652%2031.4005%2026.6696%2030.8812%2027.1889C30.3619%2027.7082%2029.6575%2028%2028.9231%2028H3.07691C2.34246%2028%201.6381%2027.7082%201.11877%2027.1889C0.599436%2026.6696%200.307678%2025.9652%200.307678%2025.2308V6.76923C0.307678%206.03478%200.599436%205.33042%201.11877%204.81109C1.6381%204.29176%202.34246%204%203.07691%204H28.9231ZM27.0769%2019.6923H4.92306V22.4615H27.0769V19.6923ZM14.1538%208.61539H4.92306V16.9231H14.1538V8.61539ZM27.0769%2014.1538H16V16.9231H27.0769V14.1538ZM11.3846%2011.3846V14.1538H7.69229V11.3846H11.3846Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const BenefitSender = (props: BusinessIconImageProps) => {
  const mergedProps = mergeProps(
    {
      src: dataUri,
      alt: '',
      get width() {
        return props.width ?? props.size ?? 24;
      },
      get height() {
        return props.height ?? props.size ?? 24;
      },
    },
    props,
  );

  return <img {...mergedProps} />;
};

export default BenefitSender;
