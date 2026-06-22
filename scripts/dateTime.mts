/**
 * 提供发布流程使用的日期时间格式化工具。
 *
 * 输入：ISO 日期时间字符串。
 * 输出：`Asia/Shanghai` 时区下的 `YYYY-MM-DD HH:mm:ss` 格式。
 *
 * 适用场景：生成 changelog、GitHub Release notes 和文档侧边栏时保持发布日期展示一致。
 */
export function formatShanghaiDateTime(isoDateTime: string) {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(new Date(isoDateTime))
    .reduce<Record<string, string>>((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} (UTC+08:00)`;
}
