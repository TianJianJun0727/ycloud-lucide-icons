import { Base64 } from 'js-base64';
import { parseIconName, sanitizeSvg } from '../common/iconRules';
import type { PngOptionPayload, YCloudIconData } from '../common/types';
import { Meta, Tag } from './constants';
import { stripBeforeIcon } from './utils';
type TargetNode =
  | ComponentNode
  | InstanceNode
  | VectorNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | BooleanOperationNode
  | EllipseNode
  | LineNode
  | PolygonNode
  | RectangleNode
  | StarNode;
type ExtractedNode = {
  id: string;
  name: string;
  description?: string;
  node: SceneNode;
};
const SUPPORTED_ICON_NODE_TYPES = new Set([
  'BOOLEAN_OPERATION',
  'COMPONENT',
  'COMPONENT_SET',
  'ELLIPSE',
  'FRAME',
  'GROUP',
  'INSTANCE',
  'LINE',
  'POLYGON',
  'RECTANGLE',
  'SECTION',
  'STAR',
  'VECTOR',
]);
const isSupportedIconNode = (node: SceneNode) =>
  SUPPORTED_ICON_NODE_TYPES.has(
    (
      node as {
        type: string;
      }
    ).type,
  );
const makeComponentName = ({
  componentSetName,
  componentName,
  stringCase,
  separator = '_',
}: {
  componentSetName?: string;
  componentName: string;
  stringCase?: 'lower' | 'upper';
  separator?: string;
}) => {
  let name = componentName;
  if (componentSetName) {
    const variantValues = componentName.split(',').map((v) => v.split('=')[1]);
    name = `${componentSetName}${separator}${variantValues.join(separator)}`;
  }
  if (stringCase === 'lower') return name.toLowerCase();
  if (stringCase === 'upper') return name.toUpperCase();
  return name;
};
const findComponentInNode = (
  node: TargetNode | SceneNode,
  setName?: string,
  description?: string,
): ExtractedNode | ExtractedNode[] => {
  switch (
    (
      node as {
        type: string;
      }
    ).type
  ) {
    case 'FRAME': {
      return (node as SceneNode & ChildrenMixin).children.flatMap((child: any) => {
        return findComponentInNode(child, setName, description);
      });
    }
    case 'COMPONENT': {
      const svgName = makeComponentName({
        componentSetName: setName,
        componentName: node.name,
        stringCase: 'lower',
        separator: '_',
      });
      return {
        id: node.id,
        name: svgName,
        description: description || ('description' in node ? node.description : undefined),
        node,
      };
    }
    case 'GROUP':
    case 'SECTION':
    case 'INSTANCE':
    case 'VECTOR':
    case 'BOOLEAN_OPERATION':
    case 'ELLIPSE':
    case 'LINE':
    case 'POLYGON':
    case 'RECTANGLE':
    case 'STAR': {
      return {
        id: node.id,
        name: node.name,
        description,
        node,
      };
    }
    case 'COMPONENT_SET': {
      const componentSet = node as ComponentSetNode;
      return componentSet.children.flatMap((child: any) => {
        return findComponentInNode(
          child,
          componentSet.name,
          description || ('description' in componentSet ? componentSet.description : undefined),
        );
      });
    }
    default: {
      return [];
    }
  }
};
function canTemporarilyRemoveFills() {
  return figma.editorType !== 'dev';
}
function removeAndStoreFills(node: SceneNode): Map<string, readonly Paint[]> {
  const fillsMap = new Map<string, readonly Paint[]>();
  if (!canTemporarilyRemoveFills()) {
    return fillsMap;
  }
  if (node.type === 'FRAME' && 'fills' in node && node.id) {
    fillsMap.set(node.id, node.fills as readonly Paint[]);
    node.fills = [];
  }
  if ('children' in node) {
    for (const child of node.children) {
      const childFillsMap = removeAndStoreFills(child);
      childFillsMap.forEach((fills, id) => {
        fillsMap.set(id, fills);
      });
    }
  }
  return fillsMap;
}
function restoreFills(node: SceneNode, fillsMap: Map<string, readonly Paint[]>) {
  if (fillsMap.size === 0) {
    return;
  }
  if (node.type === 'FRAME' && 'fills' in node && node.id && fillsMap.has(node.id)) {
    node.fills = fillsMap.get(node.id)!;
  }
  if ('children' in node) {
    for (const child of node.children) {
      restoreFills(child, fillsMap);
    }
  }
}
export function getAssetFramesInFrame(targetFrame: FrameNode): ExtractedNode[] {
  return getAssetFramesFromNodes(targetFrame.children);
}
export function getAssetFramesFromNodes(nodes: ReadonlyArray<SceneNode>): ExtractedNode[] {
  const targetNodes = nodes.flatMap((child) => {
    if (
      (
        child as {
          type: string;
        }
      ).type === 'COMPONENT_SET'
    ) {
      return findComponentInNode(child);
    }
    if (isSupportedIconNode(child)) {
      return {
        id: child.id,
        name: child.name,
        description: 'description' in child ? child.description : undefined,
        node: child,
      };
    }
    return [];
  });
  return targetNodes.filter((component) => component);
}
function createRegexWithDelimiters(startDelimiter: string, endDelimiter: string): RegExp {
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = escapeRegExp(startDelimiter);
  const end = escapeRegExp(endDelimiter);
  return new RegExp(`${start}(.*?)${end}`);
}
function extractMetadataFromDescription(description: string) {
  const regex = createRegexWithDelimiters('[', ']');
  const metadatasRegexResult = regex.exec(description);
  if (metadatasRegexResult && metadatasRegexResult.length === 2) {
    return metadatasRegexResult[1].split(',');
  }
  return [];
}
function getMetadatasFromName(name: string) {
  const metadatas = [];
  if (name.startsWith(Meta.figmaNotPublished)) {
    metadatas.push(Tag.figmaNotPublished);
  }
  if (name.includes(Meta.service)) {
    metadatas.push(Tag.service);
  }
  if (name.includes(Meta.fat)) {
    metadatas.push(Tag.fat);
  }
  return metadatas;
}
export async function getSvgFromExtractedNodes(nodes: ExtractedNode[]) {
  const datas = await Promise.allSettled(
    nodes.map(async (component) => {
      const name = component.name;
      const parsedName = parseIconName(name);
      const node = component.node;
      const description = component.description;
      const metadatas = [
        ...extractMetadataFromDescription(description || ''),
        ...getMetadatasFromName(name),
      ];
      const fillsMap = removeAndStoreFills(node);
      const rawSvg = await node.exportAsync({
        format: 'SVG_STRING',
        svgIdAttribute: true,
      });
      const svg = sanitizeSvg(rawSvg);
      restoreFills(node, fillsMap);
      return {
        name: parsedName.fileName || stripBeforeIcon(name),
        svg,
        sourceSvg: rawSvg,
        metadatas,
        ycloud: {
          nameZh: parsedName.nameZh,
          nameEn: parsedName.nameEn,
        },
        figma: {
          name: node.name,
          key: 'key' in node ? node.key : '',
          description: 'description' in node ? node.description : description,
        },
      };
    }),
  );
  const dataMap = datas.reduce(
    (acc, cur) => {
      if (cur.status === 'rejected') console.error(cur.reason);
      if (cur.status === 'fulfilled') {
        const { name, ...rest } = cur.value as YCloudIconData;
        const removedName = stripBeforeIcon(name);
        acc[removedName] = {
          ...rest,
          name,
        };
      }
      return acc;
    },
    {} as Record<string, YCloudIconData>,
  );
  return dataMap;
}
export async function exportFromYCloudIconData(
  nodes: ExtractedNode[],
  icons: Record<string, YCloudIconData>,
  png: PngOptionPayload,
) {
  const result = icons;
  for (const component of nodes) {
    const node = component.node;
    const parsedName = parseIconName(component.name);
    const name = parsedName.fileName || stripBeforeIcon(component.name);
    if (!result[name]) {
      continue;
    }
    const fillsMap = removeAndStoreFills(node);
    const exportDatas = await Promise.allSettled(
      Object.entries(png).map(async ([key, value]) => {
        const scale = Number(key.replace('x', ''));
        if (!value) {
          return {
            scale: key,
            data: '',
          };
        }
        const exportData = await node.exportAsync({
          format: 'PNG',
          constraint: {
            type: 'SCALE',
            value: scale,
          },
        });
        const base64String = Base64.fromUint8Array(exportData);
        return {
          scale: key,
          data: base64String,
        };
      }),
    );
    restoreFills(node, fillsMap);
    const pngDatas = exportDatas.reduce(
      (acc, cur) => {
        if (cur.status === 'rejected') console.error(cur.reason);
        if (cur.status === 'fulfilled') {
          const { scale, data } = cur.value as {
            scale: keyof YCloudIconData['png'];
            data: string;
          };
          acc[scale] = data;
        }
        return acc;
      },
      {} as Record<keyof YCloudIconData['png'], string>,
    );
    result[name] = {
      ...result[name],
      figma: {
        name: node.name,
        key: 'key' in node ? node.key : '',
        description: 'description' in node ? node.description : component.description,
      },
      png: {
        ...pngDatas,
      },
    };
  }
  return result;
}
