
interface MemberMeta {
	target: string;
	key: string;
	paramIndex?: number;
}

export enum InjectorType {
	singleton,
	transient
};

export interface InjectorMetadata {
	isClass: boolean;
	scope: InjectorType;
	target: any;
	key: string;
	name?: string;
	value?: any;
	paramMap?: Map<number, MemberMeta>;
	propeties?: Array<MemberMeta>;
}

export function getReferenceMetadata(name: string): InjectorMetadata {
	let metadata = references.get(name);
	if(metadata || !name) {
		return metadata;
	}

	references.forEach( value => {
		if (value.name === name) {
			return (metadata = value);
		}
	});

	return metadata;
}

export function clearReferences() {
	references.clear();
}

export function removeReference(key: string) {
	return references.delete(key);
}

export function _completeClazzConstructorParams(paramMap: Map<number, MemberMeta>) {
	if (!paramMap || !paramMap.size) {
		return [];
	}

	const keys = [...paramMap.keys()].sort((p1, p2) => p2 - p1);
	const _params = Array.from({ length: keys[0] + 1 }, () => undefined);

	return _params.map((param, i) => paramMap.get(i) ?? param);
}

const references: Map<string, InjectorMetadata>  = new Map<string, InjectorMetadata>();
export function _register(metadata: Partial<InjectorMetadata>) {
	const key = metadata.key ?? metadata.name;
	const previousMetadata: InjectorMetadata = getReferenceMetadata(key) ?? getReferenceMetadata(metadata.name);

	if (previousMetadata) {
		return _updateReferenceMetadata(previousMetadata, metadata);
	}
	
	references.set(key, {
		isClass: metadata.isClass,
		scope: metadata.scope ?? InjectorType.transient,
		target: metadata.target,
		key: key,
		name: metadata.name ?? key,
		paramMap: new Map<number, MemberMeta>(),
		propeties: _concatArray([], metadata.propeties),
		value: metadata.value
	});
}

function _updateReferenceMetadata(previousMetadata: InjectorMetadata, newMetadata: Partial<InjectorMetadata>) {
	const key = newMetadata.key ?? newMetadata.name;

	references.set(key, {
		isClass: newMetadata.isClass,
		scope: newMetadata.scope,
		target: newMetadata.target,
		key,
		name: newMetadata.name,
		value: newMetadata.value,
		paramMap: previousMetadata.paramMap,
		propeties: _concatArray(newMetadata.propeties, previousMetadata.propeties),
	});

	if (newMetadata.key && newMetadata.key !== previousMetadata.key) {
		references.delete(previousMetadata.key);
	}
}

function _concatArray(...arrays: Array<MemberMeta[]>) {
	return arrays.flat().filter(arr => arr);
}