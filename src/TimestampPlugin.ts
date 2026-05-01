import { Plugin, PluginSettingTab, Setting, App, Notice, Editor, EditorPosition } from 'obsidian';
import { formatTimestamp, FormatId, PluginSettings, DEFAULT_SETTINGS } from './formats';

export default class TimestampPlugin extends Plugin {
  settings: PluginSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.registerCommands();
    this.addSettingTab(new TimestampSettingTab(this.app, this));
  }

  registerCommands(): void {
    this.settings.formats.forEach(format => {
      this.addCommand({
        id: `insert-${format.id}`,
        name: `插入 ${format.name}`,
        editorCheckCallback: (checking, editor) => {
          if (!this.isFormatEnabled(format.id)) {
            return false;
          }

          if (!checking) {
            this.insertTimestamp(editor, format.id);
          }

          return true;
        },
      });
    });

    this.addCommand({
      id: 'insert-default',
      name: '插入默认格式时间戳',
      editorCallback: editor => {
        this.insertTimestamp(editor, this.settings.defaultFormat);
      },
    });
  }

  isFormatEnabled(formatId: FormatId): boolean {
    return this.settings.formats.some(format => format.id === formatId && format.enabled);
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

  saveSettings(): void {
    this.saveData(this.settings).catch(error => {
      console.error('Failed to save timestamp settings', error);
      new Notice('保存设置失败');
    });
  }

  insertTimestamp(editor: Editor, formatId: FormatId): void {
    if (!editor) {
      new Notice('无法获取编辑器');
      return;
    }
    const timestamp = formatTimestamp(new Date(), formatId);
    const cursor = editor.getCursor();
    editor.replaceRange(timestamp, cursor);
    editor.setCursor(getCursorAfterInsert(cursor, timestamp));
  }
}

function getCursorAfterInsert(cursor: EditorPosition, insertedText: string): EditorPosition {
  const lines = insertedText.split('\n');
  if (lines.length === 1) {
    return {
      line: cursor.line,
      ch: cursor.ch + insertedText.length,
    };
  }

  return {
    line: cursor.line + lines.length - 1,
    ch: lines[lines.length - 1].length,
  };
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

    new Setting(containerEl).setName('常规').setHeading();

    // Default format - only show enabled formats
    new Setting(containerEl)
      .setName('默认格式')
      .setDesc('按下快捷键时插入的格式')
      .addDropdown(dropdown => {
        this.plugin.settings.formats
          .filter(f => f.enabled)
          .forEach(f => {
            dropdown.addOption(f.id, `${f.name} (${f.group})`);
          });
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
              this.plugin.saveSettings();
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
