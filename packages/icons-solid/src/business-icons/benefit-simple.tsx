import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M16%201.06689C7.78665%201.06689%201.06665%207.78689%201.06665%2016.0002C1.06665%2024.2136%207.78665%2030.9336%2016%2030.9336C16.4267%2030.9336%2016.8%2030.5602%2016.8%2030.1336V17.4936C16.8%2017.1202%2017.12%2016.8002%2017.4933%2016.8002H30.1333C30.56%2016.8002%2030.9333%2016.4269%2030.9333%2016.0002C30.9333%207.78689%2024.2133%201.06689%2016%201.06689Z%22%0A%20%20%2F%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M29.3866%2019.6802H20.4799C20.0533%2019.6802%2019.6799%2020.0535%2019.6799%2020.4802V29.3868C19.6799%2029.8135%2020.0533%2030.1868%2020.4799%2030.1868H29.3866C29.8133%2030.1868%2030.1866%2029.8135%2030.1866%2029.3868V20.4802C30.1866%2020.0002%2029.8133%2019.6802%2029.3866%2019.6802Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const BenefitSimple = (props: BusinessIconImageProps) => {
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

export default BenefitSimple;
