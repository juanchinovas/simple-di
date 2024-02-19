import { 
	Metadata,
	mappedKey,
	BindedKey,
	_completeClazzConstructorParams,
	removeMetadata,
	MemberMeta,
	defineMetadata,
	getAllDefineMetadata } from "./common";
import {
	MetadataScope,
	IContainer
} from "./index";

class Container implements IContainer {
	#instances: Map<string | symbol, unknown>;
	#providers: Map<string | symbol, ((container: IContainer) => void)>;

	constructor() {
		this.#instances = new Map<string | symbol, unknown>();
		this.#providers = new Map<string | symbol, ((container: IContainer) => void)>();
	}

	register<IN>(target: (new (...args: any[])=> IN), scope?: MetadataScope): boolean;
	register(name: string, value: any, scope?: MetadataScope): boolean;
	register(name: symbol, value: any, scope?: MetadataScope): boolean;
	register(name: unknown, value: any, scope: MetadataScope = MetadataScope.transient): boolean {
		if (name && ["string", "symbol"].includes(typeof name)) {
			this.#instances.set(name as string | symbol, value)

			return true;
		}

		const target = name as (new (...args: any[])=> {});
		if (!value) {
			defineMetadata(
				"class::instanceScope",
				{
					key: target.name,
					isClass: true,
					scope
				},
				target
			);

			mappedKey.set(target.name, target);

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

		// singleton instance
		if (this.#instances.has(target as string | symbol)) {
			return this.#instances.get(target as string | symbol);
		}

		// provider as singleton instance
		if (this.#providers.has(target as string | symbol)) {
			const provider = this.#providers.get(target as string | symbol);
			this.#instances.set(target as string | symbol, provider(this));

			return this.#instances.get(target as string | symbol);
		}

		// new instance
		let metadata: Record<string, MemberMeta[] | Metadata> = null;
		let clazzTarget = target as (new (...args: any[]) => {});
		if (target && ["string", "symbol"].includes(typeof target)) {
			clazzTarget = mappedKey.get(target as string | symbol);
			if (!clazzTarget) {
				return undefined;
			}

			metadata = getAllDefineMetadata(clazzTarget)
		} else {
			metadata = getAllDefineMetadata(target as (new (...args: any[]) => {}));
		}

		const instanceMetadata = metadata[BindedKey.instanceScope] as Metadata;
		if (!instanceMetadata) {
			throw new Error("Class is not injectable");
		}

		// class
		if (instanceMetadata.isClass) {
			const constructorParamsMetadata = _completeClazzConstructorParams(metadata[BindedKey.bindedParams] as MemberMeta[] ?? []);
			const constructorParamsValues = constructorParamsMetadata.map(param => (param && this.get<unknown>(param.target) || undefined));
			const targetInstance = new clazzTarget(...constructorParamsValues);

			const propertiesMetadata = _completeClazzConstructorParams(metadata[BindedKey.bindedProperties] as MemberMeta[] ?? []);
			propertiesMetadata.forEach(prop => {
				Reflect.set(targetInstance, prop.key, this.get<unknown>(prop.target));
			});

			if (instanceMetadata.scope === MetadataScope.singleton) {
				this.#instances.set(instanceMetadata.key, targetInstance);
			}

			return targetInstance;
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

	addProvider(name: string | symbol, provider: (container: IContainer) => void): void {
		this.#providers.set(name, provider);
	}

	clean(key?: string | symbol) {
		if (key) {
			this.#instances.delete(key);
			this.#providers.delete(key);
			removeMetadata(key);
			return;
		}

		this.#instances.clear();
		this.#providers.clear();
		removeMetadata();
	}
}

const container: Container = new Container();

export function getContainer(): IContainer {
	return container;
}