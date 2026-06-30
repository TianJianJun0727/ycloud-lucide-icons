import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2025%2025%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M20.5302%2013.153C20.3688%2013.4992%2020.0938%2013.7737%2019.7643%2013.9388L7.30823%2020.2253C6.42456%2020.6574%205.3582%2020.3051%204.90972%2019.4395C4.71232%2019.0215%204.67228%2018.5498%204.80894%2018.1097L6.1712%2013.675C6.29594%2013.269%206.67101%2012.9918%207.09581%2012.9918H11.8634C12.2138%2012.9904%2012.5003%2012.7073%2012.5083%2012.347C12.5061%2011.9924%2012.2231%2011.7057%2011.8634%2011.7022H7.09932C6.67284%2011.7022%206.2967%2011.4229%206.17338%2011.0147L4.8291%206.56419C4.54785%205.63599%205.07877%204.64599%206.01827%204.36792C6.45313%204.23122%206.92356%204.27271%207.32838%204.48883L19.7643%2010.7754C20.633%2011.2191%2020.9827%2012.2867%2020.5302%2013.153Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const SendMessage = (props: BusinessIconImageProps) => {
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

export default SendMessage;
