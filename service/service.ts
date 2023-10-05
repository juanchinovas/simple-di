import { MetadataScope } from "../common";
import { getContainer } from "../container";

export interface RouteType {
	handler: (...args: any[]) => any,
	options?: RouteOption,
	method: string,
	controller: new (...args: any[]) => any,
	path: string;
	fnName: string;
};

export interface ControllerType {
	controller: new (...args: any[]) => any,
	options?: ControllerOption;
	routes: Map<string, RouteType>
};

export interface RouteOption {
	validator?: string
};

export interface ControllerOption {
	validator?: string,
	version?: string
};

const controllerMap = new Map<string, ControllerType>();
getContainer().register("service::controllers::map", controllerMap, MetadataScope.singleton);

export function controller(): (target: new (...args: any[]) => any) => void;
export function controller(name: string | ControllerOption): (target: new (...args: any[]) => any) => void;
export function controller(name?: string, options?: ControllerOption): (target: new (...args: any[]) => any) => void;
export function controller(name?: string, options?: ControllerOption) {
	return (target: new (...args: any[]) => any) => {
		let controllerName = target.name;

		if (typeof name === "string") {
			controllerName = name;
		} else {
			options = name as ControllerOption;
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
		} else {
			controllerMap.set(controllerName, {
				controller: target,
				options,
				routes: controllerMap.get(controllerName)?.routes ?? new Map<string, RouteType>()
			});
		}
	}
}

export function get(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "GET",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function post(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "POST",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function del(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "DELETE",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function put(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "PUT",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function patch(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "PATCH",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function head(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "HEAD",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function option(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "OPTIONS",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function trace(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "TRACE",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

export function connect(path: string = "/", options?: RouteOption) {
	return (target: any, name: string, descriptor: PropertyDescriptor) => {
		__register(target.constructor.name, {
			handler: descriptor.value,
			options,
			method: "CONNECT",
			controller: target.constructor,
			path,
			fnName: name
		});
	}
};

function __register(targetCtlName: string, info: RouteType) {
	let controllerInfo = controllerMap.get(targetCtlName);
	if (!controllerInfo) {
		controller()(info.controller);
	}

	controllerInfo = controllerInfo ?? controllerMap.get(targetCtlName);
	controllerInfo.routes.set(`${info.method} ${info.path}`, info);
}

export function loadControllers(callbackFn?: (mappedControllers: Map<string, ControllerType>) => void) {
	const controllerMap = getContainer().get<Map<string, ControllerType>>("service::controllers::map");

	if (callbackFn) {
		return callbackFn(controllerMap);
	}

	return controllerMap;
}