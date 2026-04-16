# Obsidian Timestamp Plugin

一个简洁的时间戳插件，支持按地区分组的时间格式，一键插入。

一个简洁的时间戳插件，支持按地区分组的时间格式，一键插入。

---

## English | [中文](#中文)

### Features

- **Grouped by region**: China (CN), US, Europe (EU), and General formats
- **One-key insertion**: Set a default format and press a hotkey to insert
- **Individual hotkeys**: Each format can be bound to its own hotkey

### Supported Formats

| Group | Format | Example |
|-------|--------|---------|
| CN | ISO 8601 | `2026-04-16T14:30:00+08:00` |
| CN | Date | `2026-04-16` |
| CN | DateTime | `2026年04月16日 14:30` |
| US | Date (US) | `04/16/2026` |
| US | DateTime (US) | `Apr 16, 2026 2:30 PM` |
| US | 12-hour time | `2:30 PM` |
| EU | Date (EU) | `16/04/2026` |
| EU | Date (EU-Dash) | `16-04-2026` |
| EU | DateTime (EU) | `16 Apr 2026, 14:30` |
| General | Unix timestamp | `1744793400` |
| General | Relative time | `3 minutes later` |
| General | Week number | `W16-04` |

### Usage

1. Enable community plugins in Obsidian Settings
2. Search for "Timestamp" and install
3. Open plugin settings and enable the formats you need
4. Settings → Hotkeys → Search "timestamp" to bind hotkeys
5. Press the hotkey in any note to insert the timestamp

### Hotkey Examples

- `Ctrl+Shift+D` → Insert default format
- `Ctrl+Shift+1` → Insert Date (CN)
- `Ctrl+Shift+2` → Insert Date (US)

---

## 中文

### 功能

- **按地区分组**：中国 (CN)、美国 (US)、欧洲 (EU)、通用格式
- **一键插入**：设置默认格式后，按快捷键即可插入
- **独立快捷键**：每个格式都可以单独绑定快捷键

### 支持的格式

| 分组 | 格式 | 示例 |
|------|------|------|
| CN | ISO 8601 | `2026-04-16T14:30:00+08:00` |
| CN | 日期 | `2026-04-16` |
| CN | 日期时间 | `2026年04月16日 14:30` |
| US | 日期 (US) | `04/16/2026` |
| US | 日期时间 (US) | `Apr 16, 2026 2:30 PM` |
| US | 12小时制 | `2:30 PM` |
| EU | 日期 (EU) | `16/04/2026` |
| EU | 日期 (EU-Dash) | `16-04-2026` |
| EU | 日期时间 (EU) | `16 Apr 2026, 14:30` |
| 通用 | Unix 时间戳 | `1744793400` |
| 通用 | 相对时间 | `3分钟后` |
| 通用 | 周数 | `W16-04` |

### 使用方法

1. 在 Obsidian 设置中启用社区插件
2. 搜索 "Timestamp" 并安装
3. 打开插件设置，启用你需要的格式
4. 设置 → 快捷键 → 搜索 "timestamp" 为常用格式绑定快捷键
5. 在笔记中按快捷键即可插入时间戳

### 快捷键示例

- `Ctrl+Shift+D` → 插入默认格式
- `Ctrl+Shift+1` → 插入日期 (CN)
- `Ctrl+Shift+2` → 插入日期 (US)

---

## Installation | 安装

### Community Plugin Market (Recommended)
Search for "Timestamp" in Obsidian Settings → Community Plugins

### Manual Installation

```bash
git clone https://github.com/YOUR_USERNAME/obsidian-timestamp.git
cd obsidian-timestamp
npm install
npm run build
```

Copy `manifest.json`, `main.js`, and `styles.css` to your Obsidian plugins folder.

---

## Changelog | 更新日志

### v1.0.0
- Initial release
- 12 time formats grouped by region
- Individual hotkey support for each format

---

## License | 许可证

MIT
