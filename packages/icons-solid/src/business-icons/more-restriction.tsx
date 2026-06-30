import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2048%2048%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20fill-rule%3D%22evenodd%22%0A%20%20%20%20clip-rule%3D%22evenodd%22%0A%20%20%20%20d%3D%22M24%2040C32.8366%2040%2040%2032.8366%2040%2024C40%2015.1634%2032.8366%208%2024%208C15.1634%208%208%2015.1634%208%2024C8%2032.8366%2015.1634%2040%2024%2040ZM24%2038.1503C31.815%2038.1503%2038.1503%2031.815%2038.1503%2024C38.1503%2016.185%2031.815%209.84971%2024%209.84971C16.185%209.84971%209.84971%2016.185%209.84971%2024C9.84971%2031.815%2016.185%2038.1503%2024%2038.1503ZM23.1676%2011.5145C16.7318%2011.5145%2011.5145%2016.7317%2011.5145%2023.1676H23.1676V11.5145ZM25.0173%2011.6994V23.1676H36.4855C36.4855%2016.8339%2031.3511%2011.6994%2025.0173%2011.6994ZM25.0173%2036.4855V25.0173H36.4855C36.4855%2031.3511%2031.3511%2036.4855%2025.0173%2036.4855ZM11.5145%2025.0173C11.5145%2031.3511%2016.7318%2036.4855%2023.1676%2036.4855V25.0173H11.5145Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MoreRestriction = (props: BusinessIconImageProps) => {
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

export default MoreRestriction;
