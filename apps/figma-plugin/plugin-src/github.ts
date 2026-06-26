import { sanitizeBusinessSvg, sanitizeSvg, toKebabCase } from '../common/iconRules';
import type { IconSourceType, YCloudIconData, YCloudMetadataOptions } from '../common/types';
const GITHUB_API_VERSION = '2022-11-28';
interface TreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
}

type GitHubContentFile = {
  content: string;
  encoding: string;
};

type BusinessIconIndex = {
  categories?: string[];
  icons?: Array<{
    name: string;
    category: string;
    path: string;
    componentName: string;
  }>;
};

const BUSINESS_CATEGORY_OPTIONS = [
  'inbox',
  'menu',
  'chatbot',
  'outlined',
  'filled',
  'basic',
  'filter',
];

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

const getBusinessIconComponentName = (name: string) => {
  const pascal = toPascalCase(name);
  if (/^[a-zA-Z_$]/.test(pascal)) {
    return pascal;
  }
  return `Business${pascal}`;
};

function uniqueList<T>(items: T[]): T[] {
  return items.filter((item, index, list) => list.indexOf(item) === index);
}
function createIconJson(
  name: string,
  icon: YCloudIconData,
  metadata: YCloudMetadataOptions,
): Record<string, unknown> {
  const rawNameZh = icon.ycloud?.nameZh?.trim() ?? '';
  const rawNameEn = icon.ycloud?.nameEn?.trim() ?? '';
  const nameZh = rawNameZh;
  const nameEn = rawNameEn;
  const useCasesZh = uniqueList(metadata.useCasesZh ?? []);
  return {
    $schema: '../icon.schema.json',
    'use-cases': useCasesZh,
    name: nameZh,
    tags: uniqueList(metadata.tagsZh),
    categories: uniqueList(metadata.categories),
    i18n: {
      en: {
        name: nameEn,
        tags: [],
        'use-cases': [],
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
        content: `${JSON.stringify(createIconJson(name, icon, metadata), null, 2)}\n`,
      },
    ];
  });
  return iconFiles;
}
function buildBusinessIconFiles(
  icons: Record<string, YCloudIconData>,
  metadata: YCloudMetadataOptions,
) {
  const businessCategory = toKebabCase(metadata.businessCategory || 'uncategorized');
  return Object.entries(icons).map(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    return {
      path: `business-icons/${businessCategory}/${name}.svg`,
      content: sanitizeBusinessSvg(icon.sourceSvg ?? icon.svg),
    };
  });
}

function buildBusinessIconIndexFile(
  icons: Record<string, YCloudIconData>,
  metadata: YCloudMetadataOptions,
  existingIndex: BusinessIconIndex,
) {
  const businessCategory = toKebabCase(metadata.businessCategory || 'uncategorized');
  const nextIconByName = new Map<string, NonNullable<BusinessIconIndex['icons']>[number]>();

  for (const icon of existingIndex.icons ?? []) {
    nextIconByName.set(icon.name, icon);
  }

  for (const [key, icon] of Object.entries(icons)) {
    const name = toKebabCase(icon.name || key);
    nextIconByName.set(name, {
      name,
      category: businessCategory,
      path: `business-icons/${businessCategory}/${name}.svg`,
      componentName: getBusinessIconComponentName(name),
    });
  }

  const nextIndex: BusinessIconIndex = {
    categories: BUSINESS_CATEGORY_OPTIONS,
    icons: Array.from(nextIconByName.values()).sort((left, right) =>
      left.path.localeCompare(right.path),
    ),
  };

  return {
    path: 'business-icons/index.json',
    content: `${JSON.stringify(nextIndex, null, 2)}\n`,
  };
}
function buildReviewNotes(icons: Record<string, YCloudIconData>) {
  const notes: string[] = [];
  Object.entries(icons).forEach(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    if (!icon.ycloud?.nameZh || !icon.ycloud?.nameEn) {
      notes.push(`- 图标 \`${name}\` 缺少完整中英文名称，建议审核时补齐。`);
    }
  });
  return notes;
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
  async function getTextFile(path: string, branch: string) {
    const response = await fetch(`${API_URL}/contents/${path}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
        Accept: 'application/vnd.github+json',
      },
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`GitHub 请求失败：${response.status} ${response.statusText}`);
    }
    const file = (await response.json()) as GitHubContentFile;
    return atob(file.content.replace(/\s/g, ''));
  }
  async function createDeployPR(
    icons: Record<string, YCloudIconData>,
    metadata: YCloudMetadataOptions,
    sourceType: IconSourceType,
  ) {
    const baseBranch = 'main';
    const newBranch = `figma-plugin/${Date.now()}`;
    const existingBusinessIconIndex =
      sourceType === 'business'
        ? JSON.parse((await getTextFile('business-icons/index.json', baseBranch)) ?? '{"icons":[]}')
        : undefined;
    const files =
      sourceType === 'business'
        ? [
            ...buildBusinessIconFiles(icons, metadata),
            buildBusinessIconIndexFile(icons, metadata, existingBusinessIconIndex ?? {}),
          ]
        : buildYCloudFiles(icons, metadata);
    const reviewNotes = sourceType === 'business' ? [] : buildReviewNotes(icons);
    const iconCount = Object.keys(icons).length;
    const commitTitle =
      iconCount === 1
        ? `feat(${sourceType === 'business' ? 'business-icons' : 'icons'}): add ${Object.keys(icons)[0]}`
        : `feat(${sourceType === 'business' ? 'business-icons' : 'icons'}): add ${iconCount} icons`;
    const head = await getHead(baseBranch);
    const baseCommit = await getCommit(head.object.sha);
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
          ? `本次提交 ${iconCount} 个业务图标，分类目录为 \`business-icons/${toKebabCase(metadata.businessCategory)}/\`。SVG 已按业务规则轻量清洗。`
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
