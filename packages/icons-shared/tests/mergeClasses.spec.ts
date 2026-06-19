import { describe, it, expect } from 'vitest';
import { mergeClasses } from '../src/utils/mergeClasses';

describe('mergeClasses', () => {
  it('merges classes', async () => {
    const classes = mergeClasses('ycloud', 'ycloud-circle', 'custom-class');
    expect(classes).toBe('ycloud ycloud-circle custom-class');
  });
  it('ignores empty string', async () => {
    const classes = mergeClasses('ycloud', 'ycloud-circle', '');
    expect(classes).toBe('ycloud ycloud-circle');
  });
  it('ignores undefined', async () => {
    const classes = mergeClasses('ycloud', 'ycloud-circle', undefined);
    expect(classes).toBe('ycloud ycloud-circle');
  });
  it('removes duplicates', async () => {
    const classes = mergeClasses('ycloud', 'ycloud-circle', 'ycloud');
    expect(classes).toBe('ycloud ycloud-circle');
  });
  it('trims the string', async () => {
    const classes = mergeClasses('ycloud', 'ycloud-circle', ' ');
    expect(classes).toBe('ycloud ycloud-circle');
  });
  it('trims the sub strings', async () => {
    const classes = mergeClasses('ycloud', ' ', 'ycloud-circle');
    expect(classes).toBe('ycloud ycloud-circle');
  });
});
