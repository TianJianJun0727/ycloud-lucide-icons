import { getContext, setContext } from 'svelte';

const YCloudContext = Symbol('ycloud-context');

export interface YCloudGlobalContext {
  color?: string;
  size?: number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  class?: string;
}

export const setYCloudIconsProps = (globalProps: YCloudGlobalContext) =>
  setContext(YCloudContext, globalProps);

export const getYCloudContext = () => getContext<YCloudGlobalContext>(YCloudContext);
