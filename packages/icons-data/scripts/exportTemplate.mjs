/* eslint-disable import/no-extraneous-dependencies */
import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';

export default async ({
  componentName,
  iconName,
  getSvg,
  deprecated,
  deprecationReason,
  iconData,
}) => {
  const svgContents = await getSvg();
  const svgBase64 = base64SVG(svgContents);
  const attrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: `0 0 ${'size' in iconData ? iconData.size : iconData.width} ${'size' in iconData ? iconData.size : iconData.height}`,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };
  const data = {
    name: iconData.name,
    attrs,
    node: iconData.node,
    ...(iconData.aliases ? { aliases: iconData.aliases } : {}),
  };

  return `
import type { YCloudIconData } from '../types';

/**
 * @name ${iconName}
 * @description YCloud SVG icon node.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
 * @see https://tianjianjun0727.github.io/ycloud-icons/guide/ycloud - Documentation
 *
 * @returns {Array}
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
 */
const ${componentName}: YCloudIconData = ${JSON.stringify(data)}

export default ${componentName};
`;
};
