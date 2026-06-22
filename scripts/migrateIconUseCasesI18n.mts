/**
 * 迁移旧版 use-cases 元数据到当前双语结构。
 *
 * 输入：直接运行时全量读取 `icons/*.json`；也导出 `migrateIconUseCases` 供脚本复用。
 * 迁移规则：
 * - 优先把旧的 `i18n.en.use-cases` 作为英文来源。
 * - 如果旧英文不存在，则从顶层 `use-cases` 中挑出不含中文的英文条目作为来源。
 * - 顶层 `use-cases` 写入中文使用场景；`i18n.en.use-cases` 写入英文使用场景。
 * - 使用内置翻译表处理已知历史文案，未知文案原样保留，后续再交给 AI 修复脚本润色。
 * - 输出时会去重英文来源，避免迁移后出现重复使用场景。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type IconMetadata = {
  $schema?: string;
  'use-cases'?: string[];
  name?: string;
  tags?: string[];
  categories?: string[];
  i18n?: {
    en?: {
      name?: string;
      tags?: string[];
      'use-cases'?: string[];
    };
  };
  [key: string]: unknown;
};

type MigrationOptions = {
  translateUseCase?: (value: string) => string;
};

const useCaseTranslations: Record<string, string> = {
  'Indicates that a service or maintenance mode is disabled': '表示服务或维护模式已禁用',
  'Indicates that playback is disabled for video, live stream, or audio file':
    '表示视频、直播或音频文件已禁用播放',
  'Indicates that video, live stream, or audio file cannot be played.':
    '表示视频、直播或音频文件无法播放',
  'Indicating that privacy mode is activated': '表示隐私模式已开启',
  'Marking hidden content that can be revealed on interaction': '标记可通过交互显示的隐藏内容',
  'Offering an accessibility option for visual impairments': '提供面向视觉障碍的无障碍选项',
  'Representing a stealth mode running discreetly in the background':
    '表示在后台低调运行的隐身模式',
  'Showing that notifications are muted or do-not-disturb is on': '表示通知已静音或勿扰模式已开启',
  'Used on a button or toggle to turn service/maintenance mode off':
    '用于关闭服务或维护模式的按钮或开关',
  'add bookmark': '添加书签',
  'add featured item': '添加精选项目',
  'add recommendation': '添加推荐项',
  'add to favorites': '添加到收藏',
  'add to saved items': '添加到已保存项目',
  'adding a tag to an item': '为项目添加标签',
  'adding a database connection in a client or admin panel': '在客户端或管理面板中添加数据库连接',
  'approved item': '已批准项目',
  'approved review': '已批准评价',
  'assign timing information': '分配时间信息',
  'assigning a task to the current user': '将任务分配给当前用户',
  'certified item': '已认证项目',
  'completed achievement': '已完成成就',
  'Denoting an inactive or away user status': '表示用户处于非活跃或离开状态',
  'confirm a paid product': '确认付费产品',
  'confirm a payment method was added successfully': '确认付款方式已成功添加',
  'confirmed selection': '已确认选择',
  'confirming backup integrity or successful sync': '确认备份完整性或同步成功',
  'creating a new database instance': '创建新的数据库实例',
  'creating a new item by saving the current work': '通过保存当前工作创建新项目',
  'creating a new product or entry with a tag': '创建带标签的新产品或条目',
  'deleting or detaching a database connection': '删除或分离数据库连接',
  'deleting a labeled product or entry': '删除带标签的产品或条目',
  'deselect favorite': '取消收藏选择',
  'dismiss saved item': '移除已保存项目',
  'disallow recommendation': '禁止推荐',
  'display top winners after a game or competition': '展示游戏或比赛后的优胜者',
  'displaying error states in monitoring tools': '在监控工具中显示错误状态',
  'exporting or downloading data from a database': '从数据库导出或下载数据',
  'exporting or saving a copy of the current document with a different name or format':
    '以不同名称或格式导出或保存当前文档副本',
  'exclude item': '排除项目',
  'featured content': '精选内容',
  'follow preferred content': '关注偏好内容',
  'formatting text size': '设置文本字号',
  'importing or uploading data into a database': '向数据库导入或上传数据',
  'indicate injury or fracture status in health/fitness tracking':
    '在健康或健身追踪中表示受伤或骨折状态',
  'indicates that autosave is active': '表示自动保存已开启',
  'indicates that file/document has been saved automatically': '表示文件或文档已自动保存',
  'indicating AI-assisted writing or editing features': '表示 AI 辅助写作或编辑功能',
  'indicating a failed or lost database connection': '表示数据库连接失败或丢失',
  'indicating a heading and body text': '表示标题和正文文本',
  'indicating a large and small text size': '表示大号和小号文本',
  'indicating a successful database connection': '表示数据库连接成功',
  'indicating a disabled webcam': '表示摄像头已禁用',
  'indicating an inbound user request': '表示传入的用户请求',
  'indicating that a webcam is disabled or turned off': '表示摄像头已禁用或关闭',
  'indicating the end of a time range': '表示时间范围的结束',
  'indicating the start of a time range': '表示时间范围的开始',
  'linking to an advertise with us page': '链接到广告合作页面',
  'lower priority item': '降低项目优先级',
  'mark as favorite': '标记为收藏',
  'marking a message as directed to me': '标记消息指向我',
  'marking content as sponsored': '标记内容为赞助内容',
  "navigating to the user's profile": '导航到用户资料页',
  'open time settings': '打开时间设置',
  'prioritize item': '提升项目优先级',
  'pushing local data to a remote database': '将本地数据推送到远程数据库',
  'recommended item': '推荐项目',
  'reducing allocated database resources': '减少已分配的数据库资源',
  'reject favorite': '拒绝收藏项',
  'remove bookmark': '移除书签',
  'remove featured item': '移除精选项目',
  'remove featured status': '移除精选状态',
  'remove from favorites': '从收藏中移除',
  'remove recommendation': '移除推荐项',
  'remove saved item': '移除已保存项目',
  'remove saved items': '移除已保存项目',
  'removing a database instance': '移除数据库实例',
  'removing a tag from an item': '从项目中移除标签',
  'reordering a list in ascending order': '按升序重新排列列表',
  'reordering a list in descending order': '按降序重新排列列表',
  'representing automated writing or content generation tools': '表示自动写作或内容生成工具',
  'representing rejected queries or destructive operations': '表示被拒绝的查询或破坏性操作',
  'restoring from a backup': '从备份恢复',
  'save item': '保存项目',
  'saving a file with a specific name and/or to a specific location': '以指定名称或位置保存文件',
  'saving a new copy of a file or document': '保存文件或文档的新副本',
  'setting the current user as recipient': '将当前用户设为接收人',
  'show an error or failed state in healthcare UI flows': '在医疗 UI 流程中显示错误或失败状态',
  'show rankings or leaderboards': '展示排名或排行榜',
  'showing a camera feed is unavailable or blocked for privacy':
    '表示摄像头画面不可用或因隐私被阻止',
  'showing a verified or healthy database instance': '显示已验证或健康的数据库实例',
  'sorting items in a table by column (name, date, price, status)':
    '按表格列对项目排序（名称、日期、价格、状态）',
  'star item': '星标项目',
  'summarizing articles': '总结文章',
  'summarizing long email threads': '总结较长的邮件会话',
  'summarizing with ai': '使用 AI 生成摘要',
  'syncing data from a remote to a local environment': '将数据从远程同步到本地环境',
  'trusted content': '可信内容',
  'block preferred content': '屏蔽偏好内容',
  'clear favorite selection': '清除收藏选择',
  'turning meeting transcripts into summaries': '将会议转录内容转换为摘要',
  'unassign timing information': '取消分配时间信息',
  'unstar item': '取消星标项目',
  'verified bookmark': '已验证书签',
  'verified favorite': '已验证收藏',
};

function uniqueStrings(values: string[]) {
  return [...new Set(values)];
}

function hasCjk(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

export function translateUseCase(value: string) {
  return useCaseTranslations[value] ?? value;
}

export function migrateIconUseCases(
  metadata: IconMetadata,
  { translateUseCase: translate = translateUseCase }: MigrationOptions = {},
) {
  const existingEnglishUseCases = metadata.i18n?.en?.['use-cases'] ?? [];
  const englishUseCases = uniqueStrings(
    (existingEnglishUseCases.length > 0
      ? existingEnglishUseCases
      : metadata['use-cases'] ?? []
    ).filter((value) => !hasCjk(value)),
  );
  const chineseUseCases = englishUseCases.map((value) => translate(value));

  return {
    ...metadata,
    'use-cases': chineseUseCases,
    i18n: {
      ...metadata.i18n,
      en: {
        ...metadata.i18n?.en,
        'use-cases': englishUseCases,
      },
    },
  };
}

async function migrateAllIcons() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const iconsDir = path.resolve(currentDir, '../icons');
  const files = (await fs.readdir(iconsDir)).filter((file) => file.endsWith('.json')).sort();

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(iconsDir, file);
      const metadata = JSON.parse(await fs.readFile(filePath, 'utf-8')) as IconMetadata;
      const migrated = migrateIconUseCases(metadata);
      await fs.writeFile(filePath, `${JSON.stringify(migrated, null, 2)}\n`, 'utf-8');
    }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await migrateAllIcons();
}
