# PEM TypeScript Library

[![JSR](https://jsr.io/badges/@wildboar/pem)](https://jsr.io/@wildboar/pem)

This module is published both on [npmjs.com](https://npmjs.com) and
[jsr.io](https://jsr.io).

## ESM Notice

As of version 4.0.0, released on July 5th, 2025, this module is ESM-only.
CommonJS will no longer be supported.

## Building

You can build this library by running `npm run build`. `./dist/index.mjs` is
the NodeJS library, but it should also work on Deno, Cloudflare Workers, Bun,
and in browsers.

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
