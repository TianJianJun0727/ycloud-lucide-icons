import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2021%2021%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M14.5154%2017.7863L12.4144%2015.7148H3.39233V2.25781H18.1032V15.7148L16.0014%2013.6448V4.32775H5.49333V13.6448H13.2839L17.4883%2017.7863H14.5154ZM9.69766%2011.5749V8.46919H7.59511V6.39847H13.9004V8.46919H11.7987V11.5749H9.69766Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const CtwaSystemKeywordEvent = (props: BusinessIconImageProps) => {
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

export default CtwaSystemKeywordEvent;
