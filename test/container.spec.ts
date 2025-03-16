import { provide } from "../container";
import { getContainer, IContainer, injectable, MetadataScope, inject as propInject } from "../index";

describe("di", () => {
	let container: IContainer;

	beforeAll(() => {
		container = getContainer();
	});

	describe("register", () => {
		it("should register a value", () => {
			expect(container.register({name: "usefullVal", target: 5})).toBe(true);
		});
	
		it("should not register a value with null name", () => {
			expect(container.register({name: null as any, target: 5})).toBe(false);
		});
	
		it("should not register a value with empty name", () => {
			expect(container.register({name: "", target: 5})).toBe(false);
		});
	
		it("should not register a null value", () => {
			expect(container.register({name: "nullVal", target: null})).toBe(false);
		});
	
		it("should register a function as value", () => {
			expect(container.register({name: "function", target: () => console.log("hi!")})).toBe(true);
		});
	
		it("should register as singleton", () => {
			expect(container.register({name: "di", target: {}, scope: MetadataScope.singleton})).toBe(true);
		});
	
		it("should register as transient", () => {
			expect(container.register({name: "di2", target: {}, scope: MetadataScope.transient})).toBe(true);
		});
	
		it("should register a class", () => {
			class Test {}
			expect(container.register({target: Test})).toBe(true);
		});
	
		it("should register a class as singleton", () => {
			class Test {}
			expect(container.register({target: Test, scope: MetadataScope.singleton})).toBe(true);
		});
	
		it("should register a class as singleton", () => {
			class Test { constructor(public t: string) {}}
			expect(container.register({target: Test, scope: MetadataScope.singleton})).toBe(true);
		});
	
		it("should register a class as singleton with dependencies", () => {
			class Test { constructor(public t: string) {}};

			expect(container.register({target: Test, dependencies: ["V"], scope: MetadataScope.singleton})).toBe(true);
		});
	});

	describe("get", () => {
		it("returns the value 5", () => {
			container.register({name: "usefullVal", target: 5})
			expect(container.get("usefullVal")).toBe(5);
		});

		it("returns a singleton value", () => {
			class Test {
				prop: number;
				constructor() {
					this.prop = 5;
				}
			};

			container.register({target: Test});
			const instance = container.get(Test);
			
			expect(instance.prop).toEqual(5);
			expect(container.get(Test)).toEqual(instance);
		});

		it("should throw when try to get a null target", () => {
			expect(() => container.get(null)).toThrowError(new Error("The key shouldn't be null or undefined"));
		});
	});

	describe("clean", () => {
		class Test {
			prop: number;
			constructor() {
				this.prop = 5;
			}
		};

		beforeEach(() => {

			container.register(Test);
		});

		it("removes the instance", () => {
			container.clean('Test');
			expect(() => container.get(Test)).toThrow();
		});

		it("clean the container instances", () => {
			container.clean();
			expect(() => container.get(Test)).toThrow();
		});
	});

	describe("factory", () => {
		
		it("should create instance", () => {
			class Test {
				prop: number;
				constructor() {
					this.prop = 5;
				}
			};

			expect(container.factory(Test)).toBeDefined();
		});

		it("should create instance with it dependencies", () => {
			class Test {
				constructor(public dep: string[]) {}
			};

			container.register({name: "dep", target: "test"});

			expect(container.factory(Test, ["dep"])).toBeDefined();
			expect(container.factory(Test, ["dep"])).toEqual(expect.objectContaining({
				dep: "test"
			}));
		});

		it("should create instance when dependencies are null", () => {
			class Test {
				constructor(public dep: string) {}
			};

			expect(container.factory(Test, ["dep"])).toBeDefined();
			expect(container.factory(Test, ["dep"])).toEqual(expect.objectContaining({
				dep: undefined
			}));
		});

		it("should throw when dependencies are null", () => {
			expect(
				() => container.factory(null as any, ["dep"])
			).toThrow("The target instance can't be null or undefined");
		});

		it("should create instance from function callback", () => {
			class Test {
				constructor(public dep: string) {}
			};

			expect(container.factory(() => new Test('testing'))).toEqual(expect.objectContaining({
				dep: 'testing'
			}));
		});

		it("should create instance from function callback and call container", () => {
			class Test {
				constructor(public dep: string) {}
			};
			expect(container.factory((container) => {
				container.register({name: "dep", target: "test"});
				const param = container.get<string>('dep');
				return new Test(param);
			})).toEqual(expect.objectContaining({
				dep: 'test'
			}));
		});
	});

	describe("addProvider", () => {
		it("should register a provider function", () => {
			container.addProvider("Test", () => {
				return "Testing provider"
			});

			expect(container.get("Test")).toBe("Testing provider");
		});

		it("should register a provider function with symbol key", () => {
			const _symbol = Symbol("Test");
			container.addProvider(_symbol, () => {
				return "Testing provider"
			});

			expect(container.get(_symbol)).toBe("Testing provider");
		});

		it("should register a provider function and read from container a not existing value", () => {
			const _symbol = Symbol("Test");
			container.addProvider(_symbol, (container: IContainer) => {
				return ({
					prop: container.get("testProp")
				})
			});

			expect(container.get(_symbol)).toMatchObject({
				prop: undefined
			});
		});

		it("should register a provider function and read from container an existing value", () => {
			const _symbol = Symbol("Test");
			container.register({name: "testProp", target: 45})
			container.addProvider(_symbol, (container: IContainer) => {
				return ({
					prop: container.get("testProp")
				})
			});

			expect(container.get(_symbol)).toMatchObject({
				prop: 45
			});
		});
	});

	describe("provide", () => {
		it("should inject registered provider function returned value with key as string", () => {
			container.addProvider("Test", () => {
				return "Testing provider"
			});

			expect(provide("Test")).toBe("Testing provider");
		});

		it("should inject registered provider function returned value with key as symbol", () => {
			const _symbol = Symbol("Test");
			container.addProvider(_symbol, () => {
				return "Testing provider"
			});

			expect(provide(_symbol)).toBe("Testing provider");
		});

		it("should inject registered value by key as string", () => {
			container.register({name: "usefullVal", target: 5});

			expect(provide("usefullVal")).toBe(5);
		});

		it("should inject registered class instance", () => {
			class Test {
				prop: number;
				constructor() {
					this.prop = 5;
				}
			};

			container.register({target: Test});
			const instance = provide(Test);
			
			expect(instance.prop).toEqual(5);
		});

		it("should @inject class object as value to class member", () => {
			class PropValue {}
	
			@injectable()
			class Test {
				@propInject(PropValue)
				prop: PropValue;
			};
			container.register({target: PropValue});
	
			expect(provide(Test)).toEqual(expect.objectContaining({
				prop: {}
			}));
		});
	});

	afterEach(() => {
		container.clean();
	})
});