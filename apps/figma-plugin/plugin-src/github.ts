import {
  sanitizeBusinessSvg,
  sanitizeIllustrationSvg,
  sanitizeSvg,
  toKebabCase,
} from '../common/iconRules';
import type { IconSourceType, YCloudIconData, YCloudMetadataOptions } from '../common/types';
const GITHUB_API_VERSION = '2022-11-28';
interface TreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
}

function uniqueList<T>(items: T[]): T[] {
  return items.filter((item, index, list) => list.indexOf(item) === index);
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
  const businessColorMode =
    metadata.businessColorMode === 'multicolor' || metadata.businessCategory === 'multicolor'
      ? 'multicolor'
      : metadata.businessColorMode === 'duotone' || metadata.businessCategory === 'duotone'
        ? 'duotone'
        : 'mono';
  return Object.entries(icons).map(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    return {
      path: `business-icons/${businessColorMode}/${name}.svg`,
      content: sanitizeBusinessSvg(icon.svg, businessColorMode),
    };
  });
}
function buildIllustrationFiles(icons: Record<string, YCloudIconData>) {
  return Object.entries(icons).map(([key, icon]) => {
    const name = toKebabCase(icon.name || key);
    return {
      path: `illustration-icons/${name}.svg`,
      content: sanitizeIllustrationSvg(icon.svg),
    };
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
  ) {
    const baseBranch = 'main';
    const newBranch = `figma-plugin/${Date.now()}`;
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
          ? `本次提交 ${iconCount} 个业务图标，颜色类型为 \`business-icons/${metadata.businessColorMode || 'mono'}/\`。SVG 已按业务规则轻量清洗。`
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
