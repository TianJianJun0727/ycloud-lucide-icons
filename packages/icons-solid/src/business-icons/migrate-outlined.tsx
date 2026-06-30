import { mergeProps } from 'solid-js';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2021%2021%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M15.0126%208.74993L9.12098%2014.6416L5.58765%2011.1083L6.76265%209.93327L9.12098%2012.2916L13.8376%207.57493L15.0126%208.74993ZM3.62931%2010.8083C3.62931%208.8666%204.47931%207.12493%205.81265%205.90827L7.79598%207.8916V2.8916H2.79598L4.62931%204.72493C2.99598%206.2416%201.96265%208.39993%201.96265%2010.8083C1.96265%2015.1333%205.25431%2018.6833%209.46265%2019.0999V17.4166C6.17931%2017.0083%203.62931%2014.1999%203.62931%2010.8083ZM18.6293%2010.8083C18.6293%206.48327%2015.3376%202.93327%2011.1293%202.5166V4.19994C14.4126%204.60827%2016.9626%207.4166%2016.9626%2010.8083C16.9626%2012.7499%2016.1126%2014.4916%2014.7793%2015.7083L12.796%2013.7249V18.7249H17.796L15.9626%2016.8916C17.596%2015.3749%2018.6293%2013.2166%2018.6293%2010.8083Z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MigrateOutlined = (props: BusinessIconImageProps) => {
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

export default MigrateOutlined;
