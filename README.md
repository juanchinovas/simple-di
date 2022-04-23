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
    register<IN>(target: (new (...args: unknown[]) => IN), scope?: InjectorType): boolean;
    register(name: string, value: any, scope?: InjectorType): boolean;
    get<OUT>(target: string): OUT;
    get<IN>(target: IN | (new (...args: unknown[]) => IN)): IN;
    factory<IN>(target: new (...args: unknown[]) => IN, dependencies?: Array<string>): IN;
    clear(): void;
}
```