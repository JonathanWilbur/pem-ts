describe('PEMObject', () => {
    it('throws when decoding a blank string', () => {
        const pem = new PEMObject();
        expect(() => pem.decode("")).toThrow();
    });

    it('throws when decoding a PEM object with a blank label', () => {
        const pem = new PEMObject();
        expect(() => pem.decode("----------\n----------")).toThrow();
    });

    it('throws when decoding a PEM object with a mismatching label and footer', () => {
        const pem = new PEMObject();
        expect(() => pem.decode("-----BEGIN BEEP-----\n-----END BOOP-----")).toThrow();
    });

    it('throws when decoding a PEM object with valid labels encoded on one line', () => {
        const pem = new PEMObject();
        expect(() => pem.decode("-----BEGIN CERT----------END CERT-----")).toThrow();
    });

    // it('throws when decoding a PEM object with blank lines between the label and footer', () => {
    //     const pem = new PEMObject();
    //     expect(() => pem.decode("-----BEGIN CERT-----\nAQI\n\nDBA\n-----END CERT-----")).toThrow();
    // });
});