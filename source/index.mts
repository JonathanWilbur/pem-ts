import { fromArrayBuffer as encodeBase64, toArrayBuffer as decodeBase64 } from "@hexagon/base64";

/**
 * An error thrown when a PEM object is malformed.
 */
export class PEMError extends Error {
    /**
     * Create a new PEMError.
     * @param m The message to display.
     * @class PEMError
     */
    constructor (m: string) {
        super(m);
    }
}

/**
 * A PEM object.
 */
export class PEMObject {
    /**
     * The regular expression to match the pre-encapsulation boundary.
     */
    public static readonly preEncapsulationBoundaryRegex: RegExp = /^-----BEGIN ([ \x21-\x7e]+)-----$/m;
    /**
     * The regular expression to match the post-encapsulation boundary.
     */
    public static readonly postEncapsulationBoundaryRegex: RegExp = /^-----END ([ \x21-\x7e]+)-----$/m;
    /**
     * The regular expression to match a base64 line.
     */
    public static readonly base64LineRegex: RegExp = /^[A-Za-z0-9+/=]+\s*$/mg;
    /**
     * The regular expression to match a PEM object.
     */
    public static readonly pemObjectRegex: RegExp
        = new RegExp(
            PEMObject.preEncapsulationBoundaryRegex.source
            + "\r?\n(?:\\s*\r?\n)*((?:"
            + PEMObject.base64LineRegex.source
            + "\r?\n)*)?"
            + PEMObject.postEncapsulationBoundaryRegex.source,
            "m",
        );

    /**
     * From RFC 7468:
     * "Labels are formally case-sensitive, uppercase, and comprised of zero or more
     * characters; they do not contain consecutive spaces or hyphen-minuses,
     * nor do they contain spaces or hyphen-minuses at either end."
     */
    public static validateLabel (label: string): void {
        if (!label.match(/^[A-Z#0-9\- ]*$/)) throw new PEMError("Malformed PEM label.");
        if (label.match(/\s\s/)) throw new PEMError("PEM label cannot contain consecutive spaces.");
        if (label.match(/--/)) throw new PEMError("PEM label cannot contain consecutive hyphen-minuses.");
        if (label.match(/^\s+/) || label.match(/\s+$/)) {
            throw new PEMError("PEM label cannot begin or end with spaces.");
        }
        if (label.match(/^-+/) || label.match(/-+$/)) {
            throw new PEMError("PEM label cannot begin or end with hyphen-minuses.");
        }
    }

    /**
     * Parse one or more PEM object from a string.
     * @param text The string to parse.
     * @returns The PEM object.
     * @static
     * @method
     */
    public static parse (text: string): PEMObject[] {
        let i: number = 0;
        let match: RegExpExecArray | null;
        const ret: PEMObject[] = [];
        do {
            match = PEMObject.pemObjectRegex.exec(text.slice(i));
            if (match === null) break;
            i += (match.index + 1); // "+ match[0].length" does not work for some reason.
            const next: PEMObject = new PEMObject(match[1], match[2].replace(/\s+/ug, ""));
            ret.push(next);
        } while (i < text.length);
        return ret;
    }

    /**
     * The label of the PEM object.
     */
    private _label: string = "";

    /**
     * Get the label of the PEM object.
     */
    public get label (): string {
        PEMObject.validateLabel(this._label);
        return this._label;
    }

    /**
     * Set the label of the PEM object.
     */
    public set label (value: string) {
        PEMObject.validateLabel(value);
        this._label = value;
    }

    /**
     * The binary data of the PEM object.
     */
    public data: Uint8Array = new Uint8Array(0);

    private dataAsArrayBuffer(): ArrayBuffer | SharedArrayBuffer {
        return this.data.buffer.slice(
            this.data.byteOffset,
            this.data.byteOffset + this.data.byteLength
        );
    }

    /**
     * Get the pre-encapsulation boundary of the PEM object.
     */
    public get preEncapsulationBoundary (): string {
        return `-----BEGIN ${this.label}-----`;
    }

    /**
     * Get the post-encapsulation boundary of the PEM object.
     */
    public get postEncapsulationBoundary (): string {
        return `-----END ${this.label}-----`;
    }

    public get encapsulatedTextPortion (): string {
        // I know the type-casting is sloppy, but the underlying base64 code
        // should accept either, and I submitted a
        // [PR](https://github.com/Hexagon/base64/pull/188) to relax the types.
        const base64data: string = encodeBase64(this.dataAsArrayBuffer() as ArrayBuffer);
        const stringSplitter: RegExp = /.{1,64}/g;
        return (base64data.match(stringSplitter) || []).join("\n");
    }

    /**
     * Create a new PEM object.
     * @param label The label of the PEM object.
     * @param data The data of the PEM object.
     * @class PEMObject
     */
    constructor (label? : string, data? : string | Uint8Array) {
        if (label !== undefined) this.label = label;
        if (data !== undefined) {
            if (typeof data === "string") {
                this.data = new Uint8Array(decodeBase64(data));
            } else {
                this.data = data;
            }
        }
    }

    /**
     * Decode a single PEM object from a string.
     * @param encoded The string to decode.
     * @method
     */
    public decode (encoded: string): void {
        const lines: string[] = encoded.trim().replace("\r", "").split("\n");
        if (lines.length <= 2) throw new PEMError("PEM is too small to be valid");

        // Pre-encapsulation Boundary parsing
        if (lines[0].indexOf("-----BEGIN ") !== 0) throw new PEMError("PEM object did not start with '-----BEGIN '");
        if (!lines[0].endsWith("-----")) throw new PEMError("PEM object did not end with '-----'");
        const preEncapsulationBoundaryLabel: string = lines[0].slice(11, (lines[0].length - 5));

        // Post-encapsulation Boundary parsing
        if (lines[(lines.length - 1)].indexOf("-----END ") !== 0) {
            throw new PEMError("Last line of PEM object did not start with '-----END '");
        }
        if (!lines[(lines.length - 1)].endsWith("-----")) {
            throw new PEMError("Last line of PEM object did not end with '-----'");
        }
        const postEncapsulationBoundaryLabel: string
            = lines[(lines.length - 1)].slice(9, (lines[(lines.length - 1)].length - 5));

        /**
         * From RFC 7468:
         * "Parsers MAY disregard the label in the post-encapsulation boundary
         * instead of signaling an error if there is a label mismatch: some
         * extant implementations require the labels to match; others do not."
         *
         * This library will not skip this validation, for now, though it is
         * permissible to do so in the future.
         */
        if (preEncapsulationBoundaryLabel !== postEncapsulationBoundaryLabel) {
            throw new PEMError(
                "PEM object Pre-encapsulation Boundary label does not match Post-encapsulation Boundary label.",
            );
        }

        this.label = preEncapsulationBoundaryLabel;

        /**
         * From RFC 7468:
         * "Empty space can appear between the pre-encapsulation boundary and
         * the base64..."
         */
        let firstNonBlankBase64Line: number = 1;
        while (firstNonBlankBase64Line < (lines.length - 1)) {
            if (!lines[firstNonBlankBase64Line].match(/^\s*$/)) break;
            firstNonBlankBase64Line++;
        }

        lines.slice(firstNonBlankBase64Line, (lines.length - 1)).forEach((line) => {
            if (line.match(/^\s*$/)) throw new PEMError("Blank lines detected within PEM data");
        });

        const base64data: string = lines.slice(1, (lines.length - 1)).join("").replace(/\s+/g, "");
        this.data = new Uint8Array(decodeBase64(base64data));
    }

    /**
     * Get the encoded string of the PEM object.
     */
    public get encoded (): string {
        return (
            this.preEncapsulationBoundary + "\n"
            + this.encapsulatedTextPortion + "\n"
            + this.postEncapsulationBoundary
        );
    }

    /**
     * Get the string representation of the PEM object.
     */
    public toString(): string {
        return this.encoded;
    }
}
