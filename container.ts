import {
	clearReferences,
	getReferenceMetadata,
	Metadata,
	MetadataScope,
	removeReference,
	_register,
	_completeClazzConstructorParams
} from "./common";

export interface IContainer {
	/**
	 * Register a new references in the container
	 *
	 * @param target
	 * @param scope
	 * 
	 * @returns {boolean} done or not
	 */
	register<IN>(target: (new (...args: any[])=> IN), scope?: MetadataScope): boolean;
	register(name: string, value: any, scope?: MetadataScope): boolean;
	register(name: symbol, value: any, scope?: MetadataScope): boolean;
	/**
	 * Return an instances or create a new one
	 *
	 * @param target
	 * 
	 * @returns {IN|OUT} instance
	 */
	get<OUT>(target: string): OUT;
	get<OUT>(target: symbol): OUT;
	get<IN>(target: IN | (new (...args: any[]) => IN)): IN;
	/**
	 * Create a new instance of target and get the dependence params from the container using the dependencies list, if any.
	 * This function only create new instances but not save the instances in the container.
	 * 
	 * @param {new (...args: unknown[]) => IN} target
	 * @param {Array<string>} dependencies
	 * 
	 * @returns {IN} target instance
	 */

	factory<IN>(callback: (container: IContainer) => IN): IN;
	factory<IN>(target: new (...args: any[]) => IN, dependencies?: Array<string>): IN;
	/**
	 * Wipe out one or all references from the container.
	 * 
	 * @param {string} key 
	 */
	clean(key?: string): void;
}


class Container implements IContainer {
	constructor() {}

	register<IN>(target: (new (...args: any[])=> IN), scope?: MetadataScope): boolean;
	register(name: string, value: any, scope?: MetadataScope): boolean;
	register(name: symbol, value: any, scope?: MetadataScope): boolean;
	register(name: unknown, value: any, scope: MetadataScope = MetadataScope.transient): boolean {
		if (name && (typeof name === "string" || typeof name === "symbol")) {
			_register({
				value: value,
				key: name,
				scope: MetadataScope.singleton,
				isClass: false
			});

			return true;
		}

		const target = name as any;
		if (!value) {
			_register({
				target: target,
				scope: scope,
				isClass: true,
				name: target.name,
			});

			return true;
		}

		return false;
	}

	get<OUT>(target: string): OUT;
	get<OUT>(target: symbol): OUT;
	get<IN>(target: IN | (new (...args: any[]) => IN)): IN;
	get(target: unknown) {
		if (!target) {
			throw new Error("The key shouldn't be null or undefined");
		}

		const key = (target as (new (...args: any[]) => {})).name ?? target as string;
		let metadata: Metadata = getReferenceMetadata(key);
		if (metadata && metadata.value && metadata.scope === MetadataScope.singleton) {
			return (metadata.value?.deref && metadata.value?.deref?.()) || metadata.value;
		}
		if (metadata?.isClass) {
			const paramValues = _completeClazzConstructorParams(metadata.constructParams).map( param => param ? this.get(param.target) : undefined);
			const instance = new metadata.target(...paramValues);
			metadata.propeties?.forEach( prop => {
				Reflect.set(instance, prop.key, this.get(prop.target));
			});

			if (metadata.scope === MetadataScope.singleton) {
				metadata.value = new WeakRef(instance);
			}

			return instance;
		}
	}

	factory<IN>(callback: (container: IContainer) => IN): IN;
	factory<IN>(target: new (...args: any[]) => IN, dependencies?: Array<string>): IN;
	factory<IN>(target: (new (...args: unknown[]) => IN) | ((container: IContainer) => IN), dependencies?: Array<string>): IN {
		if (!target) {
			throw new Error("The target instance can't be null or undefined");
		}

		try {
			return <IN>(target as (container: IContainer) => IN)(this);
		} catch {
			const dp = dependencies?.map(dependecy => this.get(dependecy)) || [];
			return new (target as (new (...args: unknown[]) => IN))(...dp);
		}
	}

	clean(key?: string) {
		if (key) {
			return removeReference(key);
		}
		clearReferences();
	}
}

const container: Container = new Container();

export function getContainer(): IContainer {
	return container;
}