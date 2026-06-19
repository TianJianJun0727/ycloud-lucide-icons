import { YCloudBuildParams, YCloudIconData, YCloudIconNode } from './types';
import buildYCloudIconNode from './buildYCloudIconNode';

const buildDomNode = ([tagName, attributes, children = []]: YCloudIconNode): string =>
  `<${tagName} ${Object.entries(attributes)
    .map(([attrName, value]) => `${attrName}="${value}"`)
    .join(' ')}>${children?.map((child) => buildDomNode(child)).join('')}</${tagName}>`;

/**
 * Creates an SVG string from a YCloud icon object.
 *
 * @param icon The icon to build.
 * @param params Additional build parameters.
 */
function buildYCloudSvg(icon: YCloudIconData, params: YCloudBuildParams = {}) {
  return buildDomNode(buildYCloudIconNode(icon, params));
}

export default buildYCloudSvg;
