import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';

export default defineExportTemplate(
  async ({ componentName, iconName, children, getSvg, deprecated, deprecationReason }) => {
    const svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);

    return `
import defaultAttributes from '../defaultAttributes';
import type { IconData } from '../types';

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
const ${componentName}: IconData = {
  name: '${iconName}',
  attrs: defaultAttributes,
  node: ${JSON.stringify(children)},
};

export default ${componentName};
`;
  },
);
