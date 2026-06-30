import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M19.23%2015.26L16.69%2014.97C16.08%2014.9%2015.48%2015.11%2015.05%2015.54L13.21%2017.38C10.38%2015.94%208.06004%2013.63%206.62004%2010.79L8.47004%208.94001C8.90004%208.51001%209.11004%207.91001%209.04004%207.30001L8.75004%204.78001C8.63004%203.77001%207.78004%203.01001%206.76004%203.01001H5.03004C3.90004%203.01001%202.96004%203.95001%203.03004%205.08001C3.56004%2013.62%2010.39%2020.44%2018.92%2020.97C20.05%2021.04%2020.99%2020.1%2020.99%2018.97V17.24C21%2016.23%2020.24%2015.38%2019.23%2015.26Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const CallingFilled = (props: BusinessIconImageProps) => {
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

export default CallingFilled;
