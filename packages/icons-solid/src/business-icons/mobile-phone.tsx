import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M10.4638%202.66675H5.63293C5.10153%202.66675%204.66675%203.10311%204.66675%203.63644V12.3637C4.66675%2012.8971%205.10153%2013.3334%205.63293%2013.3334H10.4638C10.9953%2013.3334%2011.43%2012.8971%2011.43%2012.3637V3.63644C11.43%203.10311%2010.9953%202.66675%2010.4638%202.66675ZM10.4638%2011.394H5.63293V4.60614H10.4638V11.394Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MobilePhone = (props: BusinessIconImageProps) => {
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

export default MobilePhone;
