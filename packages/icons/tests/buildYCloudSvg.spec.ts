import { describe, expect, it } from 'vitest';
import { House } from '../src/ycloud-icons';
import { getOriginalSvg, removeKeys } from './helpers';
import buildYCloudSvg from '../src/buildYCloudSvg';
import buildYCloudDataUri from '../src/buildYCloudDataUri';

describe('buildYCloudSvg', () => {
  it('should match the snapshot', () => {
    const HouseSVG = buildYCloudSvg(House);

    expect(removeKeys(HouseSVG)).toBe(removeKeys(getOriginalSvg('house', ['home'])));
  });

  it('should create the correct svg element', () => {
    const HouseSVG = buildYCloudSvg(House);

    const svg = getOriginalSvg('house', ['home']);

    expect(removeKeys(HouseSVG)).toBe(svg);
  });
});

describe('buildYCloudSvgDataUri', () => {
  it('should match the snapshot', () => {
    const HouseDataUri = buildYCloudDataUri(House);

    expect(HouseDataUri).toContain('data:image/svg+xml;base64,');
  });
});
