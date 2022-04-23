import { _register, InjectorType, getReferenceMetadata } from "./common";

export function inject(injectableValueName: string) {
	return (target: any, propertyKey: string, paramIndex?: number) => {
		const clazz = (Number.isInteger(paramIndex) && target) || target.constructor;
		const key = clazz.name;
		let metadata = getReferenceMetadata(key);
		if (!metadata) {
			injectable(key)(clazz);
			metadata = getReferenceMetadata(key);
		}
		
		const members = metadata[paramIndex >=0 ? "params": "propeties"];
		members.push({
			target: injectableValueName,
			paramIndex,
			key: propertyKey
		});
		metadata[paramIndex >=0 ? "params": "propeties"] = members;
	}
}

export function injectable(name?: string) {
	return (target: any) => {
		_register({
			target,
			key: name,
			isClass: true,
			name: target.name
		});
		return target;
	}
}

export function singleton(name?: string) {
	return (target: any) => {
		_register({
			target,
			scope: InjectorType.singleton,
			key: name,
			isClass: true,
			name: target.name
		});
	}
}