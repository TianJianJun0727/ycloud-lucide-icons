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
const ${componentName}: YCloudIconData = ${JSON.stringify(iconData)}

export default ${componentName};
`;
};
