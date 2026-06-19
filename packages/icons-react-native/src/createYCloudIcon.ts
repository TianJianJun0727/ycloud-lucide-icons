import { forwardRef, createElement } from 'react';
import { IconNode, YCloudIconsProps } from './types';
import { toPascalCase } from '@ycloud-web/shared';
import Icon from './Icon';

/**
 * Create a YCloud icon component
 * @param {string} iconName
 * @param {array} iconNode
 * @returns {ForwardRefExoticComponent} YCloudIcon
 */
const createYCloudIcon = (iconName: string, iconNode: IconNode) => {
  const Component = forwardRef<SVGSVGElement, YCloudIconsProps>((props, ref) =>
    createElement(Icon, {
      ref,
      iconNode,
      ...props,
    }),
  );

  Component.displayName = toPascalCase(iconName);

  return Component;
};

export default createYCloudIcon;
