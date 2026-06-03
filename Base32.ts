import { Coder } from "./Coder";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PADDING = "=";

export class TextToBase32Encoder implements Coder {

    from = "text";
    to = "base32";

    transform(text: string): string {
        const bytes = Array.from(text).map(c => c.charCodeAt(0));
        let bits = 0;
        let value = 0;
        let output = "";

        for (const byte of bytes) {
            value = (value << 8) | byte;
            bits += 8;
            while (bits >= 5) {
                output += ALPHABET[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }

        if (bits > 0) {
            output += ALPHABET[(value << (5 - bits)) & 31];
        }

        while (output.length % 8 !== 0) {
            output += PADDING;
        }

        return output;
    }

    checkInput(text: string): boolean {
        return typeof text === "string" && text.length > 0;
    }
}

export class Base32ToTextDecoder implements Coder {

    from = "base32";
    to = "text";

    transform(text: string): string {
        const cleaned = text.toUpperCase().replace(/=+$/, "");
        let bits = 0;
        let value = 0;
        let output = "";

        for (const char of cleaned) {
            const idx = ALPHABET.indexOf(char);
            value = (value << 5) | idx;
            bits += 5;
            if (bits >= 8) {
                output += String.fromCharCode((value >>> (bits - 8)) & 255);
                bits -= 8;
            }
        }

        return output;
    }

    checkInput(text: string): boolean {
        const base32Regex = /^[A-Za-z2-7]+=*$/;
        const cleaned = text.replace(/\s/g, "");
        return typeof text === "string" && base32Regex.test(cleaned) && cleaned.length > 0;
    }
}
