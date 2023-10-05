"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refKeys = exports.deleteMetadata = exports.readMetadata = exports.addMetadata = exports.MetadataScope = void 0;
var MetadataScope;
(function (MetadataScope) {
    MetadataScope[MetadataScope["singleton"] = 0] = "singleton";
    MetadataScope[MetadataScope["transient"] = 1] = "transient";
})(MetadataScope = exports.MetadataScope || (exports.MetadataScope = {}));
;
const mapRefs = new Map();
const weakMapRefs = new WeakMap();
function addMetadata(key, metadata) {
    if (keyType(key) === "object") {
        const keyConverted = key;
        let existing = weakMapRefs.get(keyConverted);
        if (!existing) {
            existing = {
                isClass: metadata.isClass,
                scope: metadata.scope ?? MetadataScope.transient,
                target: metadata.target,
                key: metadata.key,
                name: metadata.name,
                value: metadata.value,
                constructParams: [],
                propeties: [],
                methods: new Map()
            };
            weakMapRefs.set(keyConverted, existing);
            mapRefs.set(`@${keyConverted.name}`, keyConverted);
            if (metadata.key) {
                mapRefs.set(metadata.key, keyConverted);
            }
            return;
        }
        return void (mergeMetadata(existing, metadata));
    }
    if (typeof key === 'symbol' && mapRefs.has(`@${metadata.name}`)) {
        const stringKey = `@${metadata.name}`;
        metadata = mergeMetadata(readMetadata(stringKey), metadata);
        weakMapRefs.set(metadata.target, metadata);
        mapRefs.set(key, metadata.target);
        deleteMetadata(stringKey);
        return;
    }
    if (typeof key === 'string' && mapRefs.has(`@${key}`)) {
        const stringKey = `@${key}`;
        metadata = mergeMetadata(readMetadata(stringKey), metadata);
        weakMapRefs.set(metadata.target, metadata);
    }
    mapRefs.set(key, metadata);
}
exports.addMetadata = addMetadata;
function readMetadata(key) {
    if (keyType(key) === "object") {
        const objectMetadata = weakMapRefs.get(key);
        if (objectMetadata) {
            return objectMetadata;
        }
        deleteMetadata(key);
    }
    let ref = mapRefs.get(key);
    if (weakMapRefs.has(ref)) {
        ref = weakMapRefs.get(ref);
    }
    if (!ref && typeof key === 'string') {
        const mapKey = mapRefs.get(`@${key}`);
        ref = weakMapRefs.get(mapKey);
    }
    return ref;
}
exports.readMetadata = readMetadata;
function deleteMetadata(key) {
    if (keyType(key) === "object") {
        const metadata = weakMapRefs.get(key);
        let done = weakMapRefs.delete(metadata?.target);
        done ||= mapRefs.delete(metadata?.name);
        done ||= mapRefs.delete(`@${metadata?.name}`);
        done ||= mapRefs.delete(metadata?.key);
        return done;
    }
    let done = mapRefs.delete(key);
    if (!done) {
        const mapKey = `@${key}`;
        const mappedKey = mapRefs.get(mapKey);
        done = (mappedKey && (weakMapRefs.delete(mappedKey), mapRefs.delete(mapKey)));
    }
    return done;
}
exports.deleteMetadata = deleteMetadata;
function refKeys() {
    return mapRefs.keys();
}
exports.refKeys = refKeys;
function keyType(key) {
    const _type = Object.prototype.toString.call(key);
    switch (_type) {
        case "[object Function]":
        case "[object Object]":
            return "object";
        default:
            return "primitive";
    }
}
function _concatArray(...arrays) {
    return arrays.flat().filter(arr => arr);
}
function mergeMetadata(existing, metadata) {
    existing.isClass = metadata.isClass ?? existing.isClass;
    existing.scope = metadata.scope ?? existing.scope;
    existing.target = metadata.target ?? existing.target;
    existing.key = metadata.key ?? existing.key;
    existing.name = metadata.name ?? existing.name;
    existing.value = metadata.value ?? existing.value;
    existing.propeties = _concatArray(metadata.propeties ?? [], existing.propeties);
    existing.constructParams = _concatArray(metadata.constructParams ?? [], existing.constructParams);
    metadata.methods?.forEach((value, key) => {
        if (!existing.methods?.has(key)) {
            existing.methods.set(key, value);
        }
        else {
            existing.methods.get(key)?.push(...value);
        }
    });
    return existing;
}
