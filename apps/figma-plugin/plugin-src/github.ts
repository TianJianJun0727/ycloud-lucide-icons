import {
  sanitizeBusinessSvg,
  sanitizeIllustrationSvg,
  sanitizeSvg,
  toKebabCase,
} from '../common/iconRules';
import type { IconSourceType, YCloudIconData, YCloudMetadataOptions } from '../common/types';
import { Base64 } from 'js-base64';
const GITHUB_API_VERSION = '2022-11-28';
interface TreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
}
interface GitHubTree {
  tree: Array<{
    path: string;
    type: string;
  }>;
  truncated?: boolean;
}
interface GitHubContentFile {
  content: string;
  encoding: string;
}
type IconMetadataIndex = {
  assets?: Array<{
    name?: string;
    metadata?: {
      aliases?: Array<string | { name?: string }>;
    };
  }>;
};

function decodeBase64Json<T>(content: string): T {
  return JSON.parse(Base64.decode(content.replace(/\s/g, ''))) as T;
}

function getBusinessColorMode(metadata: YCloudMetadataOptions) {
  if (metadata.businessColorMode === 'multicolor' || metadata.businessCategory === 'multicolor') {
    return 'multicolor';
  }
  if (metadata.businessColorMode === 'duotone' || metadata.businessCategory === 'duotone') {
    return 'duotone';
  }
  return 'mono';
}

function uniqueList<T>(items: T[]): T[] {
  return items.filter((item, index, list) => list.indexOf(item) === index);
}

function collectIconMetadataNames(index: IconMetadataIndex) {
  return uniqueList(
    (index.assets ?? []).flatMap((asset) => [
      asset.name,
      ...(asset.metadata?.aliases ?? []).map((alias) =>
        typeof alias === 'string' ? alias : alias.name,
      ),
    ]),
  ).filter((name): name is string => typeof name === 'string' && name.length > 0);
}

function createIconJson(metadata: YCloudMetadataOptions): Record<string, unknown> {
  return {
    $schema: '../icon.schema.json',
    'use-cases': [],
    name: '',
    tags: [],
    categories: uniqueList(metadata.categories),
    i18n: {
      en: {
        name: '',
        tags: [],
        'use-cases': [],
      },
    },
  };
}

function toEnglishName(name: string) {
  return name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .join(' ');
}

function createAssetJson(icon: YCloudIconData, fallbackName: string, kind: IconSourceType) {
  const englishName = icon.ycloud?.nameEn || toEnglishName(fallbackName);
  const displayName = icon.ycloud?.nameZh || englishName || fallbackName;
  const typeTag = kind === 'business' ? '业务图标' : '插画';
  const englishTypeTag = kind === 'business' ? 'business icon' : 'illustration';
  return {
    $schema:
      kind === 'business' ? '../../asset-metadata.schema.json' : '../asset-metadata.schema.json',
    name: displayName,
    tags: [displayName, typeTag],
    'use-cases': [`${displayName}相关入口或状态展示`],
    i18n: {
      en: {
        name: englishName,
        tags: [englishName, englishTypeTag],
        'use-cases': [`${englishName} entry or status`],
      },
    },
  };
}
function buildYCloudFiles(icons: Record<string, YCloudIconData>, metadata: YCloudMetadataOptions) {
  const iconFiles = Object.entries(icons).flatMap(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    return [
      {
        path: `icons/${name}.svg`,
        content: sanitizeSvg(icon.svg),
      },
      {
        path: `icons/${name}.json`,
        content: `${JSON.stringify(createIconJson(metadata), null, 2)}\n`,
      },
    ];
  });
  return iconFiles;
}
function buildBusinessIconFiles(
  icons: Record<string, YCloudIconData>,
  metadata: YCloudMetadataOptions,
) {
  const businessColorMode = getBusinessColorMode(metadata);
  return Object.entries(icons).flatMap(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    return [
      {
        path: `business-icons/${businessColorMode}/${name}.svg`,
        content: sanitizeBusinessSvg(icon.svg, businessColorMode),
      },
      {
        path: `business-icons/${businessColorMode}/${name}.json`,
        content: `${JSON.stringify(createAssetJson(icon, name, 'business'), null, 2)}\n`,
      },
    ];
  });
}
function buildIllustrationFiles(icons: Record<string, YCloudIconData>) {
  return Object.entries(icons).flatMap(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    return [
      {
        path: `illustration-icons/${name}.svg`,
        content: sanitizeIllustrationSvg(icon.svg),
      },
      {
        path: `illustration-icons/${name}.json`,
        content: `${JSON.stringify(createAssetJson(icon, name, 'illustration'), null, 2)}\n`,
      },
    ];
  });
}

export function createGithubClient(
  repoOwner: string,
  repoName: string,
  accessToken: string,
  githubBaseUrl?: string,
) {
  const baseUrl = githubBaseUrl || 'https://api.github.com';
  const API_URL = `${baseUrl}/repos/${repoOwner}/${repoName}`;
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
        Accept: 'application/vnd.github+json',
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub 请求失败：${response.status} ${response.statusText}`);
    }
    return response.json();
  }
  async function uploadBlob(content: string): Promise<{
    sha: string;
  }> {
    return request('/git/blobs', {
      method: 'POST',
      body: JSON.stringify({
        content,
        encoding: 'utf-8',
      }),
    });
  }
  async function getHead(branch: string): Promise<{
    object: {
      sha: string;
    };
  }> {
    return request(`/git/ref/heads/${branch}`);
  }
  async function getCommit(sha: string): Promise<{
    tree: {
      sha: string;
    };
  }> {
    return request(`/git/commits/${sha}`);
  }
  async function getTree(treeSha: string): Promise<GitHubTree> {
    return request(`/git/trees/${treeSha}?recursive=1`);
  }
  async function getContent(path: string, ref: string): Promise<GitHubContentFile> {
    return request(`/contents/${path}?ref=${ref}`);
  }
  async function createBranch(name: string, sha: string) {
    return request('/git/refs', {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${name}`,
        sha,
      }),
    });
  }
  async function createTree(body: TreeItem[], baseTree: string) {
    return request<{
      sha: string;
    }>('/git/trees', {
      method: 'POST',
      body: JSON.stringify({
        tree: body,
        base_tree: baseTree,
      }),
    });
  }
  async function createCommit(
    tree: string,
    message: string,
    parents: string[],
  ): Promise<{
    sha: string;
  }> {
    return request('/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        tree,
        message,
        parents,
      }),
    });
  }
  async function createPullRequest(
    head: string,
    base: string,
    title: string,
    body: string,
  ): Promise<{
    html_url: string;
  }> {
    return request('/pulls', {
      method: 'POST',
      body: JSON.stringify({
        head,
        base,
        title,
        body,
      }),
    });
  }
  async function createDeployPR(
    icons: Record<string, YCloudIconData>,
    metadata: YCloudMetadataOptions,
    sourceType: IconSourceType,
    allowExistingIconUpdate = false,
  ) {
    const baseBranch = 'main';
    const newBranch = `figma-plugin/${Date.now()}`;
    const businessColorMode = getBusinessColorMode(metadata);
    const files =
      sourceType === 'business'
        ? buildBusinessIconFiles(icons, metadata)
        : sourceType === 'illustration'
          ? buildIllustrationFiles(icons)
          : buildYCloudFiles(icons, metadata);
    const reviewNotes: string[] = [];
    const iconCount = Object.keys(icons).length;
    const scope =
      sourceType === 'business'
        ? 'business-icons'
        : sourceType === 'illustration'
          ? 'illustration'
          : 'icons';
    const commitTitle =
      iconCount === 1
        ? `feat(${scope}): add ${Object.keys(icons)[0]}`
        : `feat(${scope}): add ${iconCount} icons`;
    const head = await getHead(baseBranch);
    const baseCommit = await getCommit(head.object.sha);
    const [baseTree, iconMetadata] = await Promise.all([
      getTree(baseCommit.tree.sha),
      sourceType === 'generic'
        ? getContent('icons/metadata/index.json', baseBranch).then((file) =>
            decodeBase64Json<IconMetadataIndex>(file.content),
          )
        : Promise.resolve(undefined),
    ]);
    if (baseTree.truncated) {
      throw new Error(
        'GitHub main 分支文件树返回结果被截断，无法安全判断同名覆盖。请稍后重试或手动处理。',
      );
    }
    if (!allowExistingIconUpdate) {
      const existingPaths = new Set(
        baseTree.tree.filter((item) => item.type === 'blob').map((item) => item.path),
      );
      const existingIconNames = new Set(iconMetadata ? collectIconMetadataNames(iconMetadata) : []);
      const conflicts = files
        .filter((file) => existingPaths.has(file.path))
        .map((file) => file.path);
      const aliasConflicts =
        sourceType === 'generic'
          ? files
              .filter((file) => {
                const name = file.path.match(/^icons\/(.+)\.svg$/)?.[1];
                return Boolean(name && existingIconNames.has(name));
              })
              .map((file) => `${file.path}（命中已有图标名称或别名）`)
          : [];
      conflicts.push(...aliasConflicts);
      if (conflicts.length > 0) {
        throw new Error(
          [
            '目标仓库 main 分支已存在同名文件，当前未开启覆盖。',
            '请刷新分类或开启“覆盖已存在图标”后重试。',
            ...conflicts.map((file) => `- ${file}`),
          ].join('\n'),
        );
      }
    }
    const treeBody = await Promise.all(
      files.map(async (file) => {
        const blob = await uploadBlob(file.content);
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        };
      }),
    );
    const tree = await createTree(treeBody, baseCommit.tree.sha);
    const commit = await createCommit(tree.sha, commitTitle, [head.object.sha]);
    await createBranch(newBranch, commit.sha);
    return createPullRequest(
      newBranch,
      baseBranch,
      commitTitle,
      [
        '来源标识：ycloud-icons-source:figma-plugin',
        '由 YCloud 图标同步助手创建。',
        '',
        '来源：Figma 插件',
        '',
        sourceType === 'business'
          ? `本次提交 ${iconCount} 个业务图标，颜色模式为 \`business-icons/${businessColorMode}/\`。SVG 已按业务规则轻量清洗。`
          : sourceType === 'illustration'
            ? `本次提交 ${iconCount} 个插画。SVG 已做安全轻量清洗，并保留原始颜色和尺寸属性。`
            : `本次提交 ${iconCount} 个图标。SVG 已按图标库规范自动清洗。`,
        '',
        '变更文件：',
        ...files.map((file) => `- \`${file.path}\``),
        ...(reviewNotes.length > 0 ? ['', '待补全信息：', ...reviewNotes] : []),
      ].join('\n'),
    );
  }
  return { createDeployPR };
}
