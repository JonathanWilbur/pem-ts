import { PEMObject } from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe('PEMObject', () => {
    it('throws when decoding a blank string', () => {
        const pem = new PEMObject();
        assert.throws(() => pem.decode(""));
    });

    it('throws when decoding a PEM object with a blank label', () => {
        const pem = new PEMObject();
        assert.throws(() => pem.decode("----------\n----------"));
    });

    it('throws when decoding a PEM object with a mismatching label and footer', () => {
        const pem = new PEMObject();
        assert.throws(() => pem.decode("-----BEGIN BEEP-----\n-----END BOOP-----"));
    });

    it('throws when decoding a PEM object with valid labels encoded on one line', () => {
        const pem = new PEMObject();
        assert.throws(() => pem.decode("-----BEGIN CERT----------END CERT-----"));
    });
});
