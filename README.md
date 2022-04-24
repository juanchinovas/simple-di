# Simple-di

Yet another Simple dependency injection module for small, personal JS project.

> npm install @sunacchi/simple-di

```typescript
export { inject, injectable, singleton, InjectorType, IContainer, getContainer } from "@sunacchi/simple-di";
```

## Using `@decorator`
```typescript
@singleton()
class Test {
	@inject("config")
	prop: number;
	constructor(
		@inject("injected") public param: Record<string, unknown>
	) {
		this.prop = 5;
	}
};
```
```typescript
@injectable()
class Test {
	@inject("config")
	prop: number;
	constructor(
		@inject("injected") public param: Record<string, unknown>
	) {
		this.prop = 5;
	}
};
```
## using `Container` class
```typescript
export interface IContainer {
    /**
     * Register a new references in the container
     *
     * @param target
     * @param scope
     *
     * @returns {boolean} done or not
     */
    register<IN>(target: (new (...args: unknown[]) => IN), scope?: InjectorType): boolean;
    register(name: string, value: any, scope?: InjectorType): boolean;
    /**
     * Return an instances or create a new one
     *
     * @param target
     *
     * @returns {IN|OUT} instance
     */
    get<OUT>(target: string): OUT;
    get<IN>(target: IN | (new (...args: unknown[]) => IN)): IN;
    /**
     * Create a new instance of target and get the dependence params from the container using the dependencies list, if any.
     * This function only create new instances but not save the instances in the container.
     *
     * @param {new (...args: unknown[]) => IN} target
     * @param {Array<string>} dependencies
     *
     * @returns {IN} target instance
     */
    factory<IN>(target: new (...args: unknown[]) => IN, dependencies?: Array<string>): IN;
    /**
     * Wipe out one or all references from the container.
     *
     * @param {string} key
     */
    clean(key?: string): void;
}
```