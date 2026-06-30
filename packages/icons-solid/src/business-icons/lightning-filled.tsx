import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M3.19506%209.00032C2.57142%209.00032%202.25911%208.24632%202.70008%207.80534L9.65784%200.847587C10.1642%200.341177%2011.0143%200.831968%2010.829%201.52374L9.53016%206.37091C9.44507%206.68847%209.68436%207.00032%2010.0131%207.00032L12.921%207.00032C13.5273%207.00032%2013.8469%207.71872%2013.4409%208.16905L7.3274%2014.9499C6.84112%2015.4893%205.95654%2015.0227%206.12707%2014.3168L7.26227%209.61773C7.33827%209.30313%207.0999%209.00032%206.77625%209.00032H3.19506Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const LightningFilled = (props: BusinessIconImageProps) => {
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

export default LightningFilled;
