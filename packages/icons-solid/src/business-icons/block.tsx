import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M16.2278%2017.3263C15.0671%2018.2489%2013.5979%2018.8%2012%2018.8C8.24446%2018.8%205.2%2015.7555%205.2%2012C5.2%2010.4021%205.75114%208.93294%206.6737%207.77222L16.2278%2017.3263ZM17.0983%2016.4998L7.5002%206.90167C8.69916%205.84266%2010.2745%205.2%2012%205.2C15.7555%205.2%2018.8%208.24446%2018.8%2012C18.8%2013.7255%2018.1573%2015.3008%2017.0983%2016.4998ZM20%2012C20%2016.4183%2016.4183%2020%2012%2020C7.58172%2020%204%2016.4183%204%2012C4%207.58172%207.58172%204%2012%204C16.4183%204%2020%207.58172%2020%2012Z%22%0A%20%20%20%20fill%3D%22currentColor%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const Block = (props: BusinessIconImageProps) => {
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

export default Block;
