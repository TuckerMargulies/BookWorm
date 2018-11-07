"use strict";
/* tslint:disable:no-implicit-dependencies */
/**
 * CustomError tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const scandit_sdk_1 = require("scandit-sdk");
ava_1.test("constructor", t => {
    let ce = new scandit_sdk_1.CustomError();
    t.deepEqual(ce.name, "");
    t.deepEqual(ce.message, "");
    ce = new scandit_sdk_1.CustomError({ name: "test" });
    t.deepEqual(ce.name, "test");
    t.deepEqual(ce.message, "");
    ce = new scandit_sdk_1.CustomError({ message: "test" });
    t.deepEqual(ce.name, "");
    t.deepEqual(ce.message, "test");
    ce = new scandit_sdk_1.CustomError({ name: "test", message: "test" });
    t.deepEqual(ce.name, "test");
    t.deepEqual(ce.message, "test");
});
//# sourceMappingURL=customError.spec.js.map