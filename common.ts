export interface MemberMeta {
	target: string | symbol;
	key: string;
	paramIndex?: number;
}

export enum MetadataScope {
	singleton,
	transient
};

export interface Metadata {
	isClass: boolean;
	scope: MetadataScope;
	key: string | symbol;
}

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
	 * Add a provider function 
	 * @param { string | symbol } name 
	 * @param { (container: IContainer) => void } provider 
	 */
	addProvider(name: string | symbol, provider: (container: IContainer) => void): void;

	/**
	 * Wipe out one or all references from the container and metadata from object.
	 * 
	 * @param {string} key 
	 */
	clean(key?: string | symbol): void;
}

export const mappedKey = new Map<string | symbol, (new (...args: any[]) => {})>();

export const enum BindedKey {
	instanceScope = "class::instanceScope",
	bindedParams = "class:construct:binded:params",
	bindedProperties = "class:properties:binded",
	bindedController = "service::controller:info",
	bindedControllerPath = "service::controller:paths",
}

/**
 * 
 * @param { string | symbol } name 
 * @param { unknown } value 
 * @param { (new (...args: any[]) => {}) } target
 * @throws { Error }
 * @returns { void }
 */
export function defineMetadata(name: string | symbol, value: unknown, target: (new (...args: any[]) => {})): void {
	if (!target) {
		throw new Error("Target should not be null");
	}

	defineMetadataOnObject(target);

	const metadata = target[metadataSymbol];
	if (!(name in metadata)) {
		metadata[name] = value;
		return;
	}

	const data = metadata[name];
	const _valueType = getObjectType(data);
	if (_valueType !== "array") {
		metadata[name] = ([data, value]).sort((param1, param2) => param1.paramIndex - param2.paramIndex);
		return;
	}
	
	if (_valueType === "array") {
		data.push(value);
		(data as MemberMeta[]).sort((param1, param2) => param1.paramIndex - param2.paramIndex);
	}
}

/**
 * 
 * @param { string | symbol } name 
 * @param { (new (...args: any[]) => {}) } target 
 * @returns {MemberMeta[] | Metadata}
 */
export function getDefineMetadata(name: string | symbol, target: (new (...args: any[]) => {})): MemberMeta[] | Metadata {
	const metadata = target[metadataSymbol];

	return metadata?.[name];
}

/**
 * Get all defined metadata of the target object and returned
 * @param {(new (...args: any[]) => {})} target 
 * @returns {Record<string, MemberMeta[] | Metadata>} metadata
 */
export function getAllDefineMetadata(target: (new (...args: any[]) => {})): Record<string, MemberMeta[] | Metadata> {
	return target?.[metadataSymbol] ?? {};
}

/**
 * Get value type
 * @param {unknown} value 
 * @returns "object" | "array" | "number" | "symbol" | "string"
 */
export function getObjectType(value: unknown): "object" | "array" | "number" | "symbol" | "string" {
	const _type = Object.prototype.toString.apply(value) as string;
	return _type.split(/\[object\s+/i)
		.pop()
		.replace("]", "")
		.toLowerCase() as ("object" | "array" | "number" | "symbol" | "string");
}

/**
 * Prepare class constructor and class members value
 * @param { MemberMeta[] | MemberMeta } constructParams 
 * @returns { Array<MemberMeta> } class params
 */
export function _completeClazzConstructorParams(constructParams: MemberMeta[] | MemberMeta): MemberMeta[] {
	if (!constructParams || (constructParams as MemberMeta[]).length === 0) {
		return [];
	}

	let params = constructParams as MemberMeta[];
	if (getObjectType(constructParams) !== "array") {
		params = [constructParams as MemberMeta];
	}

	const sortedMapped = params.reduce((map, item) => map.set(item.paramIndex, item), new Map<number, MemberMeta>());

	const orderedParams = Array.from({ length: params[params.length-1].paramIndex + 1 }, () => undefined)
		.map((param, i) => sortedMapped.get(i) ?? param);

	return orderedParams.length ? orderedParams : params;
}

export function removeMetadata(key?: string | symbol) {
	const targets = key ? [mappedKey.get(key)] : [ ...mappedKey.values() ];
	targets.forEach(target => {
		if (target) {
			const metadata = target[metadataSymbol];
			Object.keys(metadata).forEach(meta => delete metadata[meta]);
		}
	});
	mappedKey.delete(key);
}

// privates

const metadataSymbol = Symbol("class:metadata");

/**
 * Define metadata property to object targe
 * @param {(new (...args: any[]) => {})} target 
 * @returns void
 */
function defineMetadataOnObject(target: (new (...args: any[]) => {})): void {
	if (target[metadataSymbol]) {
		return;
	}

	Object.defineProperty(target, metadataSymbol, {
		value: Object.create(null)
	});
}
