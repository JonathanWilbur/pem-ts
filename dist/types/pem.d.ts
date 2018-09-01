export declare class PEMError extends Error {
    constructor(m: string);
}
export declare class PrivacyEnhancedMailObject {
    header: string;
    data: Uint8Array;
    constructor();
    decode(encoded: string): void;
    encode(): string;
}
