import { YCloudBuildParams, YCloudIconData, YCloudIconNode } from './types';

const toStringAttributes = (attributes: Record<string, string | number | undefined>) =>
  Object.fromEntries(
    Object.entries(attributes)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );

const mapNode = (node: YCloudIconNode, params: YCloudBuildParams): YCloudIconNode => {
  const [name, attrs, children] = node;
  const mappedAttrs = toStringAttributes(
    params['absoluteStrokeWidth'] ? { 'vector-effect': 'non-scaling-stroke', ...attrs } : attrs,
  );

  if (children) {
    return [name, mappedAttrs, children.map((child) => mapNode(child, params))];
  }

  return [name, mappedAttrs];
};

/**
 * Creates a YCloud icon node (an svgson-like format) from a YCloud icon object.
 *
 * @param icon The icon to build.
 * @param params Additional build parameters.
 */
function buildYCloudIconNode(icon: YCloudIconData, params: YCloudBuildParams = {}): YCloudIconNode {
  const aliasClassNames = icon.aliases?.map((alias) => `ycloud-${alias}`) ?? [];
  const classList = ['ycloud', `ycloud-${icon.name}`, ...aliasClassNames];
  if (params['className']) {
    classList.push(params['className']);
  }
  const attributes = {
    ...icon.attrs,
    ...('color' in params && { stroke: params['color'] }),
    ...('size' in params &&
      params['size'] && {
        width: params['size'].toString(10),
        height: params['size'].toString(10),
      }),
    ...('width' in params && params['width'] && { width: params['width'].toString(10) }),
    ...('height' in params && params['height'] && { height: params['height'].toString(10) }),
    ...('strokeWidth' in params &&
      params['strokeWidth'] && { 'stroke-width': params['strokeWidth'].toString(10) }),
    class: classList.join(' '),
    ...('attributes' in params && params.attributes),
  };
  return ['svg', toStringAttributes(attributes), icon.node.map((node) => mapNode(node, params))];
}

export default buildYCloudIconNode;
