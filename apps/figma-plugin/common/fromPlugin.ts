import type { ExportOptions, YCloudIconData } from './types.js';
declare const figma: {
  ui: {
    postMessage: (message: unknown) => void;
  };
};
interface UserInfoPayload {
  name: string;
  id: string;
}
interface GetGithubRepoUrlPayload {
  repoUrl?: string;
}
interface GetGithubApiKeyPayload {
  apiKey?: string;
}
interface GetDeployWithPngPayload {
  options: ExportOptions;
}
interface GetIconPreviewPayload {
  icons: Record<string, YCloudIconData>;
}
interface DeployDonePayload {
  status: 'success' | 'error';
  message: string;
  url?: string;
}
export type Events = {
  GET_USER_INFO: {
    name: 'GET_USER_INFO';
    payload: UserInfoPayload;
    handler: (props: UserInfoPayload) => void;
  };
  GET_GITHUB_REPO_URL: {
    name: 'GET_GITHUB_REPO_URL';
    payload: GetGithubRepoUrlPayload;
    handler: (props: GetGithubRepoUrlPayload) => void;
  };
  GET_GITHUB_API_KEY: {
    name: 'GET_GITHUB_API_KEY';
    payload: GetGithubApiKeyPayload;
    handler: (props: GetGithubApiKeyPayload) => void;
  };
  GET_DEPLOY_WITH_PNG: {
    name: 'GET_DEPLOY_WITH_PNG';
    payload: GetDeployWithPngPayload;
    handler: (props: GetDeployWithPngPayload) => void;
  };
  GET_ICON_PREVIEW: {
    name: 'GET_ICON_PREVIEW';
    payload: GetIconPreviewPayload;
    handler: (props: GetIconPreviewPayload) => void;
  };
  DEPLOY_DONE: {
    name: 'DEPLOY_DONE';
    payload: DeployDonePayload;
    handler: (props: DeployDonePayload) => void;
  };
  CHANGE_FILE_NAME: {
    name: 'CHANGE_FILE_NAME';
    payload: string;
    handler: (fileName: string) => void;
  };
};
type EventName = keyof Events;
export const emit = <T extends EventName>(name: T, payload: Events[T]['payload']) => {
  figma.ui.postMessage([name, payload]);
};
export const on = <T extends keyof Events>(name: T, handler: Events[T]['handler']) => {
  window.addEventListener('message', (event) => {
    const pluginMessage = event.data.pluginMessage;
    if (!Array.isArray(pluginMessage)) return;
    const [eventName, payload] = pluginMessage;
    if (eventName === name) {
      handler(payload);
    }
  });
};
