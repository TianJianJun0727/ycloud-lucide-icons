import { showUI } from '@create-figma-plugin/utilities';
import { FRAME_NAME, KEY } from '../common/constants.js';
import { emit } from '../common/fromPlugin.js';
import {
  listenDeployIcon,
  listenPngOption,
  listenSetGithubApiKey,
  listenSetGithubUrl,
  listenYCloudMetadata,
} from './listeners.js';
import { getAssetFramesFromNodes, getSvgFromExtractedNodes } from './service.js';
import { findYCloudIconsFrame, getLocalData, getYCloudIconsSourceNodes } from './utils.js';
function sendUserInfo() {
  if (!figma.currentUser) return;
  emit('GET_USER_INFO', {
    id: figma.currentUser.id || '',
    name: figma.currentUser.name,
  });
}
function sendFileName() {
  const FILENAME_PREFIX = 'filename=';
  const iconaFrame = findYCloudIconsFrame();
  if (!iconaFrame) return;
  const fileNamePart = iconaFrame.name.split(',').find((part: string) => {
    return part.startsWith(FILENAME_PREFIX);
  });
  const fileName = fileNamePart ? fileNamePart.replace(FILENAME_PREFIX, '') : undefined;
  if (fileName) {
    emit('CHANGE_FILE_NAME', fileName);
  }
}
async function sendStorageData() {
  const repoUrl = await getLocalData(KEY.GITHUB_REPO_URL);
  const apiKey = await getLocalData(KEY.GITHUB_API_KEY);
  const pngOption = await getLocalData(KEY.PNG_OPTIONS);
  const ycloudMetadata = await getLocalData(KEY.YCLOUD_METADATA);
  emit('GET_GITHUB_REPO_URL', { repoUrl });
  emit('GET_GITHUB_API_KEY', { apiKey });
  emit('GET_DEPLOY_WITH_PNG', {
    options: {
      png: pngOption?.png || { '1x': false, '2x': false, '3x': false, '4x': false },
      fileName: 'icons',
      ycloud: ycloudMetadata?.ycloud || {
        categories: [],
        tagsZh: [],
        useCasesZh: [],
      },
    },
  });
}
async function setPreviewIcons() {
  const sourceNodes = getYCloudIconsSourceNodes();
  if (sourceNodes.length === 0) {
    emit('GET_ICON_PREVIEW', { icons: {} });
    figma.notify(`未找到 ${FRAME_NAME}，也没有选中可导出的图标。请选择一个区块、画框或图标图层。`);
    return;
  }
  const assetFrames = getAssetFramesFromNodes(sourceNodes);
  const datas = await getSvgFromExtractedNodes(assetFrames);
  emit('GET_ICON_PREVIEW', { icons: datas });
  if (assetFrames.length === 0) {
    figma.notify(
      '没有识别到可导出的图标。请把每个图标作为独立区块、画框、分组、组件或矢量图层，或直接选中要提交的图标。',
    );
  }
}
let previewTimer: ReturnType<typeof setTimeout> | undefined;
function schedulePreviewIcons() {
  if (previewTimer) {
    clearTimeout(previewTimer);
  }
  previewTimer = setTimeout(() => {
    sendFileName();
    setPreviewIcons();
  }, 300);
}
export default function main() {
  showUI({ width: 420, height: 640 });
  sendUserInfo();
  sendStorageData();
  sendFileName();
  setPreviewIcons();
  listenDeployIcon();
  listenSetGithubApiKey();
  listenSetGithubUrl();
  listenPngOption();
  listenYCloudMetadata();
  figma.on('currentpagechange', () => {
    schedulePreviewIcons();
  });
  figma.on('selectionchange', () => {
    schedulePreviewIcons();
  });
}
