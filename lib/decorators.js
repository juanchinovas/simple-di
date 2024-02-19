"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = exports.injectable = exports.inject = void 0;
const common_1 = require("./common");
const index_1 = require("./index");
function inject(injectableTarget) {
    return (target, propertyKey, paramIndex) => {
        const clazz = (!propertyKey && Number.isInteger(paramIndex) && target) || target.constructor;
        const injectTarget = typeof injectableTarget === "string" || typeof injectableTarget === "symbol"
            ? injectableTarget : injectableTarget.name;
        // decorator in method's param
        if (propertyKey && paramIndex >= 0) {
            throw new Error("Unsupported");
        }
        // decorator in construct's param
        if (!propertyKey && paramIndex >= 0) {
            (0, common_1.defineMetadata)("class:construct:binded:params" /* BindedKey.bindedParams */, {
                target: injectTarget,
                paramIndex,
                key: propertyKey
            }, clazz);
        }
        // decorator in class props
        if (propertyKey && paramIndex === undefined) {
            (0, common_1.defineMetadata)("class:properties:binded" /* BindedKey.bindedProperties */, {
                target: injectTarget,
                paramIndex,
                key: propertyKey
            }, clazz);
        }
    };
}
exports.inject = inject;
/**
 * Inject indicate an instance scope of a class.
 *
 * @param { (string | symbol | new (...args: unknown[]) => {}) } injectableTarget
 *
 * @returns {(target: any, propertyKey: string, paramIndex?: number) => void}
 */
function injectable(name) {
    return (target, _) => {
        (0, common_1.defineMetadata)("class::instanceScope" /* BindedKey.instanceScope */, {
            key: name ?? target.name,
            isClass: true,
            scope: index_1.MetadataScope.transient
        }, target);
        common_1.mappedKey.set(name ?? target.name, target);
    };
}
exports.injectable = injectable;
/**
 * Singleton indicate an instance scope of a class.
 * @param { string | symbol } name
 * @returns { (target: ((new (...args: unknown[]) => any)), _?: ClassDecoratorContext) => void }
 */
function singleton(name) {
    return (target, _) => {
        (0, common_1.defineMetadata)("class::instanceScope" /* BindedKey.instanceScope */, {
            key: name ?? target.name,
            isClass: true,
            scope: index_1.MetadataScope.singleton
        }, target);
        common_1.mappedKey.set(name ?? target.name, target);
    };
}
exports.singleton = singleton;
