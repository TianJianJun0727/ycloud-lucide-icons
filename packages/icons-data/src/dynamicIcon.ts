import dynamicIconImports from './dynamicIconImports';

export type YCloudIconName = keyof typeof dynamicIconImports;

/**
 * The list of available YCloud icon names.
 */
export const ycloudIconNames = Object.keys(dynamicIconImports) as Array<YCloudIconName>;
