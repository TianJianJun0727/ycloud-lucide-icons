/**
 * Get the attributes of an HTML element.
 * @param {HTMLElement} element
 * @returns {Object}
 */
export const getAttrs = (element: Element): Record<string, string> =>
  Array.from(element.attributes).reduce<Record<string, string>>((attrs, attr) => {
    attrs[attr.name] = attr.value;
    return attrs;
  }, {});

/**
 * Gets the classNames of an attributes Object.
 * @param {Object} attrs
 * @returns {Array}
 */
export const getClassNames = (
  attrs: Record<string, number | string | string[]> | string,
): string | string[] => {
  if (typeof attrs === 'string') return attrs;
  if (!attrs || !attrs.class) return '';
  if (attrs.class && typeof attrs.class === 'string') {
    return attrs.class.split(' ');
  }
  if (attrs.class && Array.isArray(attrs.class)) {
    return attrs.class;
  }
  return '';
};
