// Navigation configuration for Next.js App Router

export type Tab =
  // Main navigation
  | 'chat'
  | 'home'
  | 'statistics'
  | 'docs'
  | 'ai-assistant'
  // AI Assistant sub-pages
  | 'marketing'
  | 'data-processing'
  | 'market-analysis'
  | 'customer-service'
  | 'brand-management'
  | 'sentiment-monitor'
  // Configuration pages
  | 'channels'
  | 'instances'
  | 'sessions'
  | 'skills'
  | 'config'
  | 'logs';

export const TAB_PATHS: Record<Tab, string> = {
  // Main navigation
  chat: '/chat',
  home: '/home',
  statistics: '/statistics',
  docs: '/docs',
  'ai-assistant': '/ai-assistant',
  // AI Assistant sub-pages
  marketing: '/marketing',
  'data-processing': '/data-processing',
  'market-analysis': '/market-analysis',
  'customer-service': '/customer-service',
  'brand-management': '/brand-management',
  'sentiment-monitor': '/sentiment-monitor',
  // Configuration pages
  channels: '/channels',
  instances: '/instances',
  sessions: '/sessions',
  skills: '/skills',
  config: '/config',
  logs: '/logs',
};

export const TAB_GROUPS = [
  {
    label: '',
    tabs: ['chat', 'home'],
  },
  {
    label: '',
    tabs: ['statistics'],
  },
  {
    label: '',
    tabs: ['docs'],
  },
  {
    label: 'AI助理',
    tabs: [
      'marketing',
      'data-processing',
      'market-analysis',
      'customer-service',
      'brand-management',
      'sentiment-monitor',
    ],
    subtabs: true,
  },
  {
    label: '配置',
    tabs: ['config', 'channels', 'instances', 'sessions', 'skills', 'logs'],
    subtabs: true,
    collapsed: true,
  },
] as const;

export type TabGroup = typeof TAB_GROUPS[number];

export function pathForTab(tab: Tab): string {
  return TAB_PATHS[tab];
}

export function tabFromPath(pathname: string): Tab | null {
  const normalizedPath = pathname.toLowerCase();
  for (const [tab, path] of Object.entries(TAB_PATHS)) {
    if (normalizedPath === path) {
      return tab as Tab;
    }
  }
  // Default to chat if at root
  if (normalizedPath === '/' || normalizedPath === '') {
    return 'chat';
  }
  return null;
}

export function titleForTab(tab: Tab): string {
  switch (tab) {
    // Main navigation
    case 'chat':
      return '聊天';
    case 'home':
      return '首页';
    case 'statistics':
      return '统计';
    case 'docs':
      return '文档';
    case 'ai-assistant':
      return 'AI助理';
    // AI Assistant sub-pages
    case 'marketing':
      return '营销';
    case 'data-processing':
      return '数据处理';
    case 'market-analysis':
      return '市场分析';
    case 'customer-service':
      return '客户服务';
    case 'brand-management':
      return '品牌管理';
    case 'sentiment-monitor':
      return '舆情监控';
    // Configuration pages
    case 'channels':
      return '频道';
    case 'instances':
      return '实例';
    case 'sessions':
      return '会话';
    case 'skills':
      return '技能';
    case 'config':
      return '配置';
    case 'logs':
      return '日志';
    default:
      return '控制';
  }
}

export function subtitleForTab(tab: Tab): string {
  switch (tab) {
    // Main navigation
    case 'home':
      return '欢迎回来，这里是您的工作空间';
    case 'statistics':
      return '消息统计和工具调用分析';
    case 'docs':
      return '查看完整的使用文档和 API 参考';
    case 'ai-assistant':
      return '选择专业的 AI 助手来帮助您';
    // AI Assistant sub-pages
    case 'marketing':
      return '营销活动策划、内容生成和效果分析';
    case 'data-processing':
      return '数据处理、清洗和转换工具';
    case 'market-analysis':
      return '市场趋势分析和竞争情报';
    case 'customer-service':
      return '客户支持和问题解决方案';
    case 'brand-management':
      return '品牌策略和形象管理';
    case 'sentiment-monitor':
      return '舆情监测和声誉管理';
    // Configuration pages
    case 'channels':
      return '管理频道和相关设置';
    case 'instances':
      return '已连接客户端和节点的状态信标';
    case 'sessions':
      return '检查活动会话并调整会话默认值';
    case 'skills':
      return '管理技能可用性和 API 密钥注入';
    case 'config':
      return '安全编辑 ~/.openclaw/openclaw.json';
    case 'logs':
      return '实时查看网关文件日志';
    case 'chat':
      return '与 AI 助手进行对话';
    default:
      return '';
  }
}
