import {Coder} from "./Coder";

export class AtbashEncoder implements Coder {
    from: string;
    to: string;

    constructor() {
        this.from = "text";
        this.to = "atbash";
    }

    atbash(txt: string) {
        return txt.replace(/[a-z]/gi, c =>
            "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba"
            ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c)]);
    }

    transform(text: string): string {
        return this.atbash(text);
    }

    checkInput(text: string): boolean {
        // For now, we assume that all text is valid. We will only encode A-Z and a-z. The rest will be left as is.
        return true;
    }
}

export class AtbashDecoder implements Coder {
    from: string;
    to: string;

    constructor() {
        this.from = "atbash";
        this.to = "text";
    }

    deatbash(txt: string) {
        return txt.replace(/[a-z]/gi, c =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            ["ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba".indexOf(c)]);
    }

    transform(text: string): string {
        return this.deatbash(text);
    }

    checkInput(text: string): boolean {
        // For now, we assume that all text is valid. We will only encode A-Z and a-z. The rest will be left as is.
        return true;
    }
}