import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M16.4316%204.5C17.2048%204.5%2017.832%205.12719%2017.832%205.90039H5.40039V6.37012H17.4365C19.0733%206.37015%2020.4002%207.6972%2020.4004%209.33398V16.25C20.4003%2017.8869%2019.0734%2019.2138%2017.4365%2019.2139H6.96387C5.32701%2019.2138%204.00007%2017.8868%204%2016.25V5.87012H4.00098C4.01709%205.1109%204.63731%204.5%205.40039%204.5H16.4316ZM15.1914%2012.1006C14.8096%2012.1007%2014.5001%2012.4102%2014.5%2012.792C14.5%2013.1739%2014.8095%2013.4833%2015.1914%2013.4834H17.0088C17.3906%2013.4832%2017.7002%2013.1738%2017.7002%2012.792C17.7001%2012.4103%2017.3905%2012.1008%2017.0088%2012.1006H15.1914Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const BillingFilled = (props: BusinessIconImageProps) => {
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

export default BillingFilled;
