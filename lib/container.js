"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = void 0;
const common_1 = require("./common");
class Container {
    constructor() { }
    register(name, value, scope = common_1.MetadataScope.transient) {
        if (name && (typeof name === "string" || typeof name === "symbol")) {
            (0, common_1._register)({
                value: value,
                key: name,
                scope: common_1.MetadataScope.singleton,
                isClass: false
            });
            return true;
        }
        const target = name;
        if (!value) {
            (0, common_1._register)({
                target: target,
                scope: scope,
                isClass: true,
                name: target.name
            });
            return true;
        }
        return false;
    }
    get(target) {
        if (!target) {
            throw new Error("The key shouldn't be null or undefined");
        }
        const key = target.name ?? target;
        let metadata = (0, common_1.getReferenceMetadata)(key);
        if (metadata && metadata.value && metadata.scope === common_1.MetadataScope.singleton) {
            const reference = (metadata.value?.deref && metadata.value?.deref?.()) || metadata.value;
            if (reference && !(reference instanceof WeakRef)) {
                return reference;
            }
        }
        if (metadata?.isClass) {
            const paramValues = (0, common_1._completeClazzConstructorParams)(metadata.constructParams).map(param => param ? this.get(param.target) : undefined);
            const instance = new metadata.target(...paramValues);
            metadata.propeties?.forEach(prop => {
                Reflect.set(instance, prop.key, this.get(prop.target));
            });
            if (metadata.scope === common_1.MetadataScope.singleton) {
                metadata.value = new WeakRef(instance);
            }
            return instance;
        }
    }
    factory(target, dependencies) {
        if (!target) {
            throw new Error("The target instance can't be null or undefined");
        }
        try {
            return target(this);
        }
        catch {
            const dp = dependencies?.map(dependecy => this.get(dependecy)) || [];
            return new target(...dp);
        }
    }
    clean(key) {
        if (key) {
            return (0, common_1.removeReference)(key);
        }
        (0, common_1.clearReferences)();
    }
}
const container = new Container();
function getContainer() {
    return container;
}
exports.getContainer = getContainer;
