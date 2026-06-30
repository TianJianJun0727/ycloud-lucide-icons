import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2025%2025%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M16.159%207.11407C16.159%207.70782%2016.6408%208.18961%2017.2346%208.18961H20.3933V20.7228C20.3933%2021.4998%2019.8674%2022.1309%2019.2194%2022.1309H5.73277C5.08473%2022.1309%204.55884%2021.4998%204.55884%2020.7228V4.5389C4.55884%203.76193%205.08134%203.13086%205.72937%203.13086H16.159V7.11407ZM11.1783%2016.9737L16.0776%2012.0744C16.2167%2011.9353%2016.2167%2011.708%2016.0776%2011.5689L14.5949%2010.0862C14.4558%209.94711%2014.2285%209.94711%2014.0894%2010.0862L9.19009%2014.9855C9.13919%2015.0364%209.10527%2015.0975%209.09169%2015.1687L8.72527%2017.0178C8.67437%2017.2689%208.89491%2017.4894%209.14598%2017.4385L10.9951%2017.0721C11.0629%2017.0585%2011.1274%2017.0246%2011.1783%2016.9737ZM17.5942%206.75783V3.97568L19.959%206.75783H17.5942Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const RecordFilled = (props: BusinessIconImageProps) => {
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

export default RecordFilled;
