describe('PEMObject', () => {

    // Positive tests
    it('does not throw when parsing a label that contains hyphens', () => {
        expect(() => new PEMObject("YUO-DID-GRAT-JOB")).toBeTruthy();
    });

    it('does not throw when parsing a label that contains space', () => {
        expect(() => new PEMObject("YUO DID GRAT JOB")).toBeTruthy();
    });

    it('recognizes valid RFC 7468 labels', () => {
        const pem = new PEMObject("CERTIFICATE");
        expect(pem.hasRFC7468CompliantLabel).toBe(true);
    });

    it('recognizes invalid RFC 7468 labels', () => {
        const pem = new PEMObject("BLORTIFICATE");
        expect(pem.hasRFC7468CompliantLabel).toBe(false);
    });

    // Negative tests
    it('throws when parsing a label that starts with a space', () => {
        expect(() => new PEMObject(" TEST")).toThrow();
    });

    it('throws when parsing a label that ends with a space', () => {
        expect(() => new PEMObject("TEST ")).toThrow();
    });

    it('throws when parsing a label that starts with a hyphen', () => {
        expect(() => new PEMObject("-TEST")).toThrow();
    });

    it('throws when parsing a label that ends with a hyphen', () => {
        expect(() => new PEMObject("TEST-")).toThrow();
    });

    it('throws when parsing a label that contains a double hyphen', () => {
        expect(() => new PEMObject("YEAHHHHH--BOOOYYYY")).toThrow();
    });

    it('throws when parsing a label that contains a double space', () => {
        expect(() => new PEMObject("YEAHHHHH  BOOOYYYY")).toThrow();
    });

});