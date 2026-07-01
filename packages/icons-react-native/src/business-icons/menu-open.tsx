import { Image } from 'react-native';
import type { BusinessIconImageProps } from '../businessTypes';

const dataUri =
  'data:image/svg+xml;utf8,%3Csvg%0A%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20%20height%3D%2224%22%0A%20%20viewBox%3D%220%200%2024%2024%22%0A%20%20width%3D%2224%22%0A%20%20fill%3D%22currentColor%22%0A%3E%0A%20%20%3Cpath%20d%3D%22M0%200h24v24H0V0z%22%20fill%3D%22none%22%20%2F%3E%0A%20%20%3Cpath%0A%20%20%20%20d%3D%22M3%2018h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18%209.59L17.42%2012%2021%208.41%2019.59%207l-5%205%205%205L21%2015.59z%22%0A%20%20%2F%3E%0A%3C%2Fsvg%3E%0A';

const MenuOpen = ({ size = 24, width, height, source, ...props }: BusinessIconImageProps) => (
  <Image
    {...props}
    source={source ?? { uri: dataUri }}
    style={[{ width: width ?? size, height: height ?? size }, props.style]}
  />
);

export default MenuOpen;
