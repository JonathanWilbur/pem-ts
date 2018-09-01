export
const rfc7468CompliantPEMHeaders : string[] = [
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
    public header : string = "";
    public data : Uint8Array = new Uint8Array(0);
    public static base64CharactersPerLine : number = 64;

    public get hasRFC7468CompliantHeader () : boolean {
        return rfc7468CompliantPEMHeaders.includes(this.header);
    }

    constructor() {

    }

    public decode (encoded : string) : void {
        const lines : string[] = encoded.trim().split("\n");
        if (lines.length <= 2)
            throw new PEMError("PEM is too small to be valid");

        // Header parsing
        if (lines[0].indexOf("-----BEGIN ") !== 0)
            throw new PEMError("PEM object did not start with '-----BEGIN '");
        if (!lines[0].endsWith("-----"))
            throw new PEMError("PEM object did not end with '-----'");
        const header : string = lines[0].slice(11, (lines[0].length - 5));

        // Footer parsing
        if (lines[(lines.length - 1)].indexOf("-----END ") !== 0)
            throw new PEMError("Last line of PEM object did not start with '-----END '");
        if (!lines[(lines.length - 1)].endsWith("-----"))
            throw new PEMError("Last line of PEM object did not end with '-----'");
        const footer : string = lines[(lines.length - 1)].slice(9, (lines[(lines.length - 1)].length - 5));

        if (header !== footer)
            throw new PEMError("PEM object header does not match footer");

        this.header = header;

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
        let ret : string[] = [ `-----BEGIN ${this.header}-----` ];
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
        ret.push(`-----END ${this.header}-----`);
        return ret.join("\n");
    }

}

let pem : PEMObject = new PEMObject();
pem.header = "CERTIFICATE";
pem.data = new Uint8Array([
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08
]);

pem.decode(pem.encode());
console.log(pem.data);