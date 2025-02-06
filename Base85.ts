import { Coder } from "./Coder";

export class Base85Encoder implements Coder {

    from = "text";
    to = "base85";

    transform(text: string): string {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        let base85 = "";

        for (let i = 0; i < bytes.length; i += 4) {
            let chunk = 0;
            for (let j = 0; j < 4; j++) {
                chunk = (chunk << 8) | (bytes[i + j] || 0);
            }
            for (let j = 4; j >= 0; j--) {
                base85 += String.fromCharCode((chunk / (85 ** j) % 85) + 33);
            }
        }
        return base85;
    }

    checkInput(text: string): boolean {
        // Ensure the input is a non-empty string
        return typeof text === "string" && text.length > 0;
    }
}

export class Base85Decoder implements Coder {

    from = "base85";
    to = "text";

    transform(text: string): string {
        if (!this.checkInput(text)) {
            throw new Error("Invalid Base85 input");
        }

        const decoder = new TextDecoder();
        const chunks = text.match(/.{1,5}/g) || [];
        const bytes = [];

        for (const chunk of chunks) {
            let value = 0;
            for (let i = 0; i < chunk.length; i++) {
                value = value * 85 + (chunk.charCodeAt(i) - 33);
            }

            for (let i = 3; i >= 0; i--) {
                bytes.push((value >> (i * 8)) & 0xff);
            }
        }

        return decoder.decode(new Uint8Array(bytes).filter(byte => byte !== 0));
    }

    checkInput(text: string): boolean {
        // Check if the input is a valid Base64 string
//        const base64Regex = /^[A-Za-z0-9+/=]+$/;
//        return typeof text === "string" && base64Regex.test(text) && text.length % 4 === 0;
        return true;
    }

}
