import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2048%2048%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M36.9231%2012C37.6575%2012%2038.3619%2012.2918%2038.8812%2012.8111C39.4006%2013.3304%2039.6923%2014.0348%2039.6923%2014.7692V33.2308C39.6923%2033.9652%2039.4006%2034.6696%2038.8812%2035.1889C38.3619%2035.7082%2037.6575%2036%2036.9231%2036H11.0769C10.3425%2036%209.63811%2035.7082%209.11878%2035.1889C8.59945%2034.6696%208.30769%2033.9652%208.30769%2033.2308V14.7692C8.30769%2014.0348%208.59945%2013.3304%209.11878%2012.8111C9.63811%2012.2918%2010.3425%2012%2011.0769%2012H36.9231ZM35.0769%2027.6923H12.9231V30.4615H35.0769V27.6923ZM22.1538%2016.6154H12.9231V24.9231H22.1538V16.6154ZM35.0769%2022.1538H24V24.9231H35.0769V22.1538ZM19.3846%2019.3846V22.1538H15.6923V19.3846H19.3846Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MoreSender = (props: BusinessIconImageProps) => {
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

export default MoreSender;
