import { App, MarkdownView, Plugin, MarkdownPostProcessorContext, PluginSettingTab, Setting } from 'obsidian';

import * as base64js from 'base64-js';


// Abstract class for all coders
interface Coder {

	from: string;
	to: string;

	transform (text:string) : string;
	checkInput (text:string) : boolean;

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

	checkInput(text: string): boolean {
		// For now, we assume that all text is valid
		return true;
	}
}


export default class CoderPlugin extends Plugin {

	// List of coders
	coders: Coder[] = [new Base64Encoder()];

	async onload() {
		this.registerMarkdownCodeBlockProcessor('transform-text-base64', this.processTextToBase64);
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
		var destination;

		if(content.endsWith("\n")) {
			// Obsidian gives an unpretty linebreak at the end. Don't encode it in our content!
			content = content.substring(0, content.length - 1);
		}
		let coder = this.getCoder("text", "base64");

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
	
	
	/**
	processBase64ToText = async (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		var destination;

		if(content.endsWith("\n")) {
			// Obsidian gives an unpretty linebreak at the end. Don't encode it in our content!
			content = content.substring(0, content.length - 1);
		}
		let coder = this.getCoder("base64", "text");

		// convert the content variable to a byte array
		if(coder != null) {
			destination = document.createTextNode (coder.transform(content));
		} else {
			destination = document.createTextNode ( "No coder found!" );
		}

		el.appendChild(destination);
		return;
	}**/

}

