module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rfc7468CompliantPEMHeaders", function() { return rfc7468CompliantPEMHeaders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PEMError", function() { return PEMError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PEMObject", function() { return PEMObject; });
const rfc7468CompliantPEMHeaders = [
    "X509 CERTIFICATE",
    "CERTIFICATE",
    "CERTIFICATE PAIR",
    "TRUSTED CERTIFICATE",
    "NEW CERTIFICATE REQUEST",
    "CERTIFICATE REQUEST",
    "X509 CRL",
    "ANY PRIVATE KEY",
    "PUBLIC KEY",
    "RSA PRIVATE KEY",
    "RSA PUBLIC KEY",
    "DSA PRIVATE KEY",
    "DSA PUBLIC KEY",
    "PKCS7",
    "PKCS #7 SIGNED DATA",
    "ENCRYPTED PRIVATE KEY",
    "PRIVATE KEY",
    "DH PARAMETERS",
    "SSL SESSION PARAMETERS",
    "DSA PARAMETERS",
    "ECDSA PUBLIC KEY",
    "EC PARAMETERS",
    "EC PRIVATE KEY",
    "PARAMETERS",
    "CMS",
    "ATTRIBUTE CERTIFICATE"
];
class PEMError extends Error {
    constructor(m) {
        super(m);
    }
}
class PEMObject {
    constructor() {
        this.header = "";
        this.data = new Uint8Array(0);
    }
    get hasRFC7468CompliantHeader() {
        return rfc7468CompliantPEMHeaders.includes(this.header);
    }
    decode(encoded) {
        const lines = encoded.trim().split("\n");
        if (lines.length <= 2)
            throw new PEMError("PEM is too small to be valid");
        if (lines[0].indexOf("-----BEGIN ") !== 0)
            throw new PEMError("PEM object did not start with '-----BEGIN '");
        if (!lines[0].endsWith("-----"))
            throw new PEMError("PEM object did not end with '-----'");
        const header = lines[0].slice(11, (lines[0].length - 5));
        if (lines[(lines.length - 1)].indexOf("-----END ") !== 0)
            throw new PEMError("Last line of PEM object did not start with '-----END '");
        if (!lines[(lines.length - 1)].endsWith("-----"))
            throw new PEMError("Last line of PEM object did not end with '-----'");
        const footer = lines[(lines.length - 1)].slice(9, (lines[(lines.length - 1)].length - 5));
        if (header !== footer)
            throw new PEMError("PEM object header does not match footer");
        this.header = header;
        const base64data = lines.slice(1, (lines.length - 1)).join("");
        if (typeof TextEncoder !== "undefined") {
            this.data = (new TextEncoder()).encode(atob(base64data));
        }
        else if (typeof Buffer !== "undefined") {
            this.data = Buffer.from(base64data, "base64");
        }
        else {
            throw new PEMError("Unable to decode PEM data from Base-64.");
        }
    }
    encode() {
        let ret = [`-----BEGIN ${this.header}-----`];
        let base64data = "";
        if (typeof TextDecoder !== "undefined") {
            base64data = btoa((new TextDecoder("utf-8")).decode(this.data));
        }
        else if (typeof Buffer !== "undefined") {
            base64data = (new Buffer(this.data)).toString("base64");
        }
        else {
            throw new PEMError("Unable to encode PEM data to Base-64.");
        }
        const stringSplitter = new RegExp(".{1," + PEMObject.base64CharactersPerLine + "}", "g");
        ret = ret.concat(base64data.match(stringSplitter) || []);
        ret.push(`-----END ${this.header}-----`);
        return ret.join("\n");
    }
}
PEMObject.base64CharactersPerLine = 64;
let pem = new PEMObject();
pem.header = "CERTIFICATE";
pem.data = new Uint8Array([
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
pem.decode(pem.encode());
console.log(pem.data);


/***/ })
/******/ ]);