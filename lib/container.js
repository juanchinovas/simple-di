"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = void 0;
const common_1 = require("./common");
const index_1 = require("./index");
class Container {
    #instances;
    #providers;
    constructor() {
        this.#instances = new Map();
        this.#providers = new Map();
    }
    register(name, value, scope = index_1.MetadataScope.transient) {
        if (name && ["string", "symbol"].includes(typeof name)) {
            this.#instances.set(name, value);
            return true;
        }
        const target = name;
        if (!value) {
            (0, common_1.defineMetadata)("class::instanceScope", {
                key: target.name,
                isClass: true,
                scope
            }, target);
            common_1.mappedKey.set(target.name, target);
            return true;
        }
        return false;
    }
    get(target) {
        if (!target) {
            throw new Error("The key shouldn't be null or undefined");
        }
        // singleton instance
        if (this.#instances.has(target)) {
            return this.#instances.get(target);
        }
        // provider as singleton instance
        if (this.#providers.has(target)) {
            const provider = this.#providers.get(target);
            this.#instances.set(target, provider(this));
            return this.#instances.get(target);
        }
        // new instance
        let metadata = null;
        let clazzTarget = target;
        if (target && ["string", "symbol"].includes(typeof target)) {
            clazzTarget = common_1.mappedKey.get(target);
            if (!clazzTarget) {
                return undefined;
            }
            metadata = (0, common_1.getAllDefineMetadata)(clazzTarget);
        }
        else {
            metadata = (0, common_1.getAllDefineMetadata)(target);
        }
        const instanceMetadata = metadata["class::instanceScope" /* BindedKey.instanceScope */];
        if (!instanceMetadata) {
            throw new Error("Class is not injectable");
        }
        // class
        if (instanceMetadata.isClass) {
            const constructorParamsMetadata = (0, common_1._completeClazzConstructorParams)(metadata["class:construct:binded:params" /* BindedKey.bindedParams */] ?? []);
            const constructorParamsValues = constructorParamsMetadata.map(param => (param && this.get(param.target) || undefined));
            const targetInstance = new clazzTarget(...constructorParamsValues);
            const propertiesMetadata = (0, common_1._completeClazzConstructorParams)(metadata["class:properties:binded" /* BindedKey.bindedProperties */] ?? []);
            propertiesMetadata.forEach(prop => {
                Reflect.set(targetInstance, prop.key, this.get(prop.target));
            });
            if (instanceMetadata.scope === index_1.MetadataScope.singleton) {
                this.#instances.set(instanceMetadata.key, targetInstance);
            }
            return targetInstance;
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
    addProvider(name, provider) {
        this.#providers.set(name, provider);
    }
    clean(key) {
        if (key) {
            this.#instances.delete(key);
            this.#providers.delete(key);
            (0, common_1.removeMetadata)(key);
            return;
        }
        this.#instances.clear();
        this.#providers.clear();
        (0, common_1.removeMetadata)();
    }
}
const container = new Container();
function getContainer() {
    return container;
}
exports.getContainer = getContainer;
