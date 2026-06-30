import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M11.99%202C6.47%202%202%206.48%202%2012C2%2017.52%206.47%2022%2011.99%2022C17.52%2022%2022%2017.52%2022%2012C22%206.48%2017.52%202%2011.99%202ZM12%2020C7.58%2020%204%2016.42%204%2012C4%207.58%207.58%204%2012%204C16.42%204%2020%207.58%2020%2012C20%2016.42%2016.42%2020%2012%2020ZM11.78%207H11.72C11.32%207%2011%207.32%2011%207.72V12.44C11%2012.79%2011.18%2013.12%2011.49%2013.3L15.64%2015.79C15.98%2015.99%2016.42%2015.89%2016.62%2015.55C16.83%2015.21%2016.72%2014.76%2016.37%2014.56L12.5%2012.26V7.72C12.5%207.32%2012.18%207%2011.78%207Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const TimeClock = (props: BusinessIconImageProps) => {
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

export default TimeClock;
