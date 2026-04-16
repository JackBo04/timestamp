export type FormatId =
  | 'iso'
  | 'date-cn'
  | 'datetime-cn'
  | 'date-us'
  | 'datetime-us'
  | 'time-us'
  | 'date-eu'
  | 'date-eu-dash'
  | 'datetime-eu'
  | 'unix'
  | 'relative'
  | 'week';

export interface FormatConfig {
  id: FormatId;
  name: string;
  group: string;
  example: string;
  enabled: boolean;
}

export interface PluginSettings {
  formats: FormatConfig[];
  defaultFormat: FormatId;
}

export const DEFAULT_FORMATS: FormatConfig[] = [
  // 中国格式
  { id: 'iso', name: 'ISO 8601', group: 'CN', example: '2026-04-16T14:30:00+08:00', enabled: true },
  { id: 'date-cn', name: '日期', group: 'CN', example: '2026-04-16', enabled: true },
  { id: 'datetime-cn', name: '日期时间', group: 'CN', example: '2026年04月16日 14:30', enabled: true },
  // 美国格式
  { id: 'date-us', name: '日期 (US)', group: 'US', example: '04/16/2026', enabled: false },
  { id: 'datetime-us', name: '日期时间 (US)', group: 'US', example: 'Apr 16, 2026 2:30 PM', enabled: false },
  { id: 'time-us', name: '12小时制', group: 'US', example: '2:30 PM', enabled: false },
  // 欧洲格式
  { id: 'date-eu', name: '日期 (EU)', group: 'EU', example: '16/04/2026', enabled: false },
  { id: 'date-eu-dash', name: '日期 (EU-Dash)', group: 'EU', example: '16-04-2026', enabled: false },
  { id: 'datetime-eu', name: '日期时间 (EU)', group: 'EU', example: '16 Apr 2026, 14:30', enabled: false },
  // 通用
  { id: 'unix', name: 'Unix 时间戳', group: '通用', example: '1744793400', enabled: false },
  { id: 'relative', name: '相对时间', group: '通用', example: '3分钟后', enabled: false },
  { id: 'week', name: '周数', group: '通用', example: 'W16-04', enabled: false },
];

export const DEFAULT_SETTINGS: PluginSettings = {
  formats: DEFAULT_FORMATS.map(f => ({ ...f })),
  defaultFormat: 'datetime-cn',
};

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_CN = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function formatTimestamp(date: Date, formatId: FormatId): string {
  switch (formatId) {
    case 'iso':
      return date.toISOString();

    case 'date-cn':
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    case 'datetime-cn': {
      const y = date.getFullYear();
      const m = pad(date.getMonth() + 1);
      const d = pad(date.getDate());
      const h = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${y}年${m}月${d}日 ${h}:${min}`;
    }

    case 'date-us':
      return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;

    case 'datetime-us': {
      const month = MONTHS_SHORT[date.getMonth()];
      const d = pad(date.getDate());
      const y = date.getFullYear();
      const h = date.getHours() % 12 || 12;
      const min = pad(date.getMinutes());
      const ampm = date.getHours() < 12 ? 'AM' : 'PM';
      return `${month} ${d}, ${y} ${h}:${min} ${ampm}`;
    }

    case 'time-us': {
      const h = date.getHours() % 12 || 12;
      const min = pad(date.getMinutes());
      const ampm = date.getHours() < 12 ? 'AM' : 'PM';
      return `${h}:${min} ${ampm}`;
    }

    case 'date-eu':
      return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

    case 'date-eu-dash':
      return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

    case 'datetime-eu': {
      const d = pad(date.getDate());
      const month = MONTHS_SHORT[date.getMonth()];
      const y = date.getFullYear();
      const h = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${d} ${month} ${y}, ${h}:${min}`;
    }

    case 'unix':
      return Math.floor(date.getTime() / 1000).toString();

    case 'relative': {
      const now = new Date();
      const diff = date.getTime() - now.getTime();
      const absDiff = Math.abs(diff);
      const minutes = Math.floor(absDiff / 60000);
      if (minutes < 60) {
        return diff >= 0 ? `${minutes}分钟后` : `${minutes}分钟前`;
      }
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return diff >= 0 ? `${hours}小时后` : `${hours}小时前`;
      }
      const days = Math.floor(hours / 24);
      return diff >= 0 ? `${days}天后` : `${days}天前`;
    }

    case 'week': {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
      const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return `W${pad(weekNum)}-${pad(date.getDay())}`;
    }

    default:
      return date.toISOString();
  }
}
