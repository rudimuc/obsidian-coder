import { App, MarkdownView, Plugin, MarkdownPostProcessorContext, PluginSettingTab, Setting } from 'obsidian';

import { Coder } from "./Coder";
import { Base64Encoder, Base64Decoder } from "./Base64";
import { Rot13Encoder, Rot13Decoder } from "./Rot13";

export default class CoderPlugin extends Plugin {

	// List of coders
	coders: Coder[] = [new Base64Encoder(), new Base64Decoder(), new Rot13Encoder(), new Rot13Decoder()];

	async onload() {
		this.registerMarkdownCodeBlockProcessor('transform-text-base64', this.processTextToBase64);
		this.registerMarkdownCodeBlockProcessor('transform-base64-text', this.processBase64ToText);
		this.registerMarkdownCodeBlockProcessor('transform-text-rot13', this.processTextToRot13);
		this.registerMarkdownCodeBlockProcessor('transform-rot13-text', this.processRot13ToText);
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

	processTextToBase64 = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		let coder = this.getCoder("text", "base64");
		this.processText(content, el, coder);
	}

	processBase64ToText = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		let coder = this.getCoder("base64", "text");
		this.processText(content, el, coder);
	}

	processTextToRot13 = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		let coder = this.getCoder("text", "rot13");
		this.processText(content, el, coder);
	}

	processRot13ToText = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		let coder = this.getCoder("rot13", "text");
		this.processText(content, el, coder);
	}

	processText(content: string, el: HTMLElement, coder: Coder|null) {
		var destination;

		if(content.endsWith("\n")) {
			// Obsidian gives an unpretty linebreak at the end. Don't encode it in our content!
			content = content.substring(0, content.length - 1);
		}

		// convert the content variable to a byte array
		if(coder != null) {
			if(coder.checkInput(content)) {
				destination = document.createTextNode(coder.transform(content));
			} else {
				destination = document.createTextNode("Invalid input for coder " + coder.from + " to " + coder.to);
			}
		} else {
			destination = document.createTextNode( "No coder found!");
		}

		el.appendChild(destination);
		return;
	}
}

