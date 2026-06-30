import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2021%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M11.6666%204.95964C11.6666%205.88011%2010.9204%206.6263%209.99992%206.6263C9.07944%206.6263%208.33325%205.88011%208.33325%204.95964C8.33325%204.03916%209.07944%203.29297%209.99992%203.29297C10.9204%203.29297%2011.6666%204.03916%2011.6666%204.95964ZM11.6666%2010.3744C11.6666%2011.2948%2010.9204%2012.041%209.99992%2012.041C9.07944%2012.041%208.33325%2011.2948%208.33325%2010.3744C8.33325%209.45389%209.07944%208.7077%209.99992%208.7077C10.9204%208.7077%2011.6666%209.45389%2011.6666%2010.3744ZM9.99992%2017.4561C10.9204%2017.4561%2011.6666%2016.7099%2011.6666%2015.7894C11.6666%2014.8689%2010.9204%2014.1227%209.99992%2014.1227C9.07944%2014.1227%208.33325%2014.8689%208.33325%2015.7894C8.33325%2016.7099%209.07944%2017.4561%209.99992%2017.4561Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MoreVert = (props: BusinessIconImageProps) => {
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

export default MoreVert;
