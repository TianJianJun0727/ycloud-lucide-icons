import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2037%2012%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M1%205.04688C0.447715%205.04688%20-4.82823e-08%205.49459%200%206.04688C4.82823e-08%206.59916%200.447715%207.04688%201%207.04688L1%205.04688ZM36.481%206.04687L26.481%200.27337L26.481%2011.8204L36.481%206.04687ZM1%207.04688L27.481%207.04687L27.481%205.04687L1%205.04688L1%207.04688Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const StartArrow = (props: BusinessIconImageProps) => {
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

export default StartArrow;
