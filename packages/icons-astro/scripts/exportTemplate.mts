import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';

export default defineExportTemplate(
  async ({ componentName, iconName, children, getSvg, deprecated, deprecationReason }) => {
    const svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);

    // Astro doesn't need keyed children in loops
    const keylessChildren = children.map((c) => {
      const [element, { key, ...otherAttrs }] = c;
      return [element, otherAttrs];
    });

    // TODO: build-icons' `pretty` is set to false as the prettier
    // formatter uses babel which I'm not sure it supports typescript
    return `
import createYCloudIcon from '../createYCloudIcon';
import type { AstroComponent } from '../types'

/**
 * @component @name ${componentName}
 * @description YCloud SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
 * @see https://tianjianjun0727.github.io/ycloud-icons/guide/astro - Documentation
 *
 * @param {import('../types').IconProps} props - YCloud icons props and any valid SVG attribute
 * @returns {any} Astro Component
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
 */
const ${componentName} = createYCloudIcon('${iconName}', ${JSON.stringify(keylessChildren)}) as AstroComponent;

export default ${componentName};
`;
  },
);
