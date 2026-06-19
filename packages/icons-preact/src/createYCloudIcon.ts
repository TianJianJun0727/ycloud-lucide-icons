import { h, type JSX } from 'preact';
import { mergeClasses, toKebabCase, toPascalCase } from '@ycloud-web/shared';
import Icon from './Icon';
import type { IconNode, YCloudIcon, YCloudIconsProps } from './types';

/**
 * Create a YCloud icon component
 * @param {string} iconName
 * @param {array} iconNode
 * @returns {FunctionComponent} YCloudIcon
 */
const createYCloudIcon = (iconName: string, iconNode: IconNode): YCloudIcon => {
  const Component = ({
    class: classes = '',
    className = '',
    children,
    ...props
  }: YCloudIconsProps) =>
    h(
      Icon,
      {
        ...props,
        iconNode,
        class: mergeClasses<string | JSX.SignalLike<string | undefined>>(
          `ycloud-${toKebabCase(toPascalCase(iconName))}`,
          `ycloud-${toKebabCase(iconName)}`,
          classes,
          className,
        ),
      },
      children,
    );

  Component.displayName = toPascalCase(iconName);

  return Component;
};

export default createYCloudIcon;
