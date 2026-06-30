import { describe, expect, it } from 'vitest';
import {
  buildBusinessIconModule,
  buildBusinessIconsIndex,
  buildBusinessReactIconModule,
  buildBusinessReactIconsIndex,
  buildBusinessSolidIconModule,
  buildBusinessSvelteIconModule,
  getBusinessIconExportBase,
  getBusinessIconComponentName,
} from './generateBusinessIconsPackage.mts';

describe('generateBusinessIconsPackage', () => {
  it('creates stable export names for kebab-case and numeric icon names', () => {
    expect(getBusinessIconExportBase('whatsapp-business')).toBe('whatsappBusiness');
    expect(getBusinessIconExportBase('2fa-status')).toBe('business2faStatus');
    expect(getBusinessIconComponentName('whatsapp-business')).toBe('WhatsappBusiness');
    expect(getBusinessIconComponentName('2fa-status')).toBe('Business2faStatus');
  });

  it('generates an icon module with raw SVG and an encoded data URI', () => {
    const svg = '<svg viewBox="0 0 16 16"><path fill="#25D366" d="M0 0h16v16H0z"/></svg>';
    const moduleSource = buildBusinessIconModule('whatsapp-business', svg, 'duotone');

    expect(moduleSource).toContain('export const whatsappBusinessSvg =');
    expect(moduleSource).toContain('fill="#25D366"');
    expect(moduleSource).toContain('export const whatsappBusinessDataUri =');
    expect(moduleSource).toContain(encodeURIComponent(svg));
    expect(moduleSource).toContain("colorMode: 'duotone'");
  });

  it('generates an index that exports names, definitions, and icon modules', () => {
    const indexSource = buildBusinessIconsIndex(['2fa-status', 'whatsapp-business']);

    expect(indexSource).toContain("export * from './business-icons/2fa-status';");
    expect(indexSource).toContain("export * from './business-icons/whatsapp-business';");
    expect(indexSource).toContain(
      "export const businessIconNames = ['2fa-status', 'whatsapp-business'] as const;",
    );
    expect(indexSource).toContain("'2fa-status': business2faStatusIcon");
    expect(indexSource).toContain("'whatsapp-business': whatsappBusinessIcon");
  });

  it('generates React inline components that require two colors for duotone business icons', () => {
    const moduleSource = buildBusinessReactIconModule(
      'whatsapp-business',
      'duotone',
      '<svg fill="var(--business-icon-primary-color)" viewBox="0 0 16 16"><path d="M0 0h16v16H0z"/><path fill="var(--business-icon-secondary-color)" d="M4 4h8v8H4z"/></svg>',
    );

    expect(moduleSource).toContain("import { forwardRef } from 'react';");
    expect(moduleSource).toContain('type WhatsappBusinessProps = BusinessIconImageProps & {');
    expect(moduleSource).toContain('secondaryColor?: string;');
    expect(moduleSource).toContain("secondaryColor = '#fff'");
    expect(moduleSource).toContain('fill={color}');
    expect(moduleSource).toContain('fill={secondaryColor}');
    expect(moduleSource).not.toContain('dangerouslySetInnerHTML');
    expect(moduleSource).not.toContain('--business-icon-secondary-color');
  });

  it('generates React inline components for mono business icons', () => {
    const moduleSource = buildBusinessReactIconModule(
      'contact',
      'mono',
      '<svg fill="currentColor" viewBox="0 0 16 16"><path d="M0 0h16v16H0z"/></svg>',
    );

    expect(moduleSource).toContain('forwardRef<SVGSVGElement');
    expect(moduleSource).toContain('<svg');
    expect(moduleSource).toContain('<path d="M0 0h16v16H0z" />');
    expect(moduleSource).toContain('color');
    expect(moduleSource).not.toContain('dangerouslySetInnerHTML');
  });

  it('generates React inline components without color props for multicolor business icons', () => {
    const moduleSource = buildBusinessReactIconModule(
      'shopify',
      'multicolor',
      '<svg viewBox="0 0 16 16"><path fill="#95BF47" d="M0 0h16v16H0z"/></svg>',
    );

    expect(moduleSource).toContain('type ShopifyProps = Omit<BusinessIconImageProps,');
    expect(moduleSource).toContain('forwardRef<SVGSVGElement, ShopifyProps>');
    expect(moduleSource).toContain('fill="#95BF47"');
    expect(moduleSource).not.toContain('color =');
    expect(moduleSource).not.toContain('secondaryColor');
  });

  it('generates a React index with named component exports', () => {
    const indexSource = buildBusinessReactIconsIndex(['2fa-status', 'whatsapp-business']);

    expect(indexSource).toContain(
      "export { default as Business2faStatus } from './business-icons/2fa-status';",
    );
    expect(indexSource).toContain(
      "export { default as WhatsappBusiness } from './business-icons/whatsapp-business';",
    );
    expect(indexSource).toContain("export type { BusinessIconImageProps } from './businessTypes';");
  });

  it('inlines data URIs in image component packages', () => {
    const dataUri = 'data:image/svg+xml;utf8,%3Csvg%2F%3E';
    const solidSource = buildBusinessSolidIconModule('whatsapp-business', dataUri);
    const svelteSource = buildBusinessSvelteIconModule('whatsapp-business', dataUri);

    expect(solidSource).toContain(`  '${dataUri}';`);
    expect(solidSource).toContain('src: dataUri');
    expect(solidSource).toContain('<img {...mergedProps} />');
    expect(svelteSource).toContain(`const dataUri = '${dataUri}';`);
    expect(svelteSource).toContain('src={dataUri}');
    expect(solidSource).not.toContain('@ycloud-web/icons/business');
    expect(svelteSource).not.toContain('@ycloud-web/icons/business');
  });
});
