import { InjectorType } from "./common";
export interface IContainer {
    register<IN>(target: (new (...args: unknown[]) => IN), scope?: InjectorType): boolean;
    register(name: string, value: any, scope?: InjectorType): boolean;
    get<OUT>(target: string): OUT;
    get<IN>(target: IN | (new (...args: unknown[]) => IN)): IN;
    factory<IN>(target: new (...args: unknown[]) => IN, dependencies?: Array<string>): IN;
    clear(): void;
}
export declare function getContainer(): IContainer;
