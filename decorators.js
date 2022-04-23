"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = exports.injectable = exports.inject = void 0;
const common_1 = require("./common");
function inject(injectableValueName) {
    return (target, propertyKey, paramIndex) => {
        const clazz = (Number.isInteger(paramIndex) && target) || target.constructor;
        const key = clazz.name;
        let metadata = (0, common_1.getReferenceMetadata)(key);
        if (!metadata) {
            injectable(key)(clazz);
            metadata = (0, common_1.getReferenceMetadata)(key);
        }
        const members = metadata[paramIndex >= 0 ? "params" : "propeties"];
        members.push({
            target: injectableValueName,
            paramIndex,
            key: propertyKey
        });
        metadata[paramIndex >= 0 ? "params" : "propeties"] = members;
    };
}
exports.inject = inject;
function injectable(name) {
    return (target) => {
        (0, common_1._register)({
            target,
            key: name,
            isClass: true,
            name: target.name
        });
        return target;
    };
}
exports.injectable = injectable;
function singleton(name) {
    return (target) => {
        (0, common_1._register)({
            target,
            scope: common_1.InjectorType.singleton,
            key: name,
            isClass: true,
            name: target.name
        });
    };
}
exports.singleton = singleton;
