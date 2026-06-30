import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2021%2020%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M15.0522%208.19429L10.5%204.80566L5.9478%208.19429C5.66589%208.40311%205.5%208.73374%205.5%209.08525V14.0829C5.5%2014.6966%205.99768%2015.1943%206.61137%2015.1943H14.3886C15.0023%2015.1943%2015.5%2014.6966%2015.5%2014.0829V9.08525C15.5%208.73374%2015.3341%208.40311%2015.0522%208.19429ZM12.5835%2013.5272H8.41647C8.18677%2013.5272%208%2013.3393%208%2013.1108C8%2012.8822%208.18794%2012.6943%208.41647%2012.6943H12.5835C12.8132%2012.6943%2013%2012.8822%2013%2013.1108C13%2013.3393%2012.8121%2013.5272%2012.5835%2013.5272V13.5272Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const BusinessIcon = (props: BusinessIconImageProps) => {
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

export default BusinessIcon;
