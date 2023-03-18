import { MemberMeta, Metadata, MetadataScope } from "./metadata";
export declare function getReferenceMetadata(name: string | symbol | (new (...args: any[]) => {})): Metadata;
export declare function clearReferences(): void;
export declare function removeReference(key: string | symbol | (new (...args: any[]) => {})): boolean;
export declare function _completeClazzConstructorParams(constructParams: MemberMeta[]): any[];
export declare function _register(metadata: Partial<Metadata>): void;
export { Metadata, MetadataScope };
