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

    public static readonly preEncapsulationBoundaryRegex : RegExp = /^-----BEGIN (?<prelabel>[A-Z# ]*)-----$/m;
    public static readonly postEncapsulationBoundaryRegex : RegExp = /^-----END (?<postlabel>[A-Z# ]*)-----$/m;
    public static readonly base64LineRegex : RegExp = /^[A-Za-z0-9\+/=]+\s*$/mg;
    public static readonly pemObjectRegex : RegExp =
        new RegExp(
            PEMObject.preEncapsulationBoundaryRegex.source +
            "\n(?:\\s*\n)*(?<base64>(?:" +
            PEMObject.base64LineRegex.source +
            "\n)*)?" +
            PEMObject.postEncapsulationBoundaryRegex.source,
            "m"
        );

    public static decodeBase64 (base64 : string) : Uint8Array {
        if (TextEncoder !== undefined) { // Browser JavaScript
            return (new TextEncoder()).encode(atob(base64));
        } else if (Buffer !== undefined) { // NodeJS
            return Buffer.from(base64, "base64");
        } else {
            throw new PEMError("Unable to decode PEM data from Base-64.");
        }
    }

    public static encodeBase64 (data : Uint8Array) : string {
        if (TextDecoder !== undefined) { // Browser JavaScript
            return btoa((new TextDecoder("utf-8")).decode(data));
        } else if (Buffer !== undefined) { // NodeJS
            return (new Buffer(data)).toString("base64");
        } else {
            throw new PEMError("Unable to encode PEM data to Base-64.");
        }
    }

    /**
     * From RFC 7468:
     * "Labels are formally case-sensitive, uppercase, and comprised of zero or more
     * characters; they do not contain consecutive spaces or hyphen-minuses,
     * nor do they contain spaces or hyphen-minuses at either end."
     */
    public static validateLabel (label : string) : void {
        if (!label.match(/^[A-Z# ]*$/))
            throw new PEMError("Malformed PEM label.");
        if (label.match(/\s\s/))
            throw new PEMError("PEM label cannot contain consecutive spaces.");
        if (label.match(/--/))
            throw new PEMError("PEM label cannot contain consecutive hyphen-minuses.");
        if (label.match(/^\s+/) || label.match(/\s+$/))
            throw new PEMError("PEM label cannot begin or end with spaces.");
        if (label.match(/^\-+/) || label.match(/\-+$/))
            throw new PEMError("PEM label cannot begin or end with hyphen-minuses.");
    }

    public static parse (text : string) : PEMObject[] {
        let i : number = 0;
        let match : RegExpExecArray | null;
        let ret : PEMObject[] = [];
        do {
            match = PEMObject.pemObjectRegex.exec(text.slice(i));
            if (match === null) break;
            i += (match.index + 1); // "+ match[0].length" does not work for some reason.
            const next : PEMObject = new PEMObject(match[1], match[2]);
            ret.push(next);
        } while (i < text.length);
        return ret;
    }

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

    public get encapsulatedTextPortion () : string {
        const base64data : string = PEMObject.encodeBase64(this.data);
        const stringSplitter : RegExp = /.{1,64}/g;
        return (base64data.match(stringSplitter) || []).join("\n");
    }

    constructor(label? : string, data? : string | Uint8Array) {
        if (label !== undefined) this.label = label;
        if (data !== undefined) {
            if (typeof data === "string") {
                this.data = PEMObject.decodeBase64(data);
            } else {
                this.data = data;
            }
        }
    }

    public decode (encoded : string) : void {
        const lines : string[] = encoded.trim().replace("\r", "").split("\n");
        if (lines.length <= 2)
            throw new PEMError("PEM is too small to be valid");

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

        /**
         * From RFC 7468:
         * "Empty space can appear between the pre-encapsulation boundary and
         * the base64..."
         */
        let firstNonBlankBase64Line : number = 1;
        while (firstNonBlankBase64Line < (lines.length - 1)) {
            if (!lines[firstNonBlankBase64Line].match(/^\s*$/)) break;
            firstNonBlankBase64Line++;
        }

        lines.slice(firstNonBlankBase64Line, (lines.length - 1)).forEach(line => {
            if (line.match(/^\s*$/))
                throw new PEMError("Blank lines detected within PEM data");
        });

        const base64data : string = lines.slice(1, (lines.length - 1)).join("").replace(/\s+/g, "");
        this.data = PEMObject.decodeBase64(base64data);
    }

    public get encoded () : string {
        return (
            this.preEncapsulationBoundary + "\n" +
            this.encapsulatedTextPortion + "\n" +
            this.postEncapsulationBoundary
        );
    }

}