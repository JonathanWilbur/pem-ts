export declare const rfc7468CompliantPEMLabels: string[];
export declare class PEMError extends Error {
    constructor(m: string);
}
export declare class PEMObject {
    static readonly preEncapsulationBoundaryRegex: RegExp;
    static readonly postEncapsulationBoundaryRegex: RegExp;
    static readonly base64LineRegex: RegExp;
    static readonly pemObjectRegex: RegExp;
    protected static decodeBase64(base64: string): Uint8Array;
    protected static encodeBase64(data: Uint8Array): string;
    /**
     * From RFC 7468:
     * "Labels are formally case-sensitive, uppercase, and comprised of zero or more
     * characters; they do not contain consecutive spaces or hyphen-minuses,
     * nor do they contain spaces or hyphen-minuses at either end."
     */
    static validateLabel(label: string): void;
    static parse(text: string): PEMObject[];
    private _label;
    label: string;
    data: Uint8Array;
    readonly hasRFC7468CompliantLabel: boolean;
    readonly preEncapsulationBoundary: string;
    readonly postEncapsulationBoundary: string;
    readonly encapsulatedTextPortion: string;
    constructor(label?: string, data?: string | Uint8Array);
    decode(encoded: string): void;
    readonly encoded: string;
}
