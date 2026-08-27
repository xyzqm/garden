import { PluginSettingTab, Setting, Notice } from "obsidian";

export const DEFAULT_SETTINGS = {
  environments: ["problem"],
  markdownEmphasis: true,
  numbering: "per-page",
  pageWidth: "450pt",
  fontSize: "12pt",
  extraPreamble: "",
};

export class ProblemsetSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Environments")
      .setDesc("Changing this requires reloading the plugin (processors are registered at load time)")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.environments.join(", "))
          .onChange(async (value) => {
            this.plugin.settings.environments = value
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s);
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Markdown emphasis")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.markdownEmphasis)
          .onChange(async (value) => {
            this.plugin.settings.markdownEmphasis = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Numbering")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("per-page", "per-page")
          .addOption("off", "off")
          .setValue(this.plugin.settings.numbering)
          .onChange(async (value) => {
            this.plugin.settings.numbering = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Page width")
      .setDesc("Fallback width used when container width cannot be measured")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.pageWidth)
          .onChange(async (value) => {
            this.plugin.settings.pageWidth = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Font size")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.fontSize)
          .onChange(async (value) => {
            this.plugin.settings.fontSize = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Extra preamble")
      .addTextArea((textarea) =>
        textarea
          .setValue(this.plugin.settings.extraPreamble)
          .onChange(async (value) => {
            this.plugin.settings.extraPreamble = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl).addButton((button) =>
      button.setButtonText("Clear render cache").onClick(async () => {
        await this.plugin.clearCaches();
        new Notice("problemset: render cache cleared");
      }),
    );
  }
}
