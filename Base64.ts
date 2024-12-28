import { Coder } from "./Coder";

export class Base64Encoder implements Coder {
        from = "text";
        to = "base64";

        transform(text: string): string {
                return btoa(text);
        }

        checkInput(text: string): boolean {
                // Check if the input is a string and not null or undefined
                return typeof text === "string" && text.length > 0;
        }
}

export class Base64Decoder implements Coder {

    from = "base64";
    to = "text";

    transform(text: string): string {
        try {
            return atob(text);
        } catch (e) {
            throw new Error("Invalid Base64 input");
        }
    }

    checkInput(text: string): boolean {
        // Check if the input is a valid Base64 string
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        return typeof text === "string" && base64Regex.test(text) && text.length % 4 === 0;
    }
}
