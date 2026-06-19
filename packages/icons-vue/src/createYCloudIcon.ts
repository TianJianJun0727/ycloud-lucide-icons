import { h } from 'vue';
import { IconNode, YCloudIcon } from './types';
import Icon from './Icon';

/**
 * Create a YCloud icon component
 * @param {string} iconName
 * @param {array} iconNode
 * @returns {FunctionalComponent} YCloudIcon
 */
const createYCloudIcon =
  (iconName: string, iconNode: IconNode): YCloudIcon =>
  (props, { slots, attrs }) =>
    h(
      Icon,
      {
        ...attrs,
        ...props,
        iconNode,
        name: iconName,
      },
      slots.default ? { default: slots.default } : undefined,
    );

export default createYCloudIcon;
