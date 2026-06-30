import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2021%2020%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cg%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20d%3D%22M16.2279%2015.8333H4.5612V4.16667H10.3945V2.5H4.5612C3.6362%202.5%202.89453%203.25%202.89453%204.16667V15.8333C2.89453%2016.75%203.6362%2017.5%204.5612%2017.5H16.2279C17.1445%2017.5%2017.8945%2016.75%2017.8945%2015.8333V10H16.2279V15.8333ZM12.0612%202.5V4.16667H15.0529L6.8612%2012.3583L8.0362%2013.5333L16.2279%205.34167V8.33333H17.8945V2.5H12.0612Z%22%0A%20%20%20%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CclipPath%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%2220%22%20height%3D%2220%22%20transform%3D%22translate(0.394531)%22%20%2F%3E%0A%20%20%20%20%3C%2FclipPath%3E%0A%20%20%3C%2Fdefs%3E%0A%3C%2Fsvg%3E%0A';

const Share = (props: BusinessIconImageProps) => {
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

export default Share;
