"use strict";
/* tslint:disable:no-implicit-dependencies */
/**
 * Barcode tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const scandit_sdk_1 = require("scandit-sdk");
ava_1.test("createFromWASMResult", t => {
    const wasmResult = {
        symbology: "qr",
        location: [[0, 0], [1, 0], [1, 1], [0, 1]],
        compositeFlag: scandit_sdk_1.Barcode.CompositeFlag.NONE,
        isGs1DataCarrier: false,
        encodingArray: []
    };
    wasmResult.rawData = new Uint8Array([]);
    t.deepEqual(scandit_sdk_1.Barcode.createFromWASMResult(wasmResult), Object.assign({}, wasmResult, { location: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 1, y: 0 },
            bottomRight: { x: 1, y: 1 },
            bottomLeft: { x: 0, y: 1 }
        }, data: "" }));
    wasmResult.rawData = new Uint8Array([97, 98, 99, 100]);
    t.deepEqual(scandit_sdk_1.Barcode.createFromWASMResult(wasmResult), Object.assign({}, wasmResult, { location: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 1, y: 0 },
            bottomRight: { x: 1, y: 1 },
            bottomLeft: { x: 0, y: 1 }
        }, data: "abcd" }));
    wasmResult.rawData = new Uint8Array([195, 164, 195, 182, 194, 181, 195, 159]);
    t.deepEqual(scandit_sdk_1.Barcode.createFromWASMResult(wasmResult), Object.assign({}, wasmResult, { location: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 1, y: 0 },
            bottomRight: { x: 1, y: 1 },
            bottomLeft: { x: 0, y: 1 }
        }, data: "äöµß" }));
    wasmResult.rawData = new Uint8Array([253, 254, 255]);
    t.deepEqual(scandit_sdk_1.Barcode.createFromWASMResult(wasmResult), Object.assign({}, wasmResult, { location: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 1, y: 0 },
            bottomRight: { x: 1, y: 1 },
            bottomLeft: { x: 0, y: 1 }
        }, data: "" }));
});
ava_1.test("Symbology.toHumanizedName", t => {
    Object.values(scandit_sdk_1.Barcode.Symbology)
        .filter(s => {
        return typeof s === "string";
    })
        .forEach(symbology => {
        t.truthy(scandit_sdk_1.Barcode.Symbology.toHumanizedName(symbology));
        t.notDeepEqual(scandit_sdk_1.Barcode.Symbology.toHumanizedName(symbology), "Unknown");
    });
    t.deepEqual(scandit_sdk_1.Barcode.Symbology.toHumanizedName("i_dont_exist"), "Unknown");
});
ava_1.test("Symbology.toJSONName", t => {
    Object.values(scandit_sdk_1.Barcode.Symbology)
        .filter(s => {
        return typeof s === "string";
    })
        .forEach(symbology => {
        t.truthy(scandit_sdk_1.Barcode.Symbology.toJSONName(symbology));
        t.notDeepEqual(scandit_sdk_1.Barcode.Symbology.toJSONName(symbology), "unknown");
    });
    t.deepEqual(scandit_sdk_1.Barcode.Symbology.toJSONName("i_dont_exist"), "unknown");
});
//# sourceMappingURL=barcode.spec.js.map