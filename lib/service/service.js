"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.trace = exports.option = exports.head = exports.patch = exports.put = exports.del = exports.post = exports.get = exports.controller = void 0;
const common_1 = require("../common");
const container_1 = require("../container");
;
;
;
;
const controllerMap = new Map();
(0, container_1.getContainer)().register("service::controllers::map", controllerMap, common_1.MetadataScope.singleton);
function controller(name, options) {
    return (target) => {
        let controllerName = target.name;
        if (typeof name === "string") {
            controllerName = name;
        }
        else {
            options = name;
        }
        if (controllerMap.has(target.name)) {
            const controllerInfo = controllerMap.get(target.name);
            controllerMap.set(controllerName, {
                controller: target,
                options: Object.assign({}, controllerInfo.options, options),
                routes: controllerInfo?.routes
            });
            if (controllerName !== target.name) {
                controllerMap.delete(target.name);
            }
        }
        else {
            controllerMap.set(controllerName, {
                controller: target,
                options,
                routes: controllerMap.get(controllerName)?.routes ?? new Map()
            });
        }
    };
}
exports.controller = controller;
function get(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "GET",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.get = get;
;
function post(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "POST",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.post = post;
;
function del(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "DELETE",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.del = del;
;
function put(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "PUT",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.put = put;
;
function patch(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "PATCH",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.patch = patch;
;
function head(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "HEAD",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.head = head;
;
function option(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "OPTIONS",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.option = option;
;
function trace(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "TRACE",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.trace = trace;
;
function connect(path = "/", options) {
    return (target, name, descriptor) => {
        __register(target.constructor.name, {
            handler: descriptor.value,
            options,
            method: "CONNECT",
            controller: target.constructor,
            path,
            fnName: name
        });
    };
}
exports.connect = connect;
;
function __register(targetCtlName, info) {
    let controllerInfo = controllerMap.get(targetCtlName);
    if (!controllerInfo) {
        controller()(info.controller);
    }
    controllerInfo = controllerInfo ?? controllerMap.get(targetCtlName);
    controllerInfo.routes.set(`${info.method} ${info.path}`, info);
}
