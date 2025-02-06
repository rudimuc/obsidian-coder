import { App, MarkdownView, Plugin, MarkdownPostProcessorContext, PluginSettingTab, Setting } from 'obsidian';

import { Coder } from "./Coder";
import { Base64Encoder, Base64Decoder } from "./Base64";
import { Rot13Encoder, Rot13Decoder } from "./Rot13";
import { AtbashEncoder, AtbashDecoder } from "./Atbash";

export default class CoderPlugin extends Plugin {

	// List of coders
	coders: Coder[] = [new Base64Encoder(), new Base64Decoder(), new Rot13Encoder(), new Rot13Decoder(), new AtbashEncoder(), new AtbashDecoder()];

	async onload() {
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

