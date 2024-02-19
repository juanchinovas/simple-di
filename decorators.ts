import { BindedKey, mappedKey, defineMetadata } from "./common";
import { MetadataScope } from "./index";


export function inject(injectableTarget: string): (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => void;
export function inject(injectableTarget: symbol): (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => void;
export function inject(injectableTarget: (new (...args: unknown[]) => {})): (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => void;
export function inject(injectableTarget: string |  symbol | (new (...args: unknown[]) => {})) {
	return (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => {
		const clazz = (!propertyKey && Number.isInteger(paramIndex) && target) || target.constructor;
		const injectTarget = typeof injectableTarget === "string" || typeof injectableTarget === "symbol" 
			? injectableTarget : injectableTarget.name;

		
		// decorator in method's param
		if (propertyKey && paramIndex >= 0) {
			throw new Error("Unsupported");
		}

		// decorator in construct's param
		if (!propertyKey && paramIndex >= 0) {
			defineMetadata(
				BindedKey.bindedParams,
				{
					target: injectTarget,
					paramIndex,
					key: propertyKey
				},
				clazz
			);
		}

		// decorator in class props
		if (propertyKey && paramIndex === undefined) {
			defineMetadata(
				BindedKey.bindedProperties,
				{
					target: injectTarget,
					paramIndex,
					key: propertyKey
				},
				clazz
			);
		}
	}
}


/**
 * Inject indicate an instance scope of a class.
 * 
 * @param { (string | symbol | new (...args: unknown[]) => {}) } injectableTarget
 * 
 * @returns {(target: any, propertyKey: string, paramIndex?: number) => void}
 */
export function injectable(name?: string | symbol): (target: any, _?: ClassDecoratorContext) => void {
	return (target: any, _?: ClassDecoratorContext) => {
		defineMetadata(
			BindedKey.instanceScope,
			{
				key: name ?? target.name,
				isClass: true,
				scope: MetadataScope.transient
			},
			target
		);

		mappedKey.set(name ?? target.name, target);
	}
}

/**
 * Singleton indicate an instance scope of a class.
 * @param { string | symbol } name 
 * @returns { (target: ((new (...args: unknown[]) => any)), _?: ClassDecoratorContext) => void }
 */
export function singleton(name?: string | symbol): (target: any, _?: ClassDecoratorContext) => void {
	return (target: any, _?: ClassDecoratorContext) => {
		defineMetadata(
			BindedKey.instanceScope,
			{
				key: name ?? target.name,
				isClass: true,
				scope: MetadataScope.singleton
			},
			target
		);

		mappedKey.set(name ?? target.name, target);
	}
}
