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
