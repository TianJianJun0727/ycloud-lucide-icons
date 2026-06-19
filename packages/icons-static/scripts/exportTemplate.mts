import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';

export default defineExportTemplate(
  async ({ componentName, iconName, getSvg, deprecated, deprecationReason }) => {
    let svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);

    svgContents = svgContents.replace(
      '<svg',
      `
<svg
  class="ycloud ycloud-${iconName}"`,
    );

    return `
/**
 * @name ${iconName}
 * @description YCloud SVG string.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
 * @see https://tianjianjun0727.github.io/ycloud-icons/guide/static - Documentation
 *
 * @returns {String}
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
 */
const ${componentName}: string = \`\
${svgContents}\
\`

export default ${componentName};
`;
  },
);
