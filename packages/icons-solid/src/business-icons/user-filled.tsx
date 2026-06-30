import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2033%2033%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M16.7527%2018.1656C19.5368%2018.1656%2022.1066%2015.7333%2022.3946%2012.176C22.6958%208.45395%2020.224%204.94336%2016.7527%204.94336C13.2816%204.94336%2010.8095%208.45395%2011.111%2012.176C11.3989%2015.7333%2013.9687%2018.1656%2016.7527%2018.1656ZM16.7023%2020.0856C10.4709%2020.0856%205.41943%2022.5636%205.41943%2025.6203C5.41943%2026.6656%206.38035%2027.0685%209.20638%2027.3739C11.3911%2027.61%2013.9993%2027.61%2016.7528%2027.61C19.5731%2027.61%2022.3702%2027.61%2024.338%2027.3739C27.1217%2027.0399%2028.0861%2026.6656%2028.0861%2025.6203C28.0861%2022.5636%2022.9334%2020.0856%2016.7023%2020.0856Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const UserFilled = (props: BusinessIconImageProps) => {
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

export default UserFilled;
