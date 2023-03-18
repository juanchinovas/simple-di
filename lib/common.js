"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataScope = exports._register = exports._completeClazzConstructorParams = exports.removeReference = exports.clearReferences = exports.getReferenceMetadata = void 0;
const metadata_1 = require("./metadata");
Object.defineProperty(exports, "MetadataScope", { enumerable: true, get: function () { return metadata_1.MetadataScope; } });
function getReferenceMetadata(name) {
    return (0, metadata_1.readMetadata)(name);
}
exports.getReferenceMetadata = getReferenceMetadata;
function clearReferences() {
    const keys = (0, metadata_1.refKeys)();
    for (const key of keys) {
        (0, metadata_1.deleteMetadata)(key);
    }
}
exports.clearReferences = clearReferences;
function removeReference(key) {
    return (0, metadata_1.deleteMetadata)(key);
}
exports.removeReference = removeReference;
function _completeClazzConstructorParams(constructParams) {
    if (!constructParams || !constructParams.length) {
        return [];
    }
    const sorted = constructParams.sort((m1, m2) => m1.paramIndex - m2.paramIndex);
    const sortedMapped = constructParams.reduce((map, item) => map.set(item.paramIndex, item), new Map());
    return Array.from({ length: sorted[sorted.length - 1].paramIndex + 1 }, () => undefined)
        .map((param, i) => sortedMapped.get(i) ?? param);
}
exports._completeClazzConstructorParams = _completeClazzConstructorParams;
function _register(metadata) {
    (0, metadata_1.addMetadata)(metadata.key ?? metadata.target, metadata);
}
exports._register = _register;
