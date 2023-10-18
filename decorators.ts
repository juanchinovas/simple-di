import { _register, MetadataScope, getReferenceMetadata } from "./common";
import { MemberMeta } from "./metadata";

/**
 * Inject the indicated instance or value to the property or param in the class.
 * 
 * @param { (string | symbol | new (...args: unknown[]) => {}) } injectableTarget
 * 
 * @returns {(target: any, propertyKey: string, paramIndex?: number) => void}
 */
export function inject(injectableTarget: string): (target: any, propertyKey?: string, paramIndex?: number) => void;
export function inject(injectableTarget: symbol): (target: any, propertyKey?: string, paramIndex?: number) => void;
export function inject(injectableTarget: (new (...args: unknown[]) => {})): (target: any, propertyKey: string, paramIndex?: number) => void;
export function inject(injectableTarget: string |  symbol | (new (...args: unknown[]) => {})) {
	return (target: any, propertyKey?: string, paramIndex?: number) => {
		const clazz = (!propertyKey && Number.isInteger(paramIndex) && target) || target.constructor;
		let metadata = getReferenceMetadata(clazz);
		if (!metadata) {
			injectable()(clazz);
			metadata = getReferenceMetadata(clazz);
		}

		const injectTarget = typeof injectableTarget === "string"
			? injectableTarget : typeof injectableTarget === "symbol" 
			? injectableTarget : injectableTarget.name;
		
		// decorator in method's param
		if (propertyKey && paramIndex >= 0) {
			_register({
				target: clazz,
				methods: new Map<string, MemberMeta[]>([
					[
						propertyKey,
						[
							{
								target: injectTarget,
								paramIndex,
								key: propertyKey
							}
						]
					]
				])
			});
		}

		// decorator in construct's param
		if (!propertyKey && paramIndex >= 0) {
			_register({
				target: clazz,
				constructParams: [
					{
						target: injectTarget,
						paramIndex,
						key: propertyKey
					}
				]
			});
		}

		// decorator in class props
		if (propertyKey && paramIndex === undefined) {
			_register({
				target: clazz,
				propeties: [
					{
						target: injectTarget,
						paramIndex,
						key: propertyKey
					}
				]
			});
		}
	}
}

export function injectable(name?: string | symbol) {
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

export function singleton(name?: string | symbol) {
	return (target: any) => {
		_register({
			target,
			scope: MetadataScope.singleton,
			key: name,
			isClass: true,
			name: target.name
		});
	}
}
