import { App, MarkdownView, Plugin, MarkdownPostProcessorContext, PluginSettingTab, Setting } from 'obsidian';

import { Coder } from "./Coder";
import { Base64Encoder, Base64Decoder } from "./Base64";
import { Base85Encoder, Base85Decoder } from "./Base85";
import { TextToBase16Encoder, Base16ToTextDecoder } from "./Base16";
import { Rot13Encoder, Rot13Decoder } from "./Rot13";
import { AtbashEncoder, AtbashDecoder } from "./Atbash";

interface CoderSettings {
	preserveBreaks: boolean;
}

const DEFAULT_SETTINGS: CoderSettings = {
	preserveBreaks: false
}

export default class CoderPlugin extends Plugin {
	settings: CoderSettings;

	// List of coders
	coders: Coder[] = [
		new Base64Encoder(),
		new Base64Decoder(),
		new Base85Encoder(),
		new Base85Decoder(),
		new TextToBase16Encoder(),
		new Base16ToTextDecoder(),
		new Rot13Encoder(),
		new Rot13Decoder(),
		new AtbashEncoder(),
		new AtbashDecoder()
	];

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new CoderSettingTab(this.app, this));

		this.coders.forEach(coder => {
		    this.registerMarkdownCodeBlockProcessor(
		        `transform-${coder.from}-${coder.to}`,
		        async (content, el, ctx) => {
		            this.processText(content, el, coder);
		        }
		    );
		});
	}

	// function to get a coder by from and to types
	getCoder(from: string, to: string): Coder | null {
		return this.coders.find(coder => coder.from === from && coder.to === to) || null;
	}

	onunload() {

	}

	processText(content: string, el: HTMLElement, coder: Coder|null) {
		if(content.endsWith("\n")) {
			// Obsidian gives an unpretty linebreak at the end. Don't encode it in our content!
			content = content.substring(0, content.length - 1);
		}

		let outputText: string;
		
		if(coder != null) {
			if(this.settings.preserveBreaks) {
				// Encode each line independently, preserving line breaks in the output
				const lines = content.split(/\r?\n/);
				const results: string[] = [];
				for(const line of lines) {
					if(coder.checkInput(line) || line === "") {
						results.push(coder.transform(line));
					} else {
						results.push("Invalid input for coder " + coder.from + " to " + coder.to);
					}
				}
				outputText = results.join("\n");
			} else {
				if(coder.checkInput(content)) {
					outputText = coder.transform(content);
				} else {
					outputText = "Invalid input for coder " + coder.from + " to " + coder.to;
				}
			}
		} else {
			outputText = "No coder found!";
		}

		// Use <pre> tag if preserveBreaks is enabled to maintain newlines
		if(this.settings.preserveBreaks) {
			const pre = document.createElement("pre");
			pre.textContent = outputText;
			el.appendChild(pre);
		} else {
			const destination = document.createTextNode(outputText);
			el.appendChild(destination);
		}
		
		return;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CoderSettingTab extends PluginSettingTab {
	plugin: CoderPlugin;

	constructor(app: App, plugin: CoderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Coder Settings'});

		new Setting(containerEl)
			.setName('Preserve breaks')
			.setDesc('When enabled, each line is encoded independently and line breaks are preserved in the output. When disabled, content is encoded as-is.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preserveBreaks)
				.onChange(async (value) => {
					this.plugin.settings.preserveBreaks = value;
					await this.plugin.saveSettings();
				}));
	}
}

