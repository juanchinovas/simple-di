import { BindedKey, MetadataScope, defineMetadata, getDefineMetadata, getObjectType, mappedKey } from "../common";

export interface RouteType {
	handler: (...args: any[]) => any,
	options?: RouteOption,
	method: string,
	path: string;
	fnName: string;
};

export interface ControllerType {
	controller: new (...args: any[]) => any,
	options?: ControllerOption;
	routes: Map<string, RouteType>,
	path: string
};

export interface RouteOption {
	validator?: string
};

export interface ControllerOption {
	validator?: string,
	version?: string
};

const mappedControllers = new Map<string, new (...args: any[]) => any>();

export function controller(): (target: any, _?: ClassDecoratorContext) => void;
export function controller(name: string | ControllerOption): (target: any, _?: ClassDecoratorContext) => void;
export function controller(name?: string, options?: ControllerOption): (target: any, _?: ClassDecoratorContext) => void;
export function controller(name?: string, options?: ControllerOption) {
	return (target: any, _?: ClassDecoratorContext) => {
		const isKeyPrimity = ["string"].includes(getObjectType(name));
		const key = isKeyPrimity ? name : target.name;

		defineMetadata(
			BindedKey.instanceScope,
			{
				key,
				path: isKeyPrimity ? name : "/", 
				isClass: true,
				options: isKeyPrimity ? options : name,
				scope: MetadataScope.transient
			},
			target
		);

		mappedControllers.set(key, target);
		mappedKey.set(key, target);
	}
}

export function get(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "GET",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function post(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "POST",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function del(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "DELETE",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function put(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "PUT",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function patch(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "PATCH",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function head(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "HEAD",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function option(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "OPTIONS",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function trace(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "TRACE",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function connect(path: string = "/", options?: RouteOption) {
	return (target: any, context: ClassMethodDecoratorContext | string, descriptor?: PropertyDescriptor) => {
		defineMetadata(
			BindedKey.bindedControllerPath,
			{
				method: "CONNECT",
				handler: (context as ClassMethodDecoratorContext).access ?? descriptor.value,
				options,
				path,
				fnName: (context as ClassMethodDecoratorContext).name ?? context as string
			},
			target.constructor
		);
	}
};

export function loadControllers(): ControllerType[] {
	const controllersInfo:ControllerType[]  = [];
	for (const [key] of mappedControllers) {
		controllersInfo.push(loadController(key));
	}

	return controllersInfo;
}

export function loadController(key: string): ControllerType {
	const target = mappedControllers.get(key);
	
	const metadata = getDefineMetadata(BindedKey.instanceScope, target) as any;
	let pathMetadata = getDefineMetadata(BindedKey.bindedControllerPath, target) as any;
	if (pathMetadata && !(pathMetadata instanceof Array)) {
		pathMetadata = [pathMetadata];
	}
	
	return ({
		options: metadata.options as ControllerOption,
		routes: (pathMetadata as RouteType[] ?? []).reduce((map, meta) => (map.set(`${meta.method} ${meta.path}`, meta), map), new Map<string, RouteType>()),
		controller: target,
		path: metadata.path
	}) as ControllerType;
}
