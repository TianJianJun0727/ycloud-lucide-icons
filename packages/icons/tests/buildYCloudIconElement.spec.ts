import { describe, expect, it } from 'vitest';
import { House } from '../src/ycloud-icons';
import { getOriginalSvg, removeKeys } from './helpers';
import buildYCloudIconElement from '../src/buildYCloudIconElement';

describe('buildYCloudIconElement', () => {
  it('should create SVG Element', () => {
    const HomeSVG = buildYCloudIconElement(document, House);

    expect(HomeSVG.tagName).toBe('svg');
  });

  it('should match the snapshot', () => {
    const HomeSVG = buildYCloudIconElement(document, House);

    expect(HomeSVG.tagName).toBe('svg');
    expect(HomeSVG.getAttribute('width')).toBe('24');
    expect(HomeSVG.getAttribute('height')).toBe('24');
    expect(HomeSVG.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(HomeSVG.getAttribute('fill')).toBe('none');
    expect(HomeSVG.getAttribute('class')).toBe('ycloud ycloud-house ycloud-home');
  });

  it('should create SVG Element with attributes', () => {
    const HomeSVG = buildYCloudIconElement(document, House, { attributes: { fill: 'red' } });

    expect(HomeSVG.getAttribute('fill')).toBe('red');
  });

  it('should create SVG Element with class name', () => {
    const HomeSVG = buildYCloudIconElement(document, House, { attributes: { class: 'icon' } });

    expect(HomeSVG.getAttribute('class')).toBe('icon');
  });

  it('should add backwards-compatible classes', () => {
    const HomeSVG = buildYCloudIconElement(document, House);

    expect(HomeSVG.getAttribute('class')).toBe('ycloud ycloud-house ycloud-home');
  });

  it('should merge classes', () => {
    const HomeSVG = buildYCloudIconElement(document, House, { className: 'icon' });

    expect(HomeSVG.getAttribute('class')).toBe('ycloud ycloud-house ycloud-home icon');
  });

  it('should create the correct svg element', () => {
    const HomeSVG = buildYCloudIconElement(document, House);

    const svg = getOriginalSvg('house', ['home']);

    expect(removeKeys(HomeSVG.outerHTML)).toBe(svg);
  });
});
