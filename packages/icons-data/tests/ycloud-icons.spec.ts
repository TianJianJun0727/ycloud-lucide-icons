import { describe, expect, it } from 'vitest';
import { House } from '../src/ycloud-icons';

describe('ycloud-icons', () => {
  it('should init', () => {
    const HouseSVG = House;

    expect(House).toMatchObject(House);
  });
});
