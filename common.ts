import { addMetadata, deleteMetadata, MemberMeta, Metadata, MetadataScope, readMetadata, refKeys } from "./metadata";

export function getReferenceMetadata(name: string | symbol | (new (...args: any[]) => {})): Metadata {
	return readMetadata<Metadata>(name as string);
}

export function clearReferences() {
	const keys = refKeys();
	for (const key of keys) {
		deleteMetadata(key as string);	
	}
}

export function removeReference(key: string | symbol | (new (...args: any[]) => {})) {
	return deleteMetadata(key as string);
}

export function _completeClazzConstructorParams(constructParams: MemberMeta[]) {
	if (!constructParams || !constructParams.length) {
		return [];
	}

	const sorted = constructParams.sort((m1, m2) => m1.paramIndex - m2.paramIndex);
	const sortedMapped = constructParams.reduce((map, item) => map.set(item.paramIndex, item), new Map<number, MemberMeta>());

	return Array.from({ length: sorted[sorted.length-1].paramIndex + 1 }, () => undefined)
		.map((param, i) => sortedMapped.get(i) ?? param);
}

export function _register(metadata: Partial<Metadata>) {
	addMetadata(metadata.key ?? metadata.target, metadata as Metadata);
}

export { Metadata, MetadataScope };