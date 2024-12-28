import { Coder } from "./Coder";

export class Rot13Encoder implements Coder {
        from:string;
        to: string;

        constructor() {
                this.from = "text";
                this.to = "rot13";
        }

        rot13(txt:string) {
                return txt.replace(/[a-z]/gi, c =>
                        "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"
                                [ "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c) ] );
        }

        transform (text:string) : string {
                return this.rot13(text);
        }

        checkInput(text: string): boolean {
                // For now, we assume that all text is valid. We will only encode A-Z and a-z. The rest will be left as is.
                return true;
        }
}

export class Rot13Decoder implements Coder {
        from:string;
        to: string;

        constructor() {
                this.from = "rot13";
                this.to = "text";
        }

        derot13(txt:string) {
                return txt.replace(/[a-z]/gi, c =>
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                                [ "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".indexOf(c) ] );
        }

        transform (text:string) : string {
                return this.derot13(text);
        }

        checkInput(text: string): boolean {
                // For now, we assume that all text is valid. We will only encode A-Z and a-z. The rest will be left as is.
                return true;
        }
}
