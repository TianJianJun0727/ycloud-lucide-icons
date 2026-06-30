import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2025%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M20.8827%2020.8451H4.18721C3.00517%2020.8451%202.04678%2019.8869%202.04678%2018.7046V10.5709H23.0231V18.7046C23.0231%2019.8869%2022.0647%2020.8451%2020.8827%2020.8451ZM15.3175%2015.2799L14.4613%2018.2765H19.5983L20.4545%2015.2799H15.3175ZM2.04678%205.43392C2.04678%204.25188%203.00517%203.29349%204.18721%203.29349H20.8826C22.0647%203.29349%2023.0231%204.25188%2023.0231%205.43392V7.57439L2.04678%207.57439V5.43392Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const CreditCardIcon = (props: BusinessIconImageProps) => {
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

export default CreditCardIcon;
