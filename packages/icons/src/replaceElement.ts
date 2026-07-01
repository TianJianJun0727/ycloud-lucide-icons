import createElement from './createElement';
import defaultAttributes from './defaultAttributes';
import { Icons, SVGProps } from './types';
import { hasA11yProp, mergeClasses, toPascalCase } from '@ycloud-web/shared';
import { getAttrs, getClassNames } from './replaceElementUtils';

export type CustomAttrs = { [attr: string]: any };

interface ReplaceElementOptions {
  nameAttr: string;
  icons: Icons;
  attrs: SVGProps;
}

/**
 * ReplaceElement, replaces the given element with the created icon.
 * @param {HTMLElement} element
 * @param {{ nameAttr: string, icons: object, attrs: object }} options: { nameAttr, icons, attrs }
 * @returns {Function}
 */
const replaceElement = (element: Element, { nameAttr, icons, attrs }: ReplaceElementOptions) => {
  const iconName = element.getAttribute(nameAttr);

  if (iconName == null) return;

  const ComponentName = toPascalCase(iconName);

  const iconNode = icons[ComponentName];

  if (!iconNode) {
    return console.warn(
      `${element.outerHTML} icon name was not found in the provided icons object.`,
    );
  }

  const elementAttrs = getAttrs(element);

  const ariaProps = hasA11yProp(elementAttrs) ? {} : { 'aria-hidden': 'true' };

  const iconAttrs = {
    ...defaultAttributes,
    'data-ycloud': iconName,
    ...ariaProps,
    ...attrs,
    ...elementAttrs,
  } satisfies SVGProps;

  const elementClassNames = getClassNames(elementAttrs);
  const className = getClassNames(attrs);

  const classNames = mergeClasses(
    'ycloud',
    `ycloud-${iconName}`,
    ...elementClassNames,
    ...className,
  );

  if (classNames) {
    Object.assign(iconAttrs, {
      class: classNames,
    });
  }

  const svgElement = createElement(iconNode, iconAttrs);

  if (!element.parentNode) return;

  return element.parentNode.replaceChild(svgElement, element);
};

export default replaceElement;
