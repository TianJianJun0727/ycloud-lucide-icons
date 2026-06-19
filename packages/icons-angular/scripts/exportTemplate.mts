import base64SVG from '@ycloud-web/build-icons/utils/base64SVG';
import defineExportTemplate from '@ycloud-web/build-icons/utils/defineExportTemplate';
import { toPascalCase } from '@ycloud-web/helpers';

export default defineExportTemplate(
  async ({ componentName, iconName, getSvg, deprecated, deprecationReason, iconData }) => {
    const svgContents = await getSvg();
    const svgBase64 = base64SVG(svgContents);
    const angularComponentName = `YCloud${componentName}`;
    const selectors = [`svg[ycloud${toPascalCase(iconName)}]`];
    const aliasComponentNames: string[] = [];
    for (const alias of iconData.aliases ?? []) {
      const aliasComponentName = `YCloud${toPascalCase(alias)}`;
      const aliasSelector = `svg[ycloud${toPascalCase(alias)}]`;
      if (!selectors.includes(aliasSelector)) {
        selectors.push(aliasSelector);
      }
      if (
        aliasComponentName !== angularComponentName &&
        !aliasComponentNames.includes(aliasComponentName)
      ) {
        aliasComponentNames.push(aliasComponentName);
      }
    }

    return `\
import { YCloudIconBase } from '../ycloud-icon-base';
import { ycloudIconTemplate } from '../ycloud-icon-template';
import { YCloudIconData } from '../types';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  signal,
} from '@angular/core';

/**
 * @component @name ${componentName}
 * @description YCloud SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,${svgBase64}) - https://tianjianjun0727.github.io/ycloud-icons/icons/${iconName}
 * @see https://tianjianjun0727.github.io/ycloud-icons/guide/angular - Documentation
 *
 * @param {Object} props - YCloud icons props and any valid SVG attribute
 * ${deprecated ? `@deprecated ${deprecationReason}` : ''}
*/
@Component({
  selector: '${selectors.join(', ')}',
  template: ycloudIconTemplate,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${angularComponentName} extends YCloudIconBase {
  static readonly icon: YCloudIconData = ${JSON.stringify(iconData)};
  protected override readonly icon = signal(${angularComponentName}.icon);
}

${aliasComponentNames
  .map((aliasComponentName) => {
    return `
/**
 * @deprecated
 * @see ${angularComponentName}
 */
export const ${aliasComponentName} = ${angularComponentName};
`;
  })
  .join(`\n\n`)}
`;
  },
);
