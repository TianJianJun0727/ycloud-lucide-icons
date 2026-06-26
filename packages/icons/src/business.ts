export interface BusinessIconDefinition {
  name: string;
  svg: string;
  dataUri: string;
}

export const businessIconNames = [] as const;
export type BusinessIconName = (typeof businessIconNames)[number];

export const businessIcons = {} as const satisfies Record<string, BusinessIconDefinition>;

export function getBusinessIcon(name: BusinessIconName) {
  return businessIcons[name];
}
