import { InjectionToken, Provider } from '@angular/core';

/**
 * YCloud icon configuration options.
 */
export interface YCloudConfig {
  /**
   * Stroke color.
   * @default currentColor
   */
  color: string;
  /**
   * Width and height.
   * @default 24
   */
  size: string | number;
  /**
   * Stroke width
   * @default 2
   */
  strokeWidth: number;
  /**
   * Whether stroke width should be scaled to appear uniform regardless of icon size.
   * @default false
   *
   * @remarks
   * Use CSS to set on SVG paths instead:
   * ```css
   * .ycloud * {
   *   vector-effect: non-scaling-stroke;
   * }
   * ```
   */
  absoluteStrokeWidth: boolean;
}

/**
 * Default icon configuration options.
 */
export const ycloudDefaultConfig: YCloudConfig = {
  color: 'currentColor',
  size: 24,
  strokeWidth: 2,
  absoluteStrokeWidth: false,
};

/**
 * Injection token for providing default configuration options.
 *
 * @internal Use {@link provideYCloudConfig}
 */
export const YCLOUD_CONFIG = new InjectionToken<YCloudConfig>('YCloud icon config', {
  factory: () => ycloudDefaultConfig,
});

/**
 * Provider for default icon configuration options.
 */
export function provideYCloudConfig(config: Partial<YCloudConfig>): Provider {
  return {
    provide: YCLOUD_CONFIG,
    useValue: {
      ...ycloudDefaultConfig,
      ...config,
    },
  };
}
