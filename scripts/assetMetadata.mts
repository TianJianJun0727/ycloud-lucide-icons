import fs from 'node:fs/promises';
import path from 'node:path';

export type AssetKind = 'business-icon' | 'illustration';

export type AssetMetadata = {
  $schema: string;
  name: string;
  tags: string[];
  'use-cases': string[];
  i18n: {
    en: {
      name: string;
      tags: string[];
      'use-cases': string[];
    };
  };
};

const BUSINESS_ICON_LABEL_BY_COLOR_MODE: Record<string, { zh: string; en: string }> = {
  mono: { zh: '单色业务图标', en: 'mono business icon' },
  duotone: { zh: '双色业务图标', en: 'duotone business icon' },
  multicolor: { zh: '多色业务图标', en: 'multicolor business icon' },
};

const BUSINESS_TERM_ZH: Record<string, string> = {
  account: '账号',
  add: '添加',
  agent: '客服坐席',
  analytics: '分析',
  api: 'API',
  billing: '账单',
  bot: '机器人',
  business: '业务',
  call: '通话',
  campaign: '营销活动',
  category: '分类',
  chat: '聊天',
  check: '检查',
  code: '代码',
  contact: '联系人',
  coupon: '优惠券',
  customer: '客户',
  data: '数据',
  doc: '文档',
  document: '文档',
  empty: '空状态',
  event: '事件',
  export: '导出',
  filled: '填充',
  filter: '筛选',
  flow: '流程',
  global: '全球',
  guide: '引导',
  hub: 'HubSpot',
  icon: '图标',
  import: '导入',
  journey: '旅程',
  language: '语言',
  link: '链接',
  location: '位置',
  menu: '菜单',
  message: '消息',
  meta: 'Meta',
  more: '更多',
  note: '备注',
  order: '订单',
  outlined: '描边',
  payment: '支付',
  payments: '支付',
  permission: '权限',
  phone: '电话',
  qr: '二维码',
  record: '记录',
  reply: '回复',
  route: '路径',
  search: '搜索',
  security: '安全',
  segment: '分群',
  send: '发送',
  setting: '设置',
  shop: '店铺',
  shopify: 'Shopify',
  spot: '',
  status: '状态',
  sync: '同步',
  tag: '标签',
  tags: '标签',
  task: '任务',
  team: '团队',
  template: '模板',
  ticket: '工单',
  tickets: '工单',
  time: '时间',
  tool: '工具',
  trigger: '触发器',
  trophy: '奖杯',
  user: '用户',
  whatsapp: 'WhatsApp',
  widgets: '组件',
};

const ILLUSTRATION_PRESETS: Record<
  string,
  {
    name: string;
    tags: string[];
    useCases: string[];
    englishName: string;
    englishTags: string[];
    englishUseCases: string[];
  }
> = {
  'account-unbound': {
    name: '账号未绑定',
    tags: ['账号未绑定', '解绑', '未连接', '账户异常'],
    useCases: ['账号绑定状态为空或失效', '引导用户绑定账号'],
    englishName: 'account unbound',
    englishTags: ['account unbound', 'account', 'unbound'],
    englishUseCases: ['Account binding is missing or invalid', 'Guide users to bind an account'],
  },
  'data-importing': {
    name: '数据导入中',
    tags: ['数据导入', '导入中', '处理中', '同步中'],
    useCases: ['数据正在导入时的页面占位', '导入流程等待状态'],
    englishName: 'data importing',
    englishTags: ['data importing', 'data', 'importing'],
    englishUseCases: [
      'Page placeholder while data is importing',
      'Waiting state during import flow',
    ],
  },
  'empty-list': {
    name: '空列表',
    tags: ['空列表', '暂无数据', '列表为空', '无内容'],
    useCases: ['列表或表格无数据', '筛选后没有可展示内容'],
    englishName: 'empty list',
    englishTags: ['empty list', 'empty', 'list'],
    englishUseCases: ['Empty list or table', 'No content after filtering'],
  },
  'empty-orders': {
    name: '空订单',
    tags: ['空订单', '暂无订单', '订单为空'],
    useCases: ['订单列表为空', '商店还没有订单数据'],
    englishName: 'empty orders',
    englishTags: ['empty orders', 'empty', 'orders'],
    englishUseCases: ['Empty order list', 'Store has no order data'],
  },
  'empty-page': {
    name: '空页面',
    tags: ['空页面', '占位页', '暂无内容'],
    useCases: ['页面内容为空', '模块暂未配置内容'],
    englishName: 'empty page',
    englishTags: ['empty page', 'empty', 'page'],
    englishUseCases: ['Empty page content', 'Module has no configured content'],
  },
  'empty-search': {
    name: '搜索无结果',
    tags: ['搜索无结果', '未找到', '空搜索'],
    useCases: ['搜索或筛选没有结果', '提示用户调整搜索条件'],
    englishName: 'empty search',
    englishTags: ['empty search', 'empty', 'search'],
    englishUseCases: ['No search or filter results', 'Prompt users to adjust search criteria'],
  },
  'load-failed': {
    name: '加载失败',
    tags: ['加载失败', '请求失败', '重试'],
    useCases: ['页面或模块加载失败', '提示用户重试'],
    englishName: 'load failed',
    englishTags: ['load failed', 'loading', 'failed', 'retry'],
    englishUseCases: ['Page or module failed to load', 'Prompt users to retry'],
  },
  'network-disconnected': {
    name: '网络断开',
    tags: ['网络断开', '离线', '连接失败'],
    useCases: ['网络连接不可用', '提示用户检查网络'],
    englishName: 'network disconnected',
    englishTags: ['network disconnected', 'offline', 'connection failed'],
    englishUseCases: ['Network connection is unavailable', 'Prompt users to check the network'],
  },
  'no-permission': {
    name: '无权限',
    tags: ['无权限', '权限不足', '访问受限'],
    useCases: ['用户没有访问权限', '权限不足的页面或模块'],
    englishName: 'no permission',
    englishTags: ['no permission', 'permission denied', 'restricted access'],
    englishUseCases: ['User has no access permission', 'Permission-limited page or module'],
  },
  'not-found': {
    name: '未找到',
    tags: ['未找到', '404', '页面不存在'],
    useCases: ['页面或资源不存在', '路由未命中'],
    englishName: 'not found',
    englishTags: ['not found', '404', 'missing page'],
    englishUseCases: ['Page or resource does not exist', 'Unmatched route'],
  },
  'payment-method-disabled': {
    name: '支付方式不可用',
    tags: ['支付方式不可用', '支付禁用', '付款失败'],
    useCases: ['支付方式不可用', '引导用户更换支付方式'],
    englishName: 'payment method disabled',
    englishTags: ['payment method disabled', 'payment', 'disabled'],
    englishUseCases: ['Payment method is unavailable', 'Guide users to change payment method'],
  },
  'waiting-status': {
    name: '等待中',
    tags: ['等待中', '处理中', '排队'],
    useCases: ['流程等待处理', '任务排队或审核中'],
    englishName: 'waiting status',
    englishTags: ['waiting status', 'waiting', 'pending'],
    englishUseCases: ['Process is waiting', 'Task is queued or under review'],
  },
};

export function toWords(name: string) {
  return name.split(/[^a-zA-Z0-9]+/).filter(Boolean);
}

export function toEnglishName(name: string) {
  return toWords(name).join(' ');
}

function unique(items: string[]) {
  return items.filter((item, index, list) => item && list.indexOf(item) === index);
}

function toChineseName(name: string) {
  const words = toWords(name);
  const translated = words.map((word) => BUSINESS_TERM_ZH[word.toLowerCase()] ?? word);
  return unique(translated).join('') || name;
}

export function createAssetMetadata({
  kind,
  name,
  colorMode,
  schemaPath,
}: {
  kind: AssetKind;
  name: string;
  colorMode?: string;
  schemaPath: string;
}): AssetMetadata {
  if (kind === 'illustration') {
    const preset = ILLUSTRATION_PRESETS[name];
    const englishName = preset?.englishName ?? toEnglishName(name);
    const chineseName = preset?.name ?? toChineseName(name);
    return {
      $schema: schemaPath,
      name: chineseName,
      tags: unique([...(preset?.tags ?? [chineseName]), '插画']),
      'use-cases': preset?.useCases ?? [`${chineseName}页面级视觉`, `用于空状态、异常页或引导页`],
      i18n: {
        en: {
          name: englishName,
          tags: unique([
            ...(preset?.englishTags ?? [englishName, ...toWords(name)]),
            'illustration',
          ]),
          'use-cases': preset?.englishUseCases ?? [
            `${englishName} page-level visual`,
            'Empty state, exception page, or onboarding page',
          ],
        },
      },
    };
  }

  const englishName = toEnglishName(name);
  const chineseName = toChineseName(name);
  const colorModeLabel = BUSINESS_ICON_LABEL_BY_COLOR_MODE[colorMode ?? 'mono'] ?? {
    zh: '业务图标',
    en: 'business icon',
  };

  return {
    $schema: schemaPath,
    name: chineseName,
    tags: unique([
      chineseName,
      ...toWords(name).map((word) => BUSINESS_TERM_ZH[word] ?? word),
      colorModeLabel.zh,
      '业务图标',
    ]),
    'use-cases': [`${chineseName}相关入口或状态展示`, `需要兼容历史业务视觉的${chineseName}场景`],
    i18n: {
      en: {
        name: englishName,
        tags: unique([englishName, ...toWords(name), colorModeLabel.en, 'business icon']),
        'use-cases': [
          `${englishName} entry or status`,
          `Legacy business visual for ${englishName} scenarios`,
        ],
      },
    },
  };
}

export async function readAssetMetadata(file: string): Promise<AssetMetadata | undefined> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as AssetMetadata;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

export async function writeAssetMetadata(file: string, metadata: AssetMetadata) {
  await fs.writeFile(file, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
}

export function metadataPathForSvg(svgPath: string) {
  return svgPath.replace(/\.svg$/, '.json');
}
