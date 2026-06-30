import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M14.8585%2011.0575L14.2798%206.72176C14.0174%204.75762%2012.0907%203.33301%209.95057%203.33301C7.81039%203.33301%205.88374%204.75762%205.62131%206.72013L5.04266%2011.0559C4.67103%2013.8302%206.7623%2016.6663%209.9522%2016.6663C13.1405%2016.6663%2015.2317%2013.8302%2014.8585%2011.0575ZM10.8634%207.81223C10.8634%208.31589%2010.4542%208.72502%209.95057%208.72502C9.4469%208.72502%209.03777%208.31589%209.03777%207.81223V5.75844C9.03777%205.25477%209.4469%204.84564%209.95057%204.84564C10.4542%204.84564%2010.8634%205.25477%2010.8634%205.75844V7.81223Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MouseFilled = (props: BusinessIconImageProps) => {
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

export default MouseFilled;
