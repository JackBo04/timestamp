import { Plugin, PluginSettingTab, Setting, App, Notice } from 'obsidian';
import { formatTimestamp, FormatId, PluginSettings, DEFAULT_SETTINGS } from './formats';

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
    // Use getActiveViewOfType to get the active markdown view
    // @ts-ignore - editor property exists on MarkdownView but not in type definitions
    const view = this.app.workspace.getActiveViewOfType(
      // @ts-ignore - View constructor not exposed in types
      this.app.workspace.activeLeaf?.view?.constructor
    );
    const editor = view?.editor;
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

    new Setting(containerEl).setName('Timestamp').setHeading();

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
          void this.plugin.saveSettings();
        });
      });

    // Group formats by region
    const groups = ['CN', 'US', 'EU', '通用'];
    groups.forEach(group => {
      const formats = this.plugin.settings.formats.filter(f => f.group === group);
      if (formats.length === 0) return;

      new Setting(containerEl).setName(group).setHeading();

      formats.forEach((format) => {
        const arr = this.plugin.settings.formats;
        const realIdx = arr.findIndex(f => f.id === format.id);

        new Setting(containerEl)
          .setName(format.name)
          .setDesc(format.example)
          .addToggle(toggle => {
            toggle.setValue(format.enabled);
            toggle.onChange(value => {
              this.plugin.settings.formats[realIdx].enabled = value;
              void this.plugin.saveSettings();
              this.display();
            });
          });
      });
    });

    // Hotkey hint
    new Setting(containerEl)
      .setName('💡 提示')
      .setDesc('为不同格式设置快捷键：设置 → 快捷键 → 搜索 "timestamp"\n每个启用的格式都可以单独绑定快捷键');
  }
}
