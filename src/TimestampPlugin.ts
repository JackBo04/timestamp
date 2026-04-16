import { Plugin, PluginSettingTab, Setting, App, Notice } from 'obsidian';
import { formatTimestamp, FormatId, FormatConfig, PluginSettings, DEFAULT_SETTINGS } from './formats';

export default class TimestampPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.buildCommands();
    this.addSettingTab(new TimestampSettingTab(this.app, this));
  }

  buildCommands(): void {
    // Clear old commands by reloading
    this.commands = {};

    this.settings.formats.forEach(format => {
      this.addCommand({
        id: `insert-${format.id}`,
        name: `插入 ${format.name}`,
        callback: () => this.insertTimestamp(format.id),
      });
    });

    this.addCommand({
      id: 'insert-default',
      name: '插入默认格式时间戳',
      callback: () => this.insertTimestamp(this.settings.defaultFormat),
    });
  }

  async loadSettings(): Promise<void> {
    const loaded = await this.loadData();
    if (loaded) {
      this.settings = {
        ...DEFAULT_SETTINGS,
        ...loaded,
        formats: DEFAULT_SETTINGS.formats.map((f, i) => ({
          ...f,
          enabled: loaded.formats?.[i]?.enabled ?? f.enabled,
        })),
      };
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.buildCommands();
  }

  insertTimestamp(formatId: FormatId): void {
    // @ts-ignore
    const editor = this.app.workspace.activeLeaf?.view?.editor;
    if (!editor) {
      new Notice('无法获取编辑器');
      return;
    }
    const timestamp = formatTimestamp(new Date(), formatId);
    editor.replaceRange(timestamp, editor.getCursor());
  }
}

class TimestampSettingTab extends PluginSettingTab {
  plugin: TimestampPlugin;

  constructor(app: App, plugin: TimestampPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Timestamp' });

    // Default format - only show enabled formats
    new Setting(containerEl)
      .setName('默认格式')
      .setDesc('按下快捷键时插入的格式')
      .addDropdown(dropdown => {
        this.plugin.settings.formats
          .filter(f => f.enabled)
          .forEach(f => dropdown.addOption(f.id, `${f.name} (${f.group})`));
        dropdown.setValue(this.plugin.settings.defaultFormat);
        dropdown.onChange(value => {
          this.plugin.settings.defaultFormat = value as FormatId;
          this.plugin.saveSettings();
        });
      });

    // Group formats by region
    const groups = ['CN', 'US', 'EU', '通用'];
    groups.forEach(group => {
      const formats = this.plugin.settings.formats.filter(f => f.group === group);
      if (formats.length === 0) return;

      containerEl.createEl('h3', { text: group }).style.marginTop = '16px';

      formats.forEach((format, idx) => {
        const arr = this.plugin.settings.formats;
        const realIdx = arr.findIndex(f => f.id === format.id);
        const tab = this;

        new Setting(containerEl)
          .setName(format.name)
          .setDesc(format.example)
          .addToggle(toggle => {
            toggle.setValue(format.enabled);
            toggle.onChange(value => {
              tab.plugin.settings.formats[realIdx].enabled = value;
              tab.plugin.saveSettings();
              tab.display();
            });
          });
      });
    });

    // Hotkey hint
    const hint = containerEl.createEl('div');
    hint.style.color = 'var(--text-muted)';
    hint.style.fontSize = '0.9em';
    hint.style.marginTop = '20px';
    hint.innerHTML = '💡 为不同格式设置快捷键：设置 → 快捷键 → 搜索 "timestamp"<br>每个启用的格式都可以单独绑定快捷键';
  }
}
