import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M8.5%2012C8.5%2012.8284%207.82843%2013.5%207%2013.5C6.17157%2013.5%205.5%2012.8284%205.5%2012C5.5%2011.1716%206.17157%2010.5%207%2010.5C7.82843%2010.5%208.5%2011.1716%208.5%2012ZM13.5%2012C13.5%2012.8284%2012.8284%2013.5%2012%2013.5C11.1716%2013.5%2010.5%2012.8284%2010.5%2012C10.5%2011.1716%2011.1716%2010.5%2012%2010.5C12.8284%2010.5%2013.5%2011.1716%2013.5%2012ZM17%2013.5C17.8284%2013.5%2018.5%2012.8284%2018.5%2012C18.5%2011.1716%2017.8284%2010.5%2017%2010.5C16.1716%2010.5%2015.5%2011.1716%2015.5%2012C15.5%2012.8284%2016.1716%2013.5%2017%2013.5Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MoreHoriz = (props: BusinessIconImageProps) => {
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

export default MoreHoriz;
