import { createElement, forwardRef } from 'react';
import { mergeClasses, toKebabCase, toPascalCase } from '@ycloud-web/shared';
import { IconNode, YCloudIconsProps } from './types';
import Icon from './Icon';

/**
 * Create a YCloud icon component
 * @param {string} iconName
 * @param {array} iconNode
 * @returns {ForwardRefExoticComponent} YCloudIcon
 */
const createYCloudIcon = (iconName: string, iconNode: IconNode) => {
  const Component = forwardRef<SVGSVGElement, YCloudIconsProps>(({ className, ...props }, ref) =>
    createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `ycloud-${toKebabCase(toPascalCase(iconName))}`,
        `ycloud-${iconName}`,
        className,
      ),
      ...props,
    }),
  );

  Component.displayName = toPascalCase(iconName);

  return Component;
};

export default createYCloudIcon;
