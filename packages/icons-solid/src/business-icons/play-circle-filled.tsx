import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2033%2033%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M16.7523%202.93945C9.39228%202.93945%203.41895%208.91279%203.41895%2016.2728C3.41895%2023.6328%209.39228%2029.6061%2016.7523%2029.6061C24.1123%2029.6061%2030.0856%2023.6328%2030.0856%2016.2728C30.0856%208.91279%2024.1123%202.93945%2016.7523%202.93945ZM14.0856%2020.9395V11.6061C14.0856%2011.0595%2014.7123%2010.7395%2015.1523%2011.0728L21.3789%2015.7395C21.7389%2016.0061%2021.7389%2016.5395%2021.3789%2016.8061L15.1523%2021.4728C14.7123%2021.8061%2014.0856%2021.4861%2014.0856%2020.9395Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const PlayCircleFilled = (props: BusinessIconImageProps) => {
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

export default PlayCircleFilled;
