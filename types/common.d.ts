interface MemberMeta {
    target: string;
    key: string;
    paramIndex?: number;
}
export declare enum InjectorType {
    singleton = 0,
    transient = 1
}
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
export declare function getReferenceMetadata(name: string): InjectorMetadata;
export declare function clearReferences(): void;
export declare function removeReference(key: string): boolean;
export declare function _completeClazzConstructorParams(paramMap: Map<number, MemberMeta>): any[];
export declare function _register(metadata: Partial<InjectorMetadata>): void;
export {};
