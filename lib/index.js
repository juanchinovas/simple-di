"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = exports.injectable = exports.inject = exports.MetadataScope = exports.getContainer = void 0;
var container_1 = require("./container");
Object.defineProperty(exports, "getContainer", { enumerable: true, get: function () { return container_1.getContainer; } });
var common_1 = require("./common");
Object.defineProperty(exports, "MetadataScope", { enumerable: true, get: function () { return common_1.MetadataScope; } });
var decorators_1 = require("./decorators");
Object.defineProperty(exports, "inject", { enumerable: true, get: function () { return decorators_1.inject; } });
Object.defineProperty(exports, "injectable", { enumerable: true, get: function () { return decorators_1.injectable; } });
Object.defineProperty(exports, "singleton", { enumerable: true, get: function () { return decorators_1.singleton; } });
__exportStar(require("./service/service"), exports);
