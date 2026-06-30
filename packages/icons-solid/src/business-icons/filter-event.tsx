import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M14.7939%205.80861C15.2342%206.24887%2014.9224%207.00163%2014.2997%207.00163H8.99837V6.99091H4.7054C4.31943%206.99091%204.00655%206.67802%204.00655%206.29205V4.69467C4.00655%204.3087%204.31943%203.99581%204.7054%203.99581H8.99837V1.70026C8.99837%201.07764%209.75114%200.765836%2010.1914%201.20609L14.7939%205.80861Z%22%0A%20%20%2F%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M1.20609%2010.1914C0.765837%209.75113%201.07764%208.99836%201.70026%208.99836L7.00163%208.99837V9.00812H11.2946C11.6806%209.00812%2011.9935%209.321%2011.9935%209.70697V11.3044C11.9935%2011.6903%2011.6806%2012.0032%2011.2946%2012.0032H7.00163V14.2997C7.00163%2014.9224%206.24886%2015.2342%205.80861%2014.7939L1.20609%2010.1914Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const FilterEvent = (props: BusinessIconImageProps) => {
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

export default FilterEvent;
