import { InjectionToken, Provider } from '@angular/core';
import { isYCloudIconComponent, YCloudIcon, YCloudIconData, YCloudIcons } from './types';

/**
 * Injection token for providing YCloud icons by name.
 *
 * @internal Use {@link provideYCloudIcons}
 */
export const YCLOUD_ICONS = new InjectionToken<YCloudIcons>('YCloud icons', {
  factory: () => ({}),
});

/**
 * Provide YCloud icons by name.
 *
 * @remarks
 * Warning! This provider will convert dictionary keys to lower-kebab-case.
 *
 * @param icons Either a dictionary of icons or a list of Angular icon components.
 *
 * @usage
 * ```ts
 * import { provideYCloudIcons, SquareCheck } from '@ycloud-web/icons-angular';
 * import { MyCustomIcon } from './custom-icons/my-custom-icon';
 *
 * providers: [
 *   provideYCloudIcons({
 *     SquareCheck,
 *     MyCustomIcon, // YCloudIconData
 *   }),
 * ]
 * ```
 *
 * ```html
 * <svg ycloudIcon="my-custom-icon" />
 * ```
 */
export function provideYCloudIcons(...icons: Array<YCloudIcon | YCloudIconData>): Provider {
  return {
    provide: YCLOUD_ICONS,
    useValue: icons.reduce((acc, icon) => {
      const iconData = isYCloudIconComponent(icon) ? icon.icon : icon;
      acc[iconData.name] = iconData;
      for (const alias of iconData.aliases ?? []) {
        acc[alias] = iconData;
      }
      return acc;
    }, {} as YCloudIcons),
  };
}

/**
 * Converts a legacy icon node to the new format, for custom icon package support.
 *
 * @usage
 * ```ts
 * import { provideYCloudIcons, ycloudLegacyIcon } from '@ycloud-web/icons-angular';
 * import { UserRoundX } from 'ycloud-angular';
 * import { customIconNode } from './custom-icon';
 *
 * provideYCloudIcons(
 *   ycloudLegacyIcon('user-round-x', UserRoundX, ['user-circle-x']),
 *   ycloudLegacyIcon('custom-icon', customIconNode, ['custom']),
 * ),
 * ```
 */
export function ycloudLegacyIcon(
  name: string,
  node: YCloudIconData['node'],
  aliases: string[] = [],
): YCloudIconData {
  return {
    name,
    node,
    aliases,
  };
}

/**
 * Converts a map of legacy icon nodes to a list of icon data objects.
 *
 * @usage
 * ```ts
 * import { provideYCloudIcons, ycloudLegacyIconMap, YCloudCircle } from '@ycloud-web/icons-angular';
 * import { UserRoundX } from 'ycloud-angular';
 * import { customIconNode } from './custom-icon';
 *
 * provideYCloudIcons(
 *   YCloudCircle,
 *   ...ycloudLegacyIconMap({ UserRoundX, customIconNode }),
 * ),
 * ```
 */
export function ycloudLegacyIconMap(
  icons: Record<string, YCloudIconData['node']>,
): YCloudIconData[] {
  return Object.entries(icons).map(([pascalName, node]) => {
    const name: string = pascalName.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    return {
      name,
      node,
      aliases: [pascalName],
    };
  });
}
