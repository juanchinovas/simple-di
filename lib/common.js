"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._register = exports._completeClazzConstructorParams = exports.removeReference = exports.clearReferences = exports.getReferenceMetadata = exports.InjectorType = void 0;
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
function _completeClazzConstructorParams(paramMap) {
    if (!paramMap || !paramMap.size) {
        return [];
    }
    const keys = [...paramMap.keys()].sort((p1, p2) => p2 - p1);
    const _params = Array.from({ length: keys[0] + 1 }, () => undefined);
    return _params.map((param, i) => { var _a; return (_a = paramMap.get(i)) !== null && _a !== void 0 ? _a : param; });
}
exports._completeClazzConstructorParams = _completeClazzConstructorParams;
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
        paramMap: new Map(),
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
        paramMap: previousMetadata.paramMap,
        propeties: _concatArray(newMetadata.propeties, previousMetadata.propeties),
    });
    if (newMetadata.key && newMetadata.key !== previousMetadata.key) {
        references.delete(previousMetadata.key);
    }
}
function _concatArray(...arrays) {
    return arrays.flat().filter(arr => arr);
}
