export interface MemberMeta {
    target: string | symbol;
    key: string;
    paramIndex?: number;
}
export declare enum MetadataScope {
    singleton = 0,
    transient = 1
}
export interface Metadata {
    isClass: boolean;
    scope: MetadataScope;
    target: any;
    key: string | symbol;
    name?: string;
    value?: WeakRef<object>;
    constructParams?: Array<MemberMeta>;
    propeties?: Array<MemberMeta>;
    methods?: Map<string, Array<MemberMeta>>;
}
export declare function addMetadata(key: string, metadata: Metadata): void;
export declare function addMetadata(key: symbol, metadata: Metadata): void;
export declare function addMetadata(key: (new (...args: any[]) => {}), metadata: Metadata): void;
export declare function readMetadata<T>(key: string): T;
export declare function readMetadata<T>(key: symbol): T;
export declare function readMetadata<T>(key: (new (...args: any[]) => {})): T;
export declare function deleteMetadata(key: string): boolean;
export declare function deleteMetadata(key: symbol): boolean;
export declare function deleteMetadata(key: (new (...args: any[]) => {})): boolean;
export declare function refKeys(): IterableIterator<string | symbol>;
