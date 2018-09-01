export
const rfc7468CompliantPEMLabels : string[] = [
    "X509 CERTIFICATE",
    "CERTIFICATE",
    "CERTIFICATE PAIR",
    "TRUSTED CERTIFICATE",
    "NEW CERTIFICATE REQUEST",
    "CERTIFICATE REQUEST",
    "X509 CRL",
    "ANY PRIVATE KEY",
    "PUBLIC KEY",
    "RSA PRIVATE KEY",
    "RSA PUBLIC KEY",
    "DSA PRIVATE KEY",
    "DSA PUBLIC KEY",
    "PKCS7",
    "PKCS #7 SIGNED DATA",
    "ENCRYPTED PRIVATE KEY",
    "PRIVATE KEY",
    "DH PARAMETERS",
    "SSL SESSION PARAMETERS",
    "DSA PARAMETERS",
    "ECDSA PUBLIC KEY",
    "EC PARAMETERS",
    "EC PRIVATE KEY",
    "PARAMETERS",
    "CMS",
    "ATTRIBUTE CERTIFICATE"
];

export
class PEMError extends Error {
    constructor(m : string) {
        super(m);
    }
}

export
class PEMObject {

    private _label : string = "";

    public get label () : string {
        PEMObject.validateLabel(this._label);
        return this._label;
    }

    public set label (value : string) {
        PEMObject.validateLabel(value);
        this._label = value;
    }

    public data : Uint8Array = new Uint8Array(0);
    public static base64CharactersPerLine : number = 64;

    public get hasRFC7468CompliantLabel () : boolean {
        // You don't really have to validate it in this case, so _label is used.
        return rfc7468CompliantPEMLabels.includes(this._label);
    }

    public get preEncapsulationBoundary () : string {
        return `-----BEGIN ${this.label}-----`;
    }

    public get postEncapsulationBoundary () : string {
        return `-----END ${this.label}-----`;
    }

    /**
     * From RFC 7468:
     * "Labels are formally case-sensitive, uppercase, and comprised of zero or more
     * characters; they do not contain consecutive spaces or hyphen-minuses,
     * nor do they contain spaces or hyphen-minuses at either end."
     */
    public static validateLabel (label : string) : void {
        if (!label.match(/^[A-Z# ]*$/g))
            throw new PEMError("Malformed PEM label.");
        if (label.match(/\s\s/g))
            throw new PEMError("PEM label cannot contain consecutive spaces.");
        if (label.match(/--/g))
            throw new PEMError("PEM label cannot contain consecutive hyphen-minuses.");
        if (label.match(/^\s+/g) || label.match(/\s+$/g))
            throw new PEMError("PEM label cannot begin or end with spaces.");
        if (label.match(/^\-+/g) || label.match(/\-+$/g))
            throw new PEMError("PEM label cannot begin or end with hyphen-minuses.");
    }

    constructor() {

    }

    public decode (encoded : string) : void {
        const lines : string[] = encoded.trim().split("\n");
        if (lines.length <= 2)
            throw new PEMError("PEM is too small to be valid");

        // while (lines[0].indexOf("-----BEGIN ") !== 0) lines.shift();
        // if (lines.length === 0)
        //     throw new PEMError("No PEM Pre-Encapsulation Boundary found.");

        // Pre-encapsulation Boundary parsing
        if (lines[0].indexOf("-----BEGIN ") !== 0)
            throw new PEMError("PEM object did not start with '-----BEGIN '");
        if (!lines[0].endsWith("-----"))
            throw new PEMError("PEM object did not end with '-----'");
        const preEncapsulationBoundaryLabel : string = lines[0].slice(11, (lines[0].length - 5));

        // Post-encapsulation Boundary parsing
        if (lines[(lines.length - 1)].indexOf("-----END ") !== 0)
            throw new PEMError("Last line of PEM object did not start with '-----END '");
        if (!lines[(lines.length - 1)].endsWith("-----"))
            throw new PEMError("Last line of PEM object did not end with '-----'");
        const postEncapsulationBoundaryLabel : string = lines[(lines.length - 1)].slice(9, (lines[(lines.length - 1)].length - 5));

        /**
         * From RFC 7468:
         * "Parsers MAY disregard the label in the post-encapsulation boundary
         * instead of signaling an error if there is a label mismatch: some
         * extant implementations require the labels to match; others do not."
         *
         * This library will not skip this validation, for now, though it is
         * permissible to do so in the future.
         */
        if (preEncapsulationBoundaryLabel !== postEncapsulationBoundaryLabel)
            throw new PEMError("PEM object Pre-encapsulation Boundary label does not match Post-encapsulation Boundary label.");

        this.label = preEncapsulationBoundaryLabel;

        lines.slice(1, (lines.length - 1)).forEach(line => {
            if (line.match(/^\s*$/))
                throw new PEMError("Blank lines detected within PEM data");
        });
        const base64data : string = lines.slice(1, (lines.length - 1)).join("");
        if (typeof TextEncoder !== "undefined") { // Browser JavaScript
            this.data = (new TextEncoder()).encode(atob(base64data));
        } else if (typeof Buffer !== "undefined") { // NodeJS
            this.data = Buffer.from(base64data, "base64");
        } else {
            throw new PEMError("Unable to decode PEM data from Base-64.");
        }
    }

    public encode () : string {

        let ret : string[] = [ this.preEncapsulationBoundary ];
        let base64data : string = "";
        if (typeof TextDecoder !== "undefined") { // Browser JavaScript
            base64data = btoa((new TextDecoder("utf-8")).decode(this.data));
        } else if (typeof Buffer !== "undefined") { // NodeJS
            base64data = (new Buffer(this.data)).toString("base64");
        } else {
            throw new PEMError("Unable to encode PEM data to Base-64.");
        }
        const stringSplitter : RegExp = new RegExp(".{1," + PEMObject.base64CharactersPerLine + "}", "g");
        ret = ret.concat(base64data.match(stringSplitter) || []);
        ret.push(this.postEncapsulationBoundary);
        return ret.join("\n");
    }

}