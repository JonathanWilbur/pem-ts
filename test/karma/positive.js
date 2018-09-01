const PEMObject = pem.PEMObject;

const testPEM =
`-----BEGIN CERTIFICATE-----
MIICUTCCAfugAwIBAgIBADANBgkqhkiG9w0BAQQFADBXMQswCQYDVQQGEwJDTjEL
MAkGA1UECBMCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMC
VU4xFDASBgNVBAMTC0hlcm9uZyBZYW5nMB4XDTA1MDcxNTIxMTk0N1oXDTA1MDgx
NDIxMTk0N1owVzELMAkGA1UEBhMCQ04xCzAJBgNVBAgTAlBOMQswCQYDVQQHEwJD
TjELMAkGA1UEChMCT04xCzAJBgNVBAsTAlVOMRQwEgYDVQQDEwtIZXJvbmcgWWFu
ZzBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQCp5hnG7ogBhtlynpOS21cBewKE/B7j
V14qeyslnr26xZUsSVko36ZnhiaO/zbMOoRcKK9vEcgMtcLFuQTWDl3RAgMBAAGj
gbEwga4wHQYDVR0OBBYEFFXI70krXeQDxZgbaCQoR4jUDncEMH8GA1UdIwR4MHaA
FFXI70krXeQDxZgbaCQoR4jUDncEoVukWTBXMQswCQYDVQQGEwJDTjELMAkGA1UE
CBMCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMCVU4xFDAS
BgNVBAMTC0hlcm9uZyBZYW5nggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEE
BQADQQA/ugzBrjjK9jcWnDVfGHlk3icNRq0oV7Ri32z/+HQX67aRfgZu7KWdI+Ju
Wm7DCfrPNGVwFWUQOmsPue9rZBgO
-----END CERTIFICATE-----`;

describe('PEMObject', () => {
    it('encoding then decoding returns the original data', () => {
        const originalData = new Uint8Array([
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

        const pem = new PEMObject();
        pem.label = "CERTIFICATE";
        pem.data = originalData;
        pem.decode(pem.encode());
        expect(pem.data).toEqual(originalData);
    });

    it('decoding then encoding returns the original data', () => {
        const pem = new PEMObject();
        pem.label = "CERTIFICATE";
        pem.decode(testPEM);
        expect(pem.encode()).toEqual(testPEM);
    });

    it('decodes without affecting the input PEM string', () => {
        const testPEMBefore = testPEM;
        const pem = new PEMObject();
        pem.label = "CERTIFICATE";
        pem.decode(testPEM);
        expect(testPEM).toBe(testPEMBefore);
    });

    it('encodes nullpotently', () => {
        const testPEMBefore = testPEM;
        const pem = new PEMObject();
        pem.label = "CERTIFICATE";
        pem.decode(testPEM);
        expect(pem.encode()).toBe(pem.encode());
        expect(testPEM).toBe(testPEMBefore);
    });

    it('honors the base64CharactersPerLine option', () => {
        const testData = new Uint8Array([ 0x01, 0x02, 0x03, 0x04 ]);
        const pem = new PEMObject();
        pem.label = "CERTIFICATE";
        pem.data = testData;
        const originalBase64CharactersPerLine = PEMObject.base64CharactersPerLine;
        PEMObject.base64CharactersPerLine = 1;
        const encodedData = pem.encode();
        PEMObject.base64CharactersPerLine = originalBase64CharactersPerLine;
        expect(encodedData.match(/^\w$/mg).length).toBeGreaterThan(testData.length);
    });
});