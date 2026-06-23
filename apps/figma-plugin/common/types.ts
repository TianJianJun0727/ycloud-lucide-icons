type Base64Data = string;
export interface ExportedIconData {
  name: string;
  svg: string;
  png: {
    '1x': Base64Data | null;
    '2x': Base64Data | null;
    '3x': Base64Data | null;
    '4x': Base64Data | null;
  };
  metadatas?: string[];
  figma?: {
    key?: string;
    name?: string;
    description?: string;
  };
}
export interface GithubData {
  owner: string;
  name: string;
  apiKey: string;
}
export interface ExportOptions {
  png: PngOptionPayload;
  fileName: string;
  ycloud: YCloudMetadataOptions;
}
export interface PngOptionPayload {
  '1x': boolean;
  '2x': boolean;
  '3x': boolean;
  '4x': boolean;
}
export interface YCloudMetadataOptions {
  categories: string[];
  tagsZh: string[];
  useCasesZh: string[];
}
export interface YCloudIconData extends ExportedIconData {
  ycloud?: {
    nameZh: string;
    nameEn: string;
  };
}
