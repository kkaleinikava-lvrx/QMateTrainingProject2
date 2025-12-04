export class Formatter {

    public static extractNumberFromString(input: string): string {
        const match = input.match(/([\d]+[\.]?[\d]*)/);
        if (match) {
            return match[0];
        } else {
            return "";
        }
    }
}