import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M16.4%208.28859L10.52%2014.1686L8.64%2012.2886C8.25%2011.8986%207.62%2011.8986%207.23%2012.2886C6.84%2012.6786%206.84%2013.3086%207.23%2013.6986L9.82%2016.2886C10.21%2016.6786%2010.84%2016.6786%2011.23%2016.2886L17.82%209.69859C18.21%209.30859%2018.21%208.67859%2017.82%208.28859C17.43%207.89859%2016.79%207.89859%2016.4%208.28859Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const Check = (props: BusinessIconImageProps) => {
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

export default Check;
