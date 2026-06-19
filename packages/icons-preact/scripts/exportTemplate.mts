import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';

export default defineExportTemplate(
  async ({ componentName, iconName, children, getSvg, deprecated, deprecationReason }) => {
    const svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);

    return `
import createYCloudIcon from '../createYCloudIcon';

/**
 * @component @name ${componentName}
 * @description YCloud SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
 * @see https://tianjianjun0727.github.io/ycloud-icons/guide/preact - Documentation
 *
 * @param {Object} props - YCloud icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
 */
const ${componentName} = createYCloudIcon('${iconName}', ${JSON.stringify(children)});

export default ${componentName};
`;
  },
);
