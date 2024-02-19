"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadController = exports.loadControllers = exports.connect = exports.trace = exports.option = exports.head = exports.patch = exports.put = exports.del = exports.post = exports.get = exports.controller = void 0;
const common_1 = require("../common");
;
;
;
;
const mappedControllers = new Map();
function controller(name, options) {
    return (target, _) => {
        const isKeyPrimity = ["string"].includes((0, common_1.getObjectType)(name));
        const key = isKeyPrimity ? name : target.name;
        (0, common_1.defineMetadata)("class::instanceScope" /* BindedKey.instanceScope */, {
            key,
            path: isKeyPrimity ? name : "/",
            isClass: true,
            options: isKeyPrimity ? options : name,
            scope: common_1.MetadataScope.transient
        }, target);
        mappedControllers.set(key, target);
        common_1.mappedKey.set(key, target);
    };
}
exports.controller = controller;
function get(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "GET",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.get = get;
;
function post(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "POST",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.post = post;
;
function del(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "DELETE",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.del = del;
;
function put(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "PUT",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.put = put;
;
function patch(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "PATCH",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.patch = patch;
;
function head(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "HEAD",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.head = head;
;
function option(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "OPTIONS",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.option = option;
;
function trace(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "TRACE",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.trace = trace;
;
function connect(path = "/", options) {
    return (target, context, descriptor) => {
        (0, common_1.defineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, {
            method: "CONNECT",
            handler: context.access ?? descriptor.value,
            options,
            path,
            fnName: context.name ?? context
        }, target.constructor);
    };
}
exports.connect = connect;
;
function loadControllers() {
    const controllersInfo = [];
    for (const [key] of mappedControllers) {
        controllersInfo.push(loadController(key));
    }
    return controllersInfo;
}
exports.loadControllers = loadControllers;
function loadController(key) {
    const target = mappedControllers.get(key);
    const metadata = (0, common_1.getDefineMetadata)("class::instanceScope" /* BindedKey.instanceScope */, target);
    let pathMetadata = (0, common_1.getDefineMetadata)("service::controller:paths" /* BindedKey.bindedControllerPath */, target);
    if (pathMetadata && !(pathMetadata instanceof Array)) {
        pathMetadata = [pathMetadata];
    }
    return ({
        options: metadata.options,
        routes: (pathMetadata ?? []).reduce((map, meta) => (map.set(`${meta.method} ${meta.path}`, meta), map), new Map()),
        controller: target,
        path: metadata.path
    });
}
exports.loadController = loadController;
