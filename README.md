# PEM TypeScript Library

* Author: [Jonathan M. Wilbur](https://jonathan.wilbur.space) <[jonathan@wilbur.space](mailto:jonathan@wilbur.space)>
* Copyright Year: 2018
* License: [MIT License](https://mit-license.org/)
* Version: _See `version` file or git tags._
* Platform: NodeJS or Modern Web Browsers

## Building

This library requires [NodeJS](https://nodejs.org/en/) v10.3.0 or higher, mostly to support
[Regular Expression Named Capture Groups](https://github.com/tc39/proposal-regexp-named-groups).
See [this page](https://node.green/) for NodeJS ES2018 support.

You can build this library by running:

* `npm run-script build`
* `make -f build/Makefile`

The outputs will all be in `dist`.

* `./dist/web/pem.js` is the entire PEM library for the web browser, which is not minified.
* `./dist/node/pem.js` is the entire NodeJS library.

## Library Usage

### Decoding PEM Files

There are two methods in the `PEMObject` that are used for decoding PEM
objects. The first, `decode()`, only decodes a single PEM object, which must
start with the pre-encapsulation header and end with a post-encapsulation
header. (Whitespace is trimmed, so it is fine if you have a trailing newline.)

```typescript
const text : string =
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
const pem : PEMObject = new PEMObject();
pem.decode(text);
console.log(pem.label === "CERTIFICATE"); // logs "true"
console.log(pem.data); // logs the Uint8Array of bytes decoded from the base-64 data
```

The second, `parse()`, is a static method that retrieves and decodes all of the
PEM objects from a file. This is usually what you should use to decode PEM
data, as it complies strictly to [RFC 7468](https://tools.ietf.org/html/rfc7468).
This is important, because PEM files can contain explanatory text and/or
whitespace before, between, or after objects.

```typescript
const text : string =
`---OOSH, you thought this was a line? try again, bub.
-----BEGIN CERTIFICATE-----
    
 
MIICUTCCAfugAwIBAgIBADANBgkqhkiG9w0BAQQFADBXMQswCQYDVQQGEwJDTjEL
MAkGA1UECB
MCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMC
VU4xFDASBgNVBAMTC0hlcm9uZyBZYW5nMB4XDTA1MDcxNTIxMTk0N1oXDTA1MDgx
NDIxMTk0N1owVzELMAkGA1UEBhMCQ04xCzAJBgNVBAgTAlBOMQswCQYDVQQHEwJD
TjELMAkGA1UEChMCT04xCzAJBgNVBAsTAlVOMRQwEgYDVQQDEwtIZXJvbmcgWWFu
ZzBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQCp5hnG7ogBhtlynpOS21cBewKE/B7j
V14qeyslnr26xZUsSVko36ZnhiaO/zbMOoRcKK9vEcgMtcLFuQTWDl3RAgMBAAGj
gbEwga4wHQYDVR0OBBYEFFXI70krXeQDxZ
gbaCQoR4jUDncEMH8GA1UdIwR4MHaA
FFXI70krXeQDxZgbaCQoR4jUDncEoVukWTBXMQswCQYDVQQGEwJDTjELMAkGA1UE
CBMCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMCVU4xFDAS
BgNVBAMTC0hlcm9uZyBZYW5nggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEE
BQADQQA/ugzBrjjK9jcWnDVfGHlk3icNRq0oV7Ri32z/+HQX67aRfgZu7KWdI+Ju
Wm7DCfrPNGVwFWUQOmsPue9rZBgO
-----END CERTIFICATE-----
Explanatory text
-----BEGIN CERTIFICATE-----
 
MIICUTCCAfugAwIBAgIBADANBgkqhkiG9w0BAQQFADBXMQswCQYDVQQGEwJDTjEL   
MAkGA1UECBMCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMC
VU4xFDASBgNVBAMTC0hlcm9uZyBZ
YW5nMB4XDTA1MDcxNTIxMTk0N1oXDTA1MDgx
NDIxMTk0N1owVzELMAkGA1UEBhMCQ04xCzAJBgNVBAgTAlBOMQswCQYDVQQHEwJD
TjELMAkGA1UEChMCT04xCzAJBgNVBAsTAlVOMRQwEgYDVQQDEwtIZXJvbmcgWWFu
ZzBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQCp5hnG7ogBhtlynpOS21cBewKE/B7j   
V14qeyslnr26xZUsSVko36ZnhiaO/zbMOoRcKK9vEcgMtcLFuQTWDl3RAgMBAAGj
gbEwga4wHQYDVR0OBBYEFFXI70krXeQDxZgbaCQoR4jUDncEMH8GA1UdIwR4MHaA
FFXI70krXeQDxZgbaCQoR4jUDncEoVukWTBXMQswCQYDVQQGEwJDTjELMAkGA1UE
CBMCUE4xCzAJBgNVBAcTA
kNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMCVU4xFDAS
BgNVBAMTC0hlcm9uZyBZYW5nggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEE
BQADQQA/ugzBrjjK9jcWnDVfGHlk3icNRq0oV7Ri32z/+HQX67aRfgZu7KWdI+Ju
Wm7DCfrPNGVwFWUQOmsPue9rZBgO
-----END CERTIFICATE-----

 GOTTA GO FASTT

`;
const pems : PEMObject[] = PEMObject.parse(text);
console.log(pems[0].label === "CERTIFICATE"); // logs "true"
console.log(pems[1].label === "CERTIFICATE"); // logs "true"
console.log(pems[0].data); // logs the Uint8Array of bytes decoded from the base-64 data
```

### Encoding (Creating) PEM Files

Creating PEM files is simple: set the label, set the data, and access the
`encoded` property, like so:

```typescript
const pem : PEMObject = new PEMObject();
pem.label = "CERTIFICATE";
pem.data = new Uint8Array([ 0xFF, 0x00, 0xFF, 0x00 ]);
console.log(pem.encoded); // Logs the PEM encoded object
```

### Validating PEM Files

You can validate PEM object labels like so:

```typescript
const pem : PEMObject = new PEMObject();
pem.label = "CERTIFICATE";
console.log(pem.hasRFC7468CompliantLabel); // Logs "true"
pem.label = "BLORPIFICATE";
console.log(pem.hasRFC7468CompliantLabel); // Logs "false"
```

### Hacking PEM Files

I don't know why you would want to do this, but every part of the PEM file
is accessible as an accessor, like so:

```typescript
const pem : PEMObject = new PEMObject();
pem.label = "CERTIFICATE";
pem.data = new Uint8Array([ 0xFF, 0x00, 0xFF, 0x00 ]);
console.log(pem.label); // Logs "CERTIFICATE"
console.log(pem.preEncapsulationBoundary); // Logs "-----BEGIN CERTIFICATE-----"
console.log(pem.postEncapsulationBoundary); // Logs "-----END CERTIFICATE-----"
console.log(pem.encapsulatedTextPortion); // Logs the base-64 encoding of pem.data
```

## See Also

* [RFC 7468](https://tools.ietf.org/html/rfc7468)

## Contact Me

If you would like to suggest fixes or improvements on this library, please just
[leave an issue on this GitHub page](https://github.com/JonathanWilbur/pem-ts/issues). If you would like to contact me for other reasons,
please email me at [jonathan@wilbur.space](mailto:jonathan@wilbur.space)
([My GPG Key](https://jonathan.wilbur.space/downloads/jonathan@wilbur.space.gpg.pub))
([My TLS Certificate](https://jonathan.wilbur.space/downloads/jonathan@wilbur.space.chain.pem)). :boar: