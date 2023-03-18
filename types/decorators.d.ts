/**
 * Inject the indicated instance or value to the property or param in the class.
 *
 * @param { (string | symbol | new (...args: unknown[]) => {}) } injectableTarget
 *
 * @returns {(target: any, propertyKey: string, paramIndex?: number) => void}
 */
export declare function inject(injectableTarget: string): (target: any, propertyKey: string, paramIndex?: number) => void;
export declare function inject(injectableTarget: symbol): (target: any, propertyKey: string, paramIndex?: number) => void;
export declare function inject(injectableTarget: (new (...args: unknown[]) => {})): (target: any, propertyKey: string, paramIndex?: number) => void;
export declare function injectable(name?: string | symbol): (target: any) => any;
export declare function singleton(name?: string | symbol): (target: any) => void;
