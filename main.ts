import { App, MarkdownView, Plugin, MarkdownPostProcessorContext, PluginSettingTab, Setting } from 'obsidian';

import * as base64js from 'base64-js';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}


// Abstract class for all coders
interface Coder {

	from: string;
	to: string;

	transform (text:string) : string;

}

class Base64Encoder implements Coder {
	from:string;
	to: string;

	constructor() {
		this.from = "text";
		this.to = "base64";
	}

	transform (text:string) : string {
		let utf8Encode = new TextEncoder();
		return base64js.fromByteArray(utf8Encode.encode(text));
	}
}


export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	// List of coders
	coders: Coder[] = [new Base64Encoder()];

	async onload() {
		this.registerMarkdownCodeBlockProcessor('transform-text-base64', this.processTextToBase64);
		//this.registerMarkdownCodeBlockProcessor('transform-base64-text', this.processBase64ToText);
	}

	// function to get a coder by from and to types
	getCoder(from: string, to: string) {
		for (let coder of this.coders) {
			if (coder.from == from && coder.to == to) {
				return coder;
			}
		}
		return null;
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	
	processTextToBase64 = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		let destination = document.createElement('p');

		if(content.endsWith("\n")) {
			// Obsidian gives an unpretty linebreak at the end. Don't encode it in our content!
			content = content.substring(0, content.length - 1);
		}
		let coder = this.getCoder("text", "base64");

		// convert the content variable to a byte array
		if(coder != null) {
			destination.innerHTML = coder.transform(content);
		} else {
			destination.innerHTML = "No coder found!";
		}

		el.appendChild(destination);
		return;
	}
	processBase64ToText = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		let destination = document.createElement('span');

		if(content.endsWith("\n")) {
			// Obsidian gives an unpretty linebreak at the end. Don't encode it in our content!
			content = content.substring(0, content.length - 1);
		}
		let coder = this.getCoder("base64", "text");

		// convert the content variable to a byte array
		if(coder != null) {
			destination.innerHTML = coder.transform(content);
		} else {
			destination.innerHTML = "No coder found!";
		}

		el.appendChild(destination);
		return;
	}

}

