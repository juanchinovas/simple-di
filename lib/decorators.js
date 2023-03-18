"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = exports.injectable = exports.inject = void 0;
const common_1 = require("./common");
function inject(injectableTarget) {
    return (target, propertyKey, paramIndex) => {
        const clazz = (!propertyKey && Number.isInteger(paramIndex) && target) || target.constructor;
        let metadata = (0, common_1.getReferenceMetadata)(clazz);
        if (!metadata) {
            injectable()(clazz);
            metadata = (0, common_1.getReferenceMetadata)(clazz);
        }
        const injectTarget = typeof injectableTarget === "string"
            ? injectableTarget : typeof injectableTarget === "symbol"
            ? injectableTarget : injectableTarget.name;
        // decorator in method's param
        if (propertyKey && paramIndex >= 0) {
            (0, common_1._register)({
                target: clazz,
                methods: new Map([
                    [
                        propertyKey,
                        [
                            {
                                target: injectTarget,
                                paramIndex,
                                key: propertyKey
                            }
                        ]
                    ]
                ])
            });
        }
        // decorator in construct's param
        if (!propertyKey && paramIndex >= 0) {
            (0, common_1._register)({
                target: clazz,
                constructParams: [
                    {
                        target: injectTarget,
                        paramIndex,
                        key: propertyKey
                    }
                ]
            });
        }
        // decorator in class props
        if (propertyKey && paramIndex === undefined) {
            (0, common_1._register)({
                target: clazz,
                propeties: [
                    {
                        target: injectTarget,
                        paramIndex,
                        key: propertyKey
                    }
                ]
            });
        }
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
            scope: common_1.MetadataScope.singleton,
            key: name,
            isClass: true,
            name: target.name
        });
    };
}
exports.singleton = singleton;
