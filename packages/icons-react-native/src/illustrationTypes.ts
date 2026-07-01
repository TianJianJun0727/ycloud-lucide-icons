import type { ImageProps, DimensionValue } from 'react-native';

export interface IllustrationProps extends Omit<ImageProps, 'source'> {
  width?: DimensionValue;
  height?: DimensionValue;
  source?: ImageProps['source'];
}
