const PEMObject = require("../../dist/index.js").PEMObject;
const fs = require("fs");
const path = require("path");

describe('PEMObject', () => {

    it('correctly decodes PEM objects when line endings are CRLF', () => {
        const pemText = fs.readFileSync(path.join(__dirname, "..", "data", "crlf.pem"), { encoding: "utf-8" });
        const objects = PEMObject.parse(pemText);
        expect(objects.length).toBe(1);
    });

    it('correctly decodes PEM objects when the label contains numbers and other symbols', () => {
        const pemText = fs.readFileSync(path.join(__dirname, "..", "data", "crl.pem"), { encoding: "utf-8" });
        const objects = PEMObject.parse(pemText);
        expect(objects.length).toBe(1);
    });

});
