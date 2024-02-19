export declare function inject(injectableTarget: string): (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => void;
export declare function inject(injectableTarget: symbol): (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => void;
export declare function inject(injectableTarget: (new (...args: unknown[]) => {})): (target: any, propertyKey?: ClassMemberDecoratorContext | string, paramIndex?: number) => void;
/**
 * Inject indicate an instance scope of a class.
 *
 * @param { (string | symbol | new (...args: unknown[]) => {}) } injectableTarget
 *
 * @returns {(target: any, propertyKey: string, paramIndex?: number) => void}
 */
export declare function injectable(name?: string | symbol): (target: any, _?: ClassDecoratorContext) => void;
/**
 * Singleton indicate an instance scope of a class.
 * @param { string | symbol } name
 * @returns { (target: ((new (...args: unknown[]) => any)), _?: ClassDecoratorContext) => void }
 */
export declare function singleton(name?: string | symbol): (target: any, _?: ClassDecoratorContext) => void;
