import { PEMObject } from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe('PEMObject', (t) => {

    it('correctly decodes PEM objects when line endings are CRLF', (t) => {
        const pemText = fs.readFileSync(path.join(path.dirname(t.filePath), "data", "crlf.pem"), { encoding: "utf-8" });
        const objects = PEMObject.parse(pemText);
        assert.equal(objects.length, 1);
    });

    it('correctly decodes PEM objects when the label contains numbers and other symbols', () => {
        const pemText = fs.readFileSync(path.join(path.dirname(t.filePath), "data", "crl.pem"), { encoding: "utf-8" });
        const objects = PEMObject.parse(pemText);
        assert.equal(objects.length, 1);
    });

});
