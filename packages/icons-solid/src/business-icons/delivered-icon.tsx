import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2048%2049%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M36.6839%2011.6851H11.9827C9.99273%2011.6851%208.37231%2013.3787%208.37231%2015.4613V32.9571C8.37231%2035.0398%209.99236%2036.7334%2011.9827%2036.7334H36.6839C38.674%2036.7334%2040.2943%2035.0398%2040.2943%2032.9571V15.4613C40.2943%2013.3786%2038.6743%2011.6851%2036.6839%2011.6851ZM15.1094%2024.7498L20.9147%2030.5551C21.5453%2031.1858%2022.5803%2031.1858%2023.1947%2030.5551L35.4683%2018.2815C36.099%2017.6509%2036.099%2016.6321%2035.4683%2016.0015C34.8377%2015.3708%2033.8189%2015.3708%2033.1883%2016.0015L22.0628%2027.1269L17.3894%2022.4698C16.7588%2021.8391%2015.74%2021.8391%2015.1094%2022.4698C14.4787%2023.1004%2014.4787%2024.1192%2015.1094%2024.7498Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const DeliveredIcon = (props: BusinessIconImageProps) => {
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

export default DeliveredIcon;
