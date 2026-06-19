import replaceElement from './replaceElement';
import * as iconAndAliases from './iconsAndAliases';
import { Icons, SVGProps } from './types';

export interface CreateIconsOptions {
  icons?: Icons;
  nameAttr?: string;
  attrs?: SVGProps;
  root?: Element | Document | DocumentFragment;
  inTemplates?: boolean;
}

/**
 * 将匹配 nameAttr 的元素替换为对应图标。
 * @param {CreateIconsOptions} options
 */
const createIcons = ({
  icons = {},
  nameAttr = 'data-ycloud',
  attrs = {},
  root = document,
  inTemplates,
}: CreateIconsOptions = {}) => {
  if (!Object.values(icons).length) {
    throw new Error(
      "请提供 icons 对象。\n如果需要使用全部图标，可以这样导入：\n `import { createIcons, icons } from '@ycloud-web/icons';\ncreateIcons({ icons });`",
    );
  }

  if (typeof root === 'undefined') {
    throw new Error('`createIcons()` 只能在浏览器环境中使用。');
  }

  const elementsToReplace = Array.from(root.querySelectorAll(`[${nameAttr}]`));

  elementsToReplace.forEach((element) => replaceElement(element, { nameAttr, icons, attrs }));

  if (inTemplates) {
    const templates = Array.from(root.querySelectorAll('template'));

    templates.forEach((template) =>
      createIcons({
        icons,
        nameAttr,
        attrs,
        root: template.content,
        inTemplates,
      }),
    );
  }

  /** @todo: 在 v1.0 中移除该兼容逻辑。 */
  if (nameAttr === 'data-ycloud') {
    const deprecatedElements = root.querySelectorAll('[icon-name]');
    if (deprecatedElements.length > 0) {
      console.warn(
        '[YCloud Icons] 检测到部分图标仍在使用已废弃的 icon-name 属性。为了向后兼容，这些图标目前仍会被替换，但 v1.0 将不再支持该属性，请改用 data-ycloud。',
      );
      Array.from(deprecatedElements).forEach((element) =>
        replaceElement(element, { nameAttr: 'icon-name', icons, attrs }),
      );
    }
  }
};

export { createIcons };

/*
  导出 createElement 函数。
*/
export { default as createElement } from './createElement';

/*
 导出图标。
*/
export { iconAndAliases as icons };
export * from './icons';
export * from './aliases';

/*
 导出类型。
*/
export * from './types';
