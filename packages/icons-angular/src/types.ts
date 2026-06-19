import { Signal, Type } from '@angular/core';

type HtmlAttributes = { [key: string]: string | number };
export type YCloudIconNode = readonly [string, HtmlAttributes];
export type YCloudIcons = { [key: string]: YCloudIconData };

/**
 * A YCloud icon object that fully describes an icon to be displayed.
 */
export type YCloudIconData = {
  name: string;
  size?: number;
  node: YCloudIconNode[];
  aliases?: string[];
};

/**
 * Input signal map of YCloud icon components.
 */
interface YCloudIconProps {
  title: Signal<Nullable<string>>;
  size: Signal<Nullable<number | string>>;
  color: Signal<Nullable<string>>;
  strokeWidth: Signal<Nullable<number | string>>;
  absoluteStrokeWidth: Signal<Nullable<boolean>>;
}

/**
 * Represents a YCloud icon component type that has `iconName` and `iconData` signals inherited from `YCloudIconBase` and respective static members accessible without instantiating the component.
 */
export interface YCloudIcon extends Type<YCloudIconProps> {
  icon: YCloudIconData;
}

/**
 * Type guard for {@link YCloudIconData}
 */
export function isYCloudIconData(icon: unknown): icon is YCloudIconData {
  return (
    !!icon &&
    typeof icon === 'object' &&
    'name' in icon &&
    typeof icon.name === 'string' &&
    'node' in icon &&
    Array.isArray(icon.node)
  );
}

/**
 * Type guard for {@link YCloudIcon}
 */
export function isYCloudIconComponent(icon: unknown): icon is YCloudIcon {
  return icon instanceof Type && 'icon' in icon && isYCloudIconData(icon.icon);
}

export type YCloudIconInput = YCloudIcon | YCloudIconData | string;

/**
 * @internal
 */
export type Nullable<T> = T | null | undefined;
