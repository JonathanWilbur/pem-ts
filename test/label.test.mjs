import { PEMObject } from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe('PEMObject', () => {

    // Positive tests
    it('does not throw when parsing a label that contains hyphens', () => {
        try {
            new PEMObject("YUO-DID-GRAT-JOB");
        } catch (e) {
            assert.fail(e);
        }
    });

    it('does not throw when parsing a label that contains space', () => {
        try {
            new PEMObject("YUO DID GRAT JOB");
        } catch (e) {
            assert.fail(e);
        }
    });

    // Negative tests
    it('throws when parsing a label that starts with a space', () => {
        assert.throws(() => new PEMObject(" TEST"));
    });

    it('throws when parsing a label that ends with a space', () => {
        assert.throws(() => new PEMObject("TEST "));
    });

    it('throws when parsing a label that starts with a hyphen', () => {
        assert.throws(() => new PEMObject("-TEST"));
    });

    it('throws when parsing a label that ends with a hyphen', () => {
        assert.throws(() => new PEMObject("TEST-"));
    });

    it('throws when parsing a label that contains a double hyphen', () => {
        assert.throws(() => new PEMObject("YEAHHHHH--BOOOYYYY"));
    });

    it('throws when parsing a label that contains a double space', () => {
        assert.throws(() => new PEMObject("YEAHHHHH  BOOOYYYY"));
    });

});
