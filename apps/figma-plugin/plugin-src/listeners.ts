import { KEY } from '../common/constants.js';
import { emit } from '../common/fromPlugin.js';
import { on } from '../common/fromUi.js';
import { createGithubClient } from './github.js';
import { exportFromYCloudIconData, getAssetFramesFromNodes } from './service.js';
import { getYCloudIconsSourceNodes, setLocalData } from './utils.js';
export function listenDeployIcon() {
  on('DEPLOY_ICON', async ({ githubData, icons, options }) => {
    try {
      const { owner, name, apiKey } = githubData;
      const { png, ycloud } = options;
      const sourceType = options.sourceType ?? 'generic';
      const { createDeployPR } = createGithubClient(owner, name, apiKey);
      const sourceNodes = getYCloudIconsSourceNodes();
      if (sourceNodes.length === 0) {
        const message = '未找到图标来源。请选择一个区块、画框或图标图层后再提交。';
        emit('DEPLOY_DONE', {
          status: 'error',
          message,
        });
        figma.notify(message, { timeout: 5000, error: true });
        return;
      }
      const assetFrames = getAssetFramesFromNodes(sourceNodes);
      if (assetFrames.length === 0) {
        const message = '没有识别到可提交的图标。请确认每个图标是独立图层，并使用清晰的图层名称。';
        emit('DEPLOY_DONE', {
          status: 'error',
          message,
        });
        figma.notify(message, { timeout: 5000, error: true });
        return;
      }
      const iconData =
        sourceType === 'business' ? icons : await exportFromYCloudIconData(assetFrames, icons, png);
      const pullRequest = await createDeployPR(iconData, ycloud, sourceType);
      emit('DEPLOY_DONE', {
        status: 'success',
        message:
          sourceType === 'business'
            ? '已创建业务图标审核单，等待合并。'
            : '已创建审核单，等待图标库合并。',
        url: pullRequest.html_url,
      });
      figma.notify('已创建图标审核单', { timeout: 5000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交图标失败。';
      figma.notify(`提交图标失败：${message}`, {
        timeout: 5000,
        error: true,
      });
      emit('DEPLOY_DONE', {
        status: 'error',
        message: `提交图标失败：${message}`,
      });
    }
  });
}
export function listenSetGithubApiKey() {
  on('SET_GITHUB_API_KEY', ({ apiKey }) => {
    setLocalData(KEY.GITHUB_API_KEY, apiKey);
  });
}
export function listenSetGithubUrl() {
  on('SET_GITHUB_URL', ({ url }) => {
    setLocalData(KEY.GITHUB_REPO_URL, url);
  });
}
export function listenPngOption() {
  on('SET_PNG_OPTIONS', ({ png }) => {
    setLocalData(KEY.PNG_OPTIONS, png);
  });
}
export function listenYCloudMetadata() {
  on('SET_YCLOUD_METADATA', ({ ycloud }) => {
    setLocalData(KEY.YCLOUD_METADATA, ycloud);
  });
}
