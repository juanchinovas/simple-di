"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = void 0;
const common_1 = require("./common");
class Container {
    constructor() { }
    register(name, value, scope = common_1.InjectorType.transient) {
        if (name && typeof name === "string") {
            (0, common_1._register)({
                value: value,
                target: value,
                key: name,
                name: value === null || value === void 0 ? void 0 : value.name,
                scope: common_1.InjectorType.singleton,
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
                name: target.name,
            });
            return true;
        }
        return false;
    }
    get(target) {
        var _a;
        if (!target) {
            throw new Error("The key shouldn't be null or undefined");
        }
        const key = (_a = target.name) !== null && _a !== void 0 ? _a : target;
        let metadata = (0, common_1.getReferenceMetadata)(key);
        if (metadata && metadata.value && metadata.scope === common_1.InjectorType.singleton) {
            return metadata.value;
        }
        if (metadata === null || metadata === void 0 ? void 0 : metadata.isClass) {
            const paramValues = metadata.params.map(param => this.get(param.target));
            const instance = new metadata.target(...paramValues);
            metadata.propeties.forEach(prop => {
                instance[prop.key] = this.get(prop.target);
            });
            return (metadata.value = instance);
        }
    }
    factory(target, dependencies) {
        if (!target) {
            throw new Error("The target instance can't be null or undefined");
        }
        try {
            return target(this);
        }
        catch (_a) {
            const dp = (dependencies === null || dependencies === void 0 ? void 0 : dependencies.map(dependecy => this.get(dependecy))) || [];
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
