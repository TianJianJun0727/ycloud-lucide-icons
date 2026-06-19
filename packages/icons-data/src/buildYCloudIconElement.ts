import { YCloudBuildParams, YCloudIconData, YCloudIconNode } from './types';
import buildYCloudIconNode from './buildYCloudIconNode';

const buildDomElement = (
  document: Document,
  [tagName, attributes, children = []]: YCloudIconNode,
): Element => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  for (const [attrName, value] of Object.entries(attributes)) {
    element.setAttribute(attrName, value);
  }
  for (const node of children) {
    const childNode = buildDomElement(document, node);
    element.appendChild(childNode);
  }
  return element;
};

/**
 * Creates an SvgElement from a YCloud icon object.
 *
 * @param document The document to create the Element in.
 * @param icon The icon to build.
 * @param params Additional build parameters.
 */
function buildYCloudIconElement(
  document: Document,
  icon: YCloudIconData,
  params: YCloudBuildParams = {},
) {
  return buildDomElement(document, buildYCloudIconNode(icon, params));
}

export default buildYCloudIconElement;
