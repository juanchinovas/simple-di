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
    register<IN>(target: (new (...args: any[]) => IN), scope?: MetadataScope): boolean;
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
export declare const mappedKey: Map<string | symbol, new (...args: any[]) => {}>;
export declare const enum BindedKey {
    instanceScope = "class::instanceScope",
    bindedParams = "class:construct:binded:params",
    bindedProperties = "class:properties:binded",
    bindedController = "service::controller:info",
    bindedControllerPath = "service::controller:paths"
}
/**
 *
 * @param { string | symbol } name
 * @param { unknown } value
 * @param { (new (...args: any[]) => {}) } target
 * @throws { Error }
 * @returns { void }
 */
export declare function defineMetadata(name: string | symbol, value: unknown, target: (new (...args: any[]) => {})): void;
/**
 *
 * @param { string | symbol } name
 * @param { (new (...args: any[]) => {}) } target
 * @returns {MemberMeta[] | Metadata}
 */
export declare function getDefineMetadata(name: string | symbol, target: (new (...args: any[]) => {})): MemberMeta[] | Metadata;
/**
 * Get all defined metadata of the target object and returned
 * @param {(new (...args: any[]) => {})} target
 * @returns {Record<string, MemberMeta[] | Metadata>} metadata
 */
export declare function getAllDefineMetadata(target: (new (...args: any[]) => {})): Record<string, MemberMeta[] | Metadata>;
/**
 * Get value type
 * @param {unknown} value
 * @returns "object" | "array" | "number" | "symbol" | "string"
 */
export declare function getObjectType(value: unknown): "object" | "array" | "number" | "symbol" | "string";
/**
 * Prepare class constructor and class members value
 * @param { MemberMeta[] | MemberMeta } constructParams
 * @returns { Array<MemberMeta> } class params
 */
export declare function _completeClazzConstructorParams(constructParams: MemberMeta[] | MemberMeta): MemberMeta[];
export declare function removeMetadata(key?: string | symbol): void;
