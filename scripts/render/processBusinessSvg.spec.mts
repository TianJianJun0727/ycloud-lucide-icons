import { describe, expect, it } from 'vitest';
import processBusinessSvg from './processBusinessSvg.mts';

describe('processBusinessSvg', () => {
  it('keeps geometry and stroke details while clearing colors', async () => {
    const svg = await processBusinessSvg(
      '<svg width="32" height="32" viewBox="0 0 32 32" fill="red" stroke="blue" stroke-width="3" stroke-linecap="square" stroke-linejoin="bevel"><path id="Vector" fill="#25D366" d="M0 0h32v32H0z"/></svg>',
      'business-icons/whatsapp-business.svg',
    );

    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
    expect(svg).toContain('viewBox="0 0 32 32"');
    expect(svg).toContain('fill="currentColor"');
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('stroke-width="3"');
    expect(svg).toContain('stroke-linecap="square"');
    expect(svg).toContain('stroke-linejoin="bevel"');
    expect(svg).not.toContain('#25D366');
    expect(svg).not.toContain('id="Vector"');
  });

  it('keeps fill-based shapes visible by converting fixed fills to currentColor', async () => {
    const svg = await processBusinessSvg(
      '<svg width="24" height="24" viewBox="0 0 24 24"><mask id="mask" fill="white"><path d="M4 4h16v16H4z"/></mask><path fill="black" mask="url(#mask)" d="M4 4h16v16H4z"/></svg>',
      'business-icons/filled-mask.svg',
    );

    expect(svg).toContain('mask="url(#mask)"');
    expect(svg).toContain('fill="currentColor"');
    expect(svg).not.toContain('fill="black"');
    expect(svg).not.toContain('fill="white"');
  });

  it('removes unsafe SVG content', async () => {
    const svg = await processBusinessSvg(
      '<svg viewBox="0 0 16 16" onclick="alert(1)" data-name="Icon"><script>alert(1)</script><path id="unused" style="fill:red" class="shape" fill="red" d="M0 0h16v16H0z"/></svg>',
      'business-icons/unsafe.svg',
    );

    expect(svg).not.toContain('<script');
    expect(svg).not.toContain('onclick');
    expect(svg).not.toContain('style=');
    expect(svg).not.toContain('class=');
    expect(svg).not.toContain('data-name');
    expect(svg).not.toContain('id="unused"');
    expect(svg).not.toContain('fill="red"');
  });
});
