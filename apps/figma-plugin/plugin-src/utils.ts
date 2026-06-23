import { FRAME_NAME } from '../common/constants';
const SOURCE_CONTAINER_TYPES = new Set(['FRAME', 'GROUP', 'SECTION']);
function isSourceContainer(node: PageNode | SceneNode): node is SceneNode & ChildrenMixin {
  return (
    SOURCE_CONTAINER_TYPES.has(
      (
        node as {
          type: string;
        }
      ).type,
    ) && 'children' in node
  );
}
export async function getLocalData(key: string) {
  const data = await figma.clientStorage.getAsync(key);
  return data;
}
export async function setLocalData(key: string, data: any) {
  await figma.clientStorage.setAsync(key, data);
}
export function findYCloudIconsFrame(): (SceneNode & ChildrenMixin) | null {
  const frame = figma.currentPage.findOne((node) => {
    return isSourceContainer(node) && node.name.startsWith(FRAME_NAME);
  });
  return frame as (SceneNode & ChildrenMixin) | null;
}
export function getYCloudIconsFrame(): SceneNode & ChildrenMixin {
  const frame = findYCloudIconsFrame();
  if (!frame) {
    figma.notify(`未找到 ${FRAME_NAME}`);
    throw new Error(`未找到 ${FRAME_NAME}`);
  }
  return frame;
}
export function getYCloudIconsSourceNodes(): ReadonlyArray<SceneNode> {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && isSourceContainer(selection[0])) {
    return selection[0].children;
  }
  if (selection.length > 0) {
    return selection;
  }
  const namedSource = findYCloudIconsFrame();
  if (namedSource) {
    return namedSource.children;
  }
  return [];
}
export function stripBeforeIcon(name: string) {
  if (name.includes('icon')) {
    return name.replace(/.*icon_/, 'icon_');
  }
  return name;
}
