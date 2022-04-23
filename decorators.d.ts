export declare function inject(injectableValueName: string): (target: any, propertyKey: string, paramIndex?: number) => void;
export declare function injectable(name?: string): (target: any) => any;
export declare function singleton(name?: string): (target: any) => void;
