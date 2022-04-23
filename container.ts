import { clearReferences, getReferenceMetadata, InjectorMetadata, InjectorType, _register } from "./common";

export interface IContainer {
	register<IN>(target: (new (...args: unknown[])=> IN), scope?: InjectorType): boolean;
	register(name: string, value: any, scope?: InjectorType): boolean;
	get<OUT>(target: string): OUT;
	get<IN>(target: IN | (new (...args: unknown[]) => IN)): IN;
	factory<IN>(target: new (...args: unknown[]) => IN, dependencies?: Array<string>): IN;
	clear(): void;
}


class Container implements IContainer {
	constructor() {}

	register<IN>(target: (new (...args: unknown[])=> IN), scope?: InjectorType): boolean;
	register(name: string, value: any, scope?: InjectorType): boolean
	register(name: unknown, value: any, scope: InjectorType = InjectorType.transient): boolean {
		if (name && typeof name === "string") {
			_register({
				value: value,
				target: value,
				key: name,
				name: value?.name,
				scope: InjectorType.singleton,
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
	get<IN>(target: IN | (new (...args: unknown[]) => IN)): IN;
	get(target: unknown) {
		if (!target) {
			throw new Error("The key shouldn't be null or undefined");
		}

		const key = (target as any).name ?? target;
		let metadata: InjectorMetadata = getReferenceMetadata(key);
		if (metadata && metadata.value && metadata.scope === InjectorType.singleton) {
			return metadata.value;
		}
		if (metadata?.isClass) {
			const paramValues = metadata.params.map( param => this.get(param.target));
			const instance = new metadata.target(...paramValues);
			metadata.propeties.forEach( prop => {
				instance[prop.key] = this.get(prop.target);
			});

			return (metadata.value = instance);
		}
	}

	factory<IN>(target: new (...args: unknown[]) => IN, dependencies: Array<string> = null): IN {
		if (!target) {
			throw new Error("The target instance can't be null or undefined");
		}

		const dp = dependencies?.map(dependecy => this.get(dependecy)) || [];
		return new target(...dp);
	}

	clear() {
		clearReferences();
	}
}

const container: Container = new Container();

export function getContainer(): IContainer {
	return container;
}