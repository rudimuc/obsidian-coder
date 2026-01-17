import { Coder } from "./Coder";

export class TextToBase16Encoder implements Coder {

    from = "text";
    to = "base16";

    transform(text: string): string {
        return Array.from(text)
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join("");
    }

    checkInput(text: string): boolean {
        // Check if the input is a string and not empty
        return typeof text === "string" && text.length > 0;
    }
}

export class Base16ToTextDecoder implements Coder {

    from = "base16";
    to = "text";

    transform(text: string): string {
        if (!this.checkInput(text)) {
            throw new Error("Invalid Base16 input");
        }
        return text.match(/.{1,2}/g) // Split the hex string into pairs of two characters
            ?.map(byte => String.fromCharCode(parseInt(byte, 16)))
            .join("") || "";
    }

    checkInput(text: string): boolean {
        // Check if the input is a valid Base16 (hex) string
        const hexRegex = /^[A-Fa-f0-9]+$/;
        return typeof text === "string" && hexRegex.test(text) && text.length % 2 === 0;
    }
}
