import { describe, expect, it } from 'vitest';
import {
  buildBusinessIconModule,
  buildBusinessIconsIndex,
  buildBusinessReactIconModule,
  buildBusinessReactIconsIndex,
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
    const moduleSource = buildBusinessIconModule('whatsapp-business', svg);

    expect(moduleSource).toContain('export const whatsappBusinessSvg =');
    expect(moduleSource).toContain('fill="#25D366"');
    expect(moduleSource).toContain('export const whatsappBusinessDataUri =');
    expect(moduleSource).toContain(encodeURIComponent(svg));
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

  it('generates React img components backed by data URIs', () => {
    const moduleSource = buildBusinessReactIconModule('whatsapp-business');

    expect(moduleSource).toContain("import { forwardRef } from 'react';");
    expect(moduleSource).toContain(
      "import { whatsappBusinessDataUri } from '@ycloud-web/icons/business';",
    );
    expect(moduleSource).toContain('const WhatsappBusiness = forwardRef<HTMLImageElement');
    expect(moduleSource).toContain('src={whatsappBusinessDataUri}');
    expect(moduleSource).toContain('width={width ?? size}');
    expect(moduleSource).toContain('height={height ?? size}');
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
});
