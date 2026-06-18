import { provide, inject } from 'vue';

export const YCLOUD_CONTEXT = Symbol('ycloud-icons');

interface YCloudIconsContext {
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  class?: string;
}

export function setYCloudIconsProps(props: YCloudIconsContext) {
  return provide(YCLOUD_CONTEXT, props);
}

export function useYCloudIconsProps() {
  return inject<YCloudIconsContext>(YCLOUD_CONTEXT, {});
}
