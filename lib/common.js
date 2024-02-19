"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMetadata = exports._completeClazzConstructorParams = exports.getObjectType = exports.getAllDefineMetadata = exports.getDefineMetadata = exports.defineMetadata = exports.mappedKey = exports.MetadataScope = void 0;
var MetadataScope;
(function (MetadataScope) {
    MetadataScope[MetadataScope["singleton"] = 0] = "singleton";
    MetadataScope[MetadataScope["transient"] = 1] = "transient";
})(MetadataScope || (exports.MetadataScope = MetadataScope = {}));
;
exports.mappedKey = new Map();
/**
 *
 * @param { string | symbol } name
 * @param { unknown } value
 * @param { (new (...args: any[]) => {}) } target
 * @throws { Error }
 * @returns { void }
 */
function defineMetadata(name, value, target) {
    if (!target) {
        throw new Error("Target should not be null");
    }
    defineMetadataOnObject(target);
    const metadata = target[metadataSymbol];
    if (!(name in metadata)) {
        metadata[name] = value;
        return;
    }
    const data = metadata[name];
    const _valueType = getObjectType(data);
    if (_valueType !== "array") {
        metadata[name] = ([data, value]).sort((param1, param2) => param1.paramIndex - param2.paramIndex);
        return;
    }
    if (_valueType === "array") {
        data.push(value);
        data.sort((param1, param2) => param1.paramIndex - param2.paramIndex);
    }
}
exports.defineMetadata = defineMetadata;
/**
 *
 * @param { string | symbol } name
 * @param { (new (...args: any[]) => {}) } target
 * @returns {MemberMeta[] | Metadata}
 */
function getDefineMetadata(name, target) {
    const metadata = target[metadataSymbol];
    return metadata?.[name];
}
exports.getDefineMetadata = getDefineMetadata;
/**
 * Get all defined metadata of the target object and returned
 * @param {(new (...args: any[]) => {})} target
 * @returns {Record<string, MemberMeta[] | Metadata>} metadata
 */
function getAllDefineMetadata(target) {
    return target?.[metadataSymbol] ?? {};
}
exports.getAllDefineMetadata = getAllDefineMetadata;
/**
 * Get value type
 * @param {unknown} value
 * @returns "object" | "array" | "number" | "symbol" | "string"
 */
function getObjectType(value) {
    const _type = Object.prototype.toString.apply(value);
    return _type.split(/\[object\s+/i)
        .pop()
        .replace("]", "")
        .toLowerCase();
}
exports.getObjectType = getObjectType;
/**
 * Prepare class constructor and class members value
 * @param { MemberMeta[] | MemberMeta } constructParams
 * @returns { Array<MemberMeta> } class params
 */
function _completeClazzConstructorParams(constructParams) {
    if (!constructParams || constructParams.length === 0) {
        return [];
    }
    let params = constructParams;
    if (getObjectType(constructParams) !== "array") {
        params = [constructParams];
    }
    const sortedMapped = params.reduce((map, item) => map.set(item.paramIndex, item), new Map());
    const orderedParams = Array.from({ length: params[params.length - 1].paramIndex + 1 }, () => undefined)
        .map((param, i) => sortedMapped.get(i) ?? param);
    return orderedParams.length ? orderedParams : params;
}
exports._completeClazzConstructorParams = _completeClazzConstructorParams;
function removeMetadata(key) {
    const targets = key ? [exports.mappedKey.get(key)] : [...exports.mappedKey.values()];
    targets.forEach(target => {
        if (target) {
            const metadata = target[metadataSymbol];
            Object.keys(metadata).forEach(meta => delete metadata[meta]);
        }
    });
    exports.mappedKey.delete(key);
}
exports.removeMetadata = removeMetadata;
// privates
const metadataSymbol = Symbol("class:metadata");
/**
 * Define metadata property to object targe
 * @param {(new (...args: any[]) => {})} target
 * @returns void
 */
function defineMetadataOnObject(target) {
    if (target[metadataSymbol]) {
        return;
    }
    Object.defineProperty(target, metadataSymbol, {
        value: Object.create(null)
    });
}
