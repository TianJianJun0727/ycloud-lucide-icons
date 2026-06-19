import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';

export default defineExportTemplate(
  async ({ componentName, iconName, children, getSvg, deprecated, deprecationReason }) => {
    const svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);

    return `
import createYCloudIcon from '../createYCloudIcon';
import { IconNode } from '../types';

export const __iconNode: IconNode = ${JSON.stringify(children)}

/**
 * @component @name ${componentName}
 * @description YCloud SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
 * @see https://tianjianjun0727.github.io/ycloud-icons/guide/vue - Documentation
 *
 * @param {Object} props - YCloud icons props and any valid SVG attribute
 * @returns {FunctionalComponent} Vue component
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
 */
const ${componentName} = createYCloudIcon('${iconName}', __iconNode);

export default ${componentName};
`;
  },
);
