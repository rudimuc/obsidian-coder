
// Abstract class for all coders
interface Coder {

        from: string;
        to: string;

        transform (text:string) : string;
        checkInput (text:string) : boolean;

}
