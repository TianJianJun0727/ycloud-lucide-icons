import { describe, expect, it } from 'vitest';
import { House } from '../src/ycloud-icons';
import buildYCloudIconNode from '../src/buildYCloudIconNode';

describe('buildYCloudIconNode', () => {
  it('should create icon node', () => {
    const HouseSVG = buildYCloudIconNode(House);

    expect(HouseSVG.at(0)).toBe('svg');
  });

  it('should match the snapshot', () => {
    const HouseSVG = buildYCloudIconNode(House);

    expect(HouseSVG.at(0)).toBe('svg');
    expect(HouseSVG.at(1)).toEqual(
      expect.objectContaining({
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        class: 'ycloud ycloud-house ycloud-home',
      }),
    );
  });

  it('should override dimensions, but not viewBox', () => {
    const HouseSVG = buildYCloudIconNode(House, { size: 12 });

    expect(HouseSVG[1]['width']).toBe('12');
    expect(HouseSVG[1]['height']).toBe('12');
    expect(HouseSVG[1]['viewBox']).toBe('0 0 24 24');
  });

  it('should override width, but not height', () => {
    const HouseSVG = buildYCloudIconNode(House, { width: 12 });

    expect(HouseSVG[1]['width']).toBe('12');
    expect(HouseSVG[1]['height']).toBe('24');
    expect(HouseSVG[1]['viewBox']).toBe('0 0 24 24');
  });

  it('should override height, but not width', () => {
    const HouseSVG = buildYCloudIconNode(House, { height: 12 });

    expect(HouseSVG[1]['width']).toBe('24');
    expect(HouseSVG[1]['height']).toBe('12');
    expect(HouseSVG[1]['viewBox']).toBe('0 0 24 24');
  });

  it('should override color', () => {
    const HouseSVG = buildYCloudIconNode(House, { color: 'pink' });

    expect(HouseSVG[1]['stroke']).toBe('pink');
    expect(HouseSVG[1]['fill']).toBe('none');
  });

  it('should override stroke width', () => {
    const HouseSVG = buildYCloudIconNode(House, { strokeWidth: 12 });

    expect(HouseSVG[1]['stroke-width']).toBe('12');
  });

  it('should set non-scaling-stroke to child nodes', () => {
    const HouseSVG = buildYCloudIconNode(House, { absoluteStrokeWidth: true });

    for (const node of HouseSVG[2]!) {
      expect(node[1]['vector-effect']).toBe('non-scaling-stroke');
    }
  });

  it('should not set non-scaling-stroke', () => {
    const HouseSVG = buildYCloudIconNode(House, { absoluteStrokeWidth: false });

    expect(HouseSVG[1]['vector-effect']).toBeUndefined();
  });

  it('should create icon node with attributes', () => {
    const HouseSVG = buildYCloudIconNode(House, { attributes: { fill: 'red' } });

    expect(HouseSVG[1]['fill']).toBe('red');
  });

  it('should create icon node with class name', () => {
    const HouseSVG = buildYCloudIconNode(House, { attributes: { class: 'icon' } });

    expect(HouseSVG[1]['class']).toBe('icon');
  });

  it('should add backwards-compatible classes', () => {
    const HouseSVG = buildYCloudIconNode(House);

    expect(HouseSVG[1]['class']).toBe('ycloud ycloud-house ycloud-home');
  });

  it('should merge classes', () => {
    const HouseSVG = buildYCloudIconNode(House, { className: 'icon' });

    expect(HouseSVG[1]['class']).toBe('ycloud ycloud-house ycloud-home icon');
  });
});
