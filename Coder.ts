
// Abstract class for all coders
export interface Coder {

        from: string;
        to: string;

        transform (text:string) : string;
        checkInput (text:string) : boolean;

}
