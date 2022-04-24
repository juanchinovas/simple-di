
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
	params?: Array<MemberMeta>;
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
		params: _concatArray([], metadata.params),
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
		params: _concatArray(newMetadata.params, previousMetadata.params),
		propeties: _concatArray(newMetadata.propeties, previousMetadata.propeties),
	});

	if (newMetadata.key && newMetadata.key !== previousMetadata.key) {
		references.delete(previousMetadata.key);
	}
}

function _concatArray(array1: Array<MemberMeta>, array2: Array<MemberMeta>) {
	let result = array2 || [];
	if (array1) {
		result = [...result, ...array1];
	}

	return result;
}