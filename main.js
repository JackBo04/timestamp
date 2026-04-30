"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// src/TimestampPlugin.ts
var import_obsidian = require("obsidian");

// src/formats.ts
var DEFAULT_FORMATS = [
  // 中国格式
  { id: "iso", name: "ISO 8601", group: "CN", example: "2026-04-16T14:30:00+08:00", enabled: true },
  { id: "date-cn", name: "\u65E5\u671F", group: "CN", example: "2026-04-16", enabled: true },
  { id: "datetime-cn", name: "\u65E5\u671F\u65F6\u95F4", group: "CN", example: "2026\u5E7404\u670816\u65E5 14:30", enabled: true },
  // 美国格式
  { id: "date-us", name: "\u65E5\u671F (US)", group: "US", example: "04/16/2026", enabled: false },
  { id: "datetime-us", name: "\u65E5\u671F\u65F6\u95F4 (US)", group: "US", example: "Apr 16, 2026 2:30 PM", enabled: false },
  { id: "time-us", name: "12\u5C0F\u65F6\u5236", group: "US", example: "2:30 PM", enabled: false },
  // 欧洲格式
  { id: "date-eu", name: "\u65E5\u671F (EU)", group: "EU", example: "16/04/2026", enabled: false },
  { id: "date-eu-dash", name: "\u65E5\u671F (EU-Dash)", group: "EU", example: "16-04-2026", enabled: false },
  { id: "datetime-eu", name: "\u65E5\u671F\u65F6\u95F4 (EU)", group: "EU", example: "16 Apr 2026, 14:30", enabled: false },
  // 通用
  { id: "unix", name: "Unix \u65F6\u95F4\u6233", group: "\u901A\u7528", example: "1744793400", enabled: false },
  { id: "relative", name: "\u76F8\u5BF9\u65F6\u95F4", group: "\u901A\u7528", example: "3\u5206\u949F\u540E", enabled: false },
  { id: "week", name: "\u5468\u6570", group: "\u901A\u7528", example: "W16-04", enabled: false }
];
var DEFAULT_SETTINGS = {
  formats: DEFAULT_FORMATS.map((f) => ({ ...f })),
  defaultFormat: "datetime-cn"
};
var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function pad(n) {
  return n.toString().padStart(2, "0");
}
function formatTimestamp(date, formatId) {
  switch (formatId) {
    case "iso":
      return date.toISOString();
    case "date-cn":
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    case "datetime-cn": {
      const y = date.getFullYear();
      const m = pad(date.getMonth() + 1);
      const d = pad(date.getDate());
      const h = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${y}\u5E74${m}\u6708${d}\u65E5 ${h}:${min}`;
    }
    case "date-us":
      return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
    case "datetime-us": {
      const month = MONTHS_SHORT[date.getMonth()];
      const d = pad(date.getDate());
      const y = date.getFullYear();
      const h = date.getHours() % 12 || 12;
      const min = pad(date.getMinutes());
      const ampm = date.getHours() < 12 ? "AM" : "PM";
      return `${month} ${d}, ${y} ${h}:${min} ${ampm}`;
    }
    case "time-us": {
      const h = date.getHours() % 12 || 12;
      const min = pad(date.getMinutes());
      const ampm = date.getHours() < 12 ? "AM" : "PM";
      return `${h}:${min} ${ampm}`;
    }
    case "date-eu":
      return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    case "date-eu-dash":
      return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    case "datetime-eu": {
      const d = pad(date.getDate());
      const month = MONTHS_SHORT[date.getMonth()];
      const y = date.getFullYear();
      const h = pad(date.getHours());
      const min = pad(date.getMinutes());
      return `${d} ${month} ${y}, ${h}:${min}`;
    }
    case "unix":
      return Math.floor(date.getTime() / 1e3).toString();
    case "relative": {
      const now = /* @__PURE__ */ new Date();
      const diff = date.getTime() - now.getTime();
      const absDiff = Math.abs(diff);
      const minutes = Math.floor(absDiff / 6e4);
      if (minutes < 60) {
        return diff >= 0 ? `${minutes}\u5206\u949F\u540E` : `${minutes}\u5206\u949F\u524D`;
      }
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return diff >= 0 ? `${hours}\u5C0F\u65F6\u540E` : `${hours}\u5C0F\u65F6\u524D`;
      }
      const days = Math.floor(hours / 24);
      return diff >= 0 ? `${days}\u5929\u540E` : `${days}\u5929\u524D`;
    }
    case "week": {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / 864e5);
      const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return `W${pad(weekNum)}-${pad(date.getDay())}`;
    }
    default:
      return date.toISOString();
  }
}

// src/TimestampPlugin.ts
var TimestampPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
  }
  async onload() {
    await this.loadSettings();
    this.registerCommands();
    this.addSettingTab(new TimestampSettingTab(this.app, this));
  }
  registerCommands() {
    this.settings.formats.forEach((format) => {
      this.addCommand({
        id: `insert-${format.id}`,
        name: `\u63D2\u5165 ${format.name}`,
        editorCheckCallback: (checking, editor) => {
          if (!this.isFormatEnabled(format.id)) {
            return false;
          }
          if (!checking) {
            this.insertTimestamp(editor, format.id);
          }
          return true;
        }
      });
    });
    this.addCommand({
      id: "insert-default",
      name: "\u63D2\u5165\u9ED8\u8BA4\u683C\u5F0F\u65F6\u95F4\u6233",
      editorCallback: (editor) => this.insertTimestamp(editor, this.settings.defaultFormat)
    });
  }
  isFormatEnabled(formatId) {
    return this.settings.formats.some((format) => format.id === formatId && format.enabled);
  }
  async loadSettings() {
    const loaded = await this.loadData();
    if (loaded) {
      this.settings = {
        ...DEFAULT_SETTINGS,
        ...loaded,
        formats: DEFAULT_SETTINGS.formats.map((f, i) => ({
          ...f,
          enabled: loaded.formats?.[i]?.enabled ?? f.enabled
        }))
      };
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  insertTimestamp(editor, formatId) {
    if (!editor) {
      new import_obsidian.Notice("\u65E0\u6CD5\u83B7\u53D6\u7F16\u8F91\u5668");
      return;
    }
    const timestamp = formatTimestamp(/* @__PURE__ */ new Date(), formatId);
    const cursor = editor.getCursor();
    editor.replaceRange(timestamp, cursor);
    editor.setCursor(getCursorAfterInsert(cursor, timestamp));
  }
};
function getCursorAfterInsert(cursor, insertedText) {
  const lines = insertedText.split("\n");
  if (lines.length === 1) {
    return {
      line: cursor.line,
      ch: cursor.ch + insertedText.length
    };
  }
  return {
    line: cursor.line + lines.length - 1,
    ch: lines[lines.length - 1].length
  };
}
var TimestampSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("\u5E38\u89C4").setHeading();
    new import_obsidian.Setting(containerEl).setName("\u9ED8\u8BA4\u683C\u5F0F").setDesc("\u6309\u4E0B\u5FEB\u6377\u952E\u65F6\u63D2\u5165\u7684\u683C\u5F0F").addDropdown((dropdown) => {
      this.plugin.settings.formats.filter((f) => f.enabled).forEach((f) => dropdown.addOption(f.id, `${f.name} (${f.group})`));
      dropdown.setValue(this.plugin.settings.defaultFormat);
      dropdown.onChange((value) => {
        this.plugin.settings.defaultFormat = value;
        this.saveSettings();
      });
    });
    const groups = ["CN", "US", "EU", "\u901A\u7528"];
    groups.forEach((group) => {
      const formats = this.plugin.settings.formats.filter((f) => f.group === group);
      if (formats.length === 0)
        return;
      new import_obsidian.Setting(containerEl).setName(group).setHeading();
      formats.forEach((format) => {
        const arr = this.plugin.settings.formats;
        const realIdx = arr.findIndex((f) => f.id === format.id);
        new import_obsidian.Setting(containerEl).setName(format.name).setDesc(format.example).addToggle((toggle) => {
          toggle.setValue(format.enabled);
          toggle.onChange((value) => {
            this.plugin.settings.formats[realIdx].enabled = value;
            this.saveSettings();
            this.display();
          });
        });
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u{1F4A1} \u63D0\u793A").setDesc('\u4E3A\u4E0D\u540C\u683C\u5F0F\u8BBE\u7F6E\u5FEB\u6377\u952E\uFF1A\u8BBE\u7F6E \u2192 \u5FEB\u6377\u952E \u2192 \u641C\u7D22 "timestamp"\n\u6BCF\u4E2A\u542F\u7528\u7684\u683C\u5F0F\u90FD\u53EF\u4EE5\u5355\u72EC\u7ED1\u5B9A\u5FEB\u6377\u952E');
  }
  saveSettings() {
    this.plugin.saveSettings().catch((error) => {
      console.error("Failed to save timestamp settings", error);
      new import_obsidian.Notice("\u4FDD\u5B58\u8BBE\u7F6E\u5931\u8D25");
    });
  }
};

// main.ts
var main_default = TimestampPlugin;
//# sourceMappingURL=main.js.map
