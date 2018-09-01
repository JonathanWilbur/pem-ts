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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rfc7468CompliantPEMLabels", function() { return rfc7468CompliantPEMLabels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PEMError", function() { return PEMError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PEMObject", function() { return PEMObject; });
const rfc7468CompliantPEMLabels = [
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
        this._label = "";
        this.data = new Uint8Array(0);
    }
    get label() {
        PEMObject.validateLabel(this._label);
        return this._label;
    }
    set label(value) {
        PEMObject.validateLabel(value);
        this._label = value;
    }
    get hasRFC7468CompliantLabel() {
        return rfc7468CompliantPEMLabels.includes(this.label);
    }
    get preEncapsulationBoundary() {
        return `-----BEGIN ${this.label}-----`;
    }
    get postEncapsulationBoundary() {
        return `-----END ${this.label}-----`;
    }
    static validateLabel(label) {
        if (!label.match(/^[A-Z# ]*$/g))
            throw new PEMError("Malformed PEM label.");
        if (label.match(/\s\s/g))
            throw new PEMError("PEM label cannot contain consecutive spaces.");
        if (label.match(/--/g))
            throw new PEMError("PEM label cannot contain consecutive hyphen-minuses.");
        if (label.match(/^\s+/g) || label.match(/\s+$/g))
            throw new PEMError("PEM label cannot begin or end with spaces.");
        if (label.match(/^\-+/g) || label.match(/\-+$/g))
            throw new PEMError("PEM label cannot begin or end with hyphen-minuses.");
    }
    decode(encoded) {
        const lines = encoded.trim().split("\n");
        if (lines.length <= 2)
            throw new PEMError("PEM is too small to be valid");
        if (lines[0].indexOf("-----BEGIN ") !== 0)
            throw new PEMError("PEM object did not start with '-----BEGIN '");
        if (!lines[0].endsWith("-----"))
            throw new PEMError("PEM object did not end with '-----'");
        const preEncapsulationBoundaryLabel = lines[0].slice(11, (lines[0].length - 5));
        if (lines[(lines.length - 1)].indexOf("-----END ") !== 0)
            throw new PEMError("Last line of PEM object did not start with '-----END '");
        if (!lines[(lines.length - 1)].endsWith("-----"))
            throw new PEMError("Last line of PEM object did not end with '-----'");
        const postEncapsulationBoundaryLabel = lines[(lines.length - 1)].slice(9, (lines[(lines.length - 1)].length - 5));
        if (preEncapsulationBoundaryLabel !== postEncapsulationBoundaryLabel)
            throw new PEMError("PEM object Pre-encapsulation Boundary label does not match Post-encapsulation Boundary label.");
        this.label = preEncapsulationBoundaryLabel;
        lines.slice(1, (lines.length - 1)).forEach(line => {
            if (line.match(/^\s*$/))
                throw new PEMError("Blank lines detected within PEM data");
        });
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
        let ret = [this.preEncapsulationBoundary];
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
        ret.push(this.postEncapsulationBoundary);
        return ret.join("\n");
    }
}
PEMObject.base64CharactersPerLine = 64;


/***/ })
/******/ ]);