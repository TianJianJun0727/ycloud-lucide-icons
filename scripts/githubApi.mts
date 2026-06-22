/**
 * 轻量 GitHub API 请求封装。
 *
 * 输入：GitHub REST API endpoint。
 * 鉴权：使用 `GITHUB_API_KEY` 作为 Basic Auth 密码。
 * 输出：返回解析后的 JSON。
 *
 * 注意：这是历史脚本的轻量封装，新流程优先使用 GitHub CLI 或 Octokit。
 */
const githubApi = async (endpoint: string) => {
  const headers = new Headers();
  const username = 'ericfennis';
  const password = process.env.GITHUB_API_KEY;

  headers.set(
    'Authorization',
    `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  );

  const res = await fetch(endpoint, {
    method: 'GET',
    headers,
  });

  return res.json();
};

export default githubApi;
