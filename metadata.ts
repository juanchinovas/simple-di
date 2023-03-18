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
	target: any;
	key: string | symbol;
	name?: string;
	value?: WeakRef<object>;
	constructParams?: Array<MemberMeta>;
	propeties?: Array<MemberMeta>;
	methods?: Map<string, Array<MemberMeta>>
}

const mapRefs = new Map<string | symbol, unknown>();
const weakMapRefs = new WeakMap<object, Metadata>();


export function addMetadata(key: string, metadata: Metadata): void;
export function addMetadata(key: symbol, metadata: Metadata): void;
export function addMetadata(key: (new (...args: any[]) => {}), metadata: Metadata): void;
export function addMetadata(
    key: string | symbol | (new (...args: any[]) => {}),
    metadata: Metadata
): void {
    if (keyType(key) === "object") {
        const keyConverted = key as (new (...args: any[]) => {});
        let existing = weakMapRefs.get(keyConverted);
        if (!existing) {
            existing = {
                isClass:            metadata.isClass,
                scope:              metadata.scope ?? MetadataScope.transient,
                target:             metadata.target,
                key:                metadata.key,
                name:               key as string || metadata.name,
                value:              metadata.value,
                constructParams:    [],
                propeties:          [],
                methods:            new Map()
            };
            weakMapRefs.set(keyConverted, existing);
            mapRefs.set(`@${keyConverted.name}`, keyConverted);
            if (metadata.key) {
                mapRefs.set(metadata.key, keyConverted);
            }
            return;
        }

        return void (mergeMetadata(existing, metadata));
    }

    if (typeof key === 'symbol' && mapRefs.has(`@${metadata.name}`)) {
        const stringKey = `@${metadata.name}`;
        metadata = mergeMetadata(readMetadata(stringKey), metadata);
        weakMapRefs.set(metadata.target, metadata);
        mapRefs.set(key as string | symbol, metadata.target);
        deleteMetadata(stringKey);
        return;
    }

    if (typeof key === 'string' && mapRefs.has(`@${key}`)) {
        const stringKey = `@${key}`;
        metadata = mergeMetadata(readMetadata(stringKey) as Metadata, metadata);
        weakMapRefs.set(metadata.target, metadata);
    }

    mapRefs.set(key as string | symbol, metadata);
}

export function readMetadata<T>(key: string): T;
export function readMetadata<T>(key: symbol): T;
export function readMetadata<T>(key: (new (...args: any[]) => {})): T;
export function readMetadata<T>(
    key: string | symbol | (new (...args: any[]) => {})
): T {
    if (keyType(key) === "object") {
        const objectMetadata = weakMapRefs.get(key as (new (...args: any[]) => {}));
        if (objectMetadata) {
            return objectMetadata as T;
        }

        deleteMetadata(key as (new (...args: any[]) => {}));
    }

    let ref = mapRefs.get(key as string | symbol);
    if (weakMapRefs.has(ref as object)) {
        ref = weakMapRefs.get(ref as object);
    }

    if (!ref && typeof key === 'string') {
        const mapKey = mapRefs.get(`@${key as string}`) as object;
        ref = weakMapRefs.get(mapKey);
    }

    return ref as T;
}

export function deleteMetadata(key: string): boolean;
export function deleteMetadata(key: symbol): boolean;
export function deleteMetadata(key: (new (...args: any[]) => {})): boolean;
export function deleteMetadata(
    key: string | symbol | (new (...args: any[]) => {})
): boolean {
    if (keyType(key) === "object") {
        const metadata = weakMapRefs.get(key as (new (...args: any[]) => {}));
        let done = weakMapRefs.delete(metadata?.target);
        done ||= mapRefs.delete(metadata?.name);
        done ||= mapRefs.delete(`@${metadata?.name}`);
        done ||= mapRefs.delete(metadata?.key);
        return done;
    }

    let done = mapRefs.delete(key as string | symbol);
    if (!done) {
        const mapKey = `@${key as string}`;
        const mappedKey = mapRefs.get(mapKey);
        done = (mappedKey && (weakMapRefs.delete(mappedKey as object), mapRefs.delete(mapKey))) || false;
    }

    return done;
}

export function refKeys() {
    return mapRefs.keys();
}

function keyType(key: unknown) {
    const _type = Object.prototype.toString.call(key);
    switch (_type) {
        case "[object Function]":
        case "[object Object]":
            return "object";
        default:
            return "primitive";
    }
}

function _concatArray(...arrays: Array<MemberMeta[]>) {
	return arrays.flat().filter(arr => arr);
}

function mergeMetadata(existing: Metadata, metadata: Metadata) {
    existing.isClass         = metadata.isClass ?? existing.isClass;
    existing.scope           = metadata.scope ?? existing.scope;
    existing.target          = metadata.target ?? existing.target;
    existing.key             = metadata.key ?? existing.key;
    existing.name            = metadata.name ?? existing.name;
    existing.value           = metadata.value ?? existing.value;
    existing.propeties       = _concatArray(metadata.propeties ?? [], existing.propeties);
    existing.constructParams = _concatArray(metadata.constructParams ?? [], existing.constructParams);
    
    metadata.methods?.forEach((value, key) => {
        if (!existing.methods?.has(key)) {
            existing.methods.set(key, value);
        } else {
            existing.methods.get(key)?.push(...value);
        }
    });

    return existing;
}
