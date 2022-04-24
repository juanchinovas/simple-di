"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._register = exports.removeReference = exports.clearReferences = exports.getReferenceMetadata = exports.InjectorType = void 0;
var InjectorType;
(function (InjectorType) {
    InjectorType[InjectorType["singleton"] = 0] = "singleton";
    InjectorType[InjectorType["transient"] = 1] = "transient";
})(InjectorType = exports.InjectorType || (exports.InjectorType = {}));
;
function getReferenceMetadata(name) {
    let metadata = references.get(name);
    if (metadata || !name) {
        return metadata;
    }
    references.forEach(value => {
        if (value.name === name) {
            return (metadata = value);
        }
    });
    return metadata;
}
exports.getReferenceMetadata = getReferenceMetadata;
function clearReferences() {
    references.clear();
}
exports.clearReferences = clearReferences;
function removeReference(key) {
    return references.delete(key);
}
exports.removeReference = removeReference;
const references = new Map();
function _register(metadata) {
    var _a, _b, _c, _d;
    const key = (_a = metadata.key) !== null && _a !== void 0 ? _a : metadata.name;
    const previousMetadata = (_b = getReferenceMetadata(key)) !== null && _b !== void 0 ? _b : getReferenceMetadata(metadata.name);
    if (previousMetadata) {
        return _updateReferenceMetadata(previousMetadata, metadata);
    }
    references.set(key, {
        isClass: metadata.isClass,
        scope: (_c = metadata.scope) !== null && _c !== void 0 ? _c : InjectorType.transient,
        target: metadata.target,
        key: key,
        name: (_d = metadata.name) !== null && _d !== void 0 ? _d : key,
        params: _concatArray([], metadata.params),
        propeties: _concatArray([], metadata.propeties),
        value: metadata.value
    });
}
exports._register = _register;
function _updateReferenceMetadata(previousMetadata, newMetadata) {
    var _a;
    const key = (_a = newMetadata.key) !== null && _a !== void 0 ? _a : newMetadata.name;
    references.set(key, {
        isClass: newMetadata.isClass,
        scope: newMetadata.scope,
        target: newMetadata.target,
        key,
        name: newMetadata.name,
        value: newMetadata.value,
        params: _concatArray(newMetadata.params, previousMetadata.params),
        propeties: _concatArray(newMetadata.propeties, previousMetadata.propeties),
    });
    if (newMetadata.key && newMetadata.key !== previousMetadata.key) {
        references.delete(previousMetadata.key);
    }
}
function _concatArray(array1, array2) {
    let result = array2 || [];
    if (array1) {
        result = [...result, ...array1];
    }
    return result;
}
