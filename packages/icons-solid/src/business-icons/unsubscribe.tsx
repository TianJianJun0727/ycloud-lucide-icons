import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2019%2018%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M7.76465%202.51172H12.2165C13.5814%202.51172%2014.6879%203.61819%2014.6879%204.98309V8.20472V14.3129C14.6879%2015.0648%2013.8892%2015.5478%2013.2234%2015.1985L11.1574%2014.1147C10.2927%2013.6611%209.26142%2013.6567%208.39289%2014.1028L6.2216%2015.2183C5.55612%2015.5602%204.76465%2015.077%204.76465%2014.3288V5.51172C4.76465%203.85486%206.10779%202.51172%207.76465%202.51172ZM7.96133%206.3042C7.57225%206.3042%207.25684%206.61961%207.25684%207.00869C7.25684%207.39777%207.57225%207.71318%207.96133%207.71318H11.4911C11.8802%207.71318%2012.1956%207.39777%2012.1956%207.00869C12.1956%206.61961%2011.8802%206.3042%2011.4911%206.3042H7.96133Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const Unsubscribe = (props: BusinessIconImageProps) => {
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

export default Unsubscribe;
