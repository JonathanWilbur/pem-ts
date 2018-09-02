describe('The PEMObject Regular Expression', () => {
    it('decodes a single normal PEM object correctly', () => {
        const match = testPEM.match(PEMObject.pemObjectRegex);
        expect(match).toBeTruthy();
    });
});