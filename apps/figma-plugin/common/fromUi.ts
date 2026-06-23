import type {
  ExportOptions,
  PngOptionPayload,
  YCloudIconData,
  YCloudMetadataOptions,
} from './types.js';
declare const figma: {
  ui: {
    onmessage: ((message: unknown) => void) | undefined;
  };
};
interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}
interface DeployIconPayload {
  githubData: GithubData;
  icons: Record<string, YCloudIconData>;
  options: ExportOptions;
}
interface SetPngOptionPayload {
  png: PngOptionPayload;
}
interface SetYCloudMetadataPayload {
  ycloud: YCloudMetadataOptions;
}
interface SetGithubUrlPayload {
  url: string;
}
interface SetGithubApiKeyPayload {
  apiKey: string;
}
export type Events = {
  SET_GITHUB_URL: {
    name: 'SET_GITHUB_URL';
    payload: SetGithubUrlPayload;
    handler: (props: SetGithubUrlPayload) => void;
  };
  SET_GITHUB_API_KEY: {
    name: 'SET_GITHUB_API_KEY';
    payload: SetGithubApiKeyPayload;
    handler: (props: SetGithubApiKeyPayload) => void;
  };
  SET_PNG_OPTIONS: {
    name: 'SET_PNG_OPTIONS';
    payload: SetPngOptionPayload;
    handler: (props: SetPngOptionPayload) => void;
  };
  SET_YCLOUD_METADATA: {
    name: 'SET_YCLOUD_METADATA';
    payload: SetYCloudMetadataPayload;
    handler: (props: SetYCloudMetadataPayload) => void;
  };
  DEPLOY_ICON: {
    name: 'DEPLOY_ICON';
    payload: DeployIconPayload;
    handler: (props: DeployIconPayload) => void;
  };
};
type EventName = keyof Events;
const handlers = new Map<string, Array<(payload: unknown) => void>>();
let isListening = false;
export const emit = <T extends EventName>(name: T, payload: Events[T]['payload']) => {
  parent.postMessage({ pluginMessage: [name, payload] }, '*');
};
export const on = <T extends keyof Events>(name: T, handler: Events[T]['handler']) => {
  const existingHandlers = handlers.get(name) ?? [];
  handlers.set(name, [...existingHandlers, handler as (payload: unknown) => void]);
  if (isListening) return;
  isListening = true;
  figma.ui.onmessage = (pluginMessage: unknown) => {
    if (!Array.isArray(pluginMessage)) return;
    const [eventName, payload] = pluginMessage;
    handlers.get(eventName)?.forEach((registeredHandler) => {
      registeredHandler(payload);
    });
  };
};
