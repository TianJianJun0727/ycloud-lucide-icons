import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Ccircle%20cx%3D%225%22%20cy%3D%2212.2285%22%20r%3D%221.5%22%20fill%3D%22currentColor%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212.2285%22%20r%3D%221.5%22%20fill%3D%22currentColor%22%20fill-opacity%3D%220.8%22%20%2F%3E%0A%20%20%3Ccircle%20cx%3D%2219%22%20cy%3D%2212.2285%22%20r%3D%221.5%22%20fill%3D%22currentColor%22%20fill-opacity%3D%220.3%22%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const ChatLoadingIcon = (props: BusinessIconImageProps) => {
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

export default ChatLoadingIcon;
