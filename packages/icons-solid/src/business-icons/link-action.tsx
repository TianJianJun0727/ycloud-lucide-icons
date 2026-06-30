import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M15.8333%2015.8333H4.16667V4.16667H10V2.5H4.16667C3.24167%202.5%202.5%203.25%202.5%204.16667V15.8333C2.5%2016.75%203.24167%2017.5%204.16667%2017.5H15.8333C16.75%2017.5%2017.5%2016.75%2017.5%2015.8333V10H15.8333V15.8333ZM11.6667%202.5V4.16667H14.6583L6.46667%2012.3583L7.64167%2013.5333L15.8333%205.34167V8.33333H17.5V2.5H11.6667Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const LinkAction = (props: BusinessIconImageProps) => {
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

export default LinkAction;
