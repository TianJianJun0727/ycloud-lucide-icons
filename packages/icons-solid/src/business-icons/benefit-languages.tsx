import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M15.6172%2030.6006C13.2218%2030.6006%2010.9543%2030.0561%208.93302%2029.0846C7.68365%2028.4841%201.26773%2032.7746%200.234354%2031.8757C-1.01454%2030.7894%203.17536%2024.4514%202.33219%2023.0189C0.998688%2020.753%200.234354%2018.1154%200.234354%2015.3003C0.234354%206.85008%207.12137%200%2015.6172%200C24.113%200%2031%206.85008%2031%2015.3003C31%2023.7506%2024.113%2030.6006%2015.6172%2030.6006ZM7.92577%2020.4004V22.9505H23.3086V20.4004H7.92577ZM14.5679%205.10521L9.66851%2017.8504H11.9118L13.0784%2014.6552H18.4444L19.6109%2017.8504H21.8543L16.9548%205.10521H14.5679ZM13.7065%2012.9415L15.7345%207.35435H15.8063L17.8163%2012.9415H13.7065Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const BenefitLanguages = (props: BusinessIconImageProps) => {
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

export default BenefitLanguages;
