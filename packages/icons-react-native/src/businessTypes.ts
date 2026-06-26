import type { ImageProps } from 'react-native';

export interface BusinessIconImageProps extends Omit<ImageProps, 'source'> {
  size?: number;
  width?: number;
  height?: number;
  source?: ImageProps['source'];
}
