import { getContainer, IContainer, InjectorType } from "..";

describe("di", () => {
	let container: IContainer;

	beforeAll(() => {
		container = getContainer();
	});

	describe("register", () => {
		it("should register a value", () => {
			expect(container.register("usefullVal", 5)).toBe(true);
		});
	
		it("should not register a value with null name", () => {
			expect(container.register(null, 5)).toBe(false);
		});
	
		it("should not register a value with empty name", () => {
			expect(container.register("", 5)).toBe(false);
		});
	
		it("should register a null value", () => {
			expect(container.register("nullVal", null)).toBe(true);
		});
	
		it("should register a function as value", () => {
			expect(container.register("function", () => console.log("hi!"))).toBe(true);
		});
	
		it("should register as singleton", () => {
			expect(container.register("di", {}, InjectorType.singleton)).toBe(true);
		});
	
		it("should register as transient", () => {
			expect(container.register("di2", {}, InjectorType.transient)).toBe(true);
		});
	
		it("should register a class", () => {
			expect(container.register(class Test {})).toBe(true);
		});
	
		it("should register a class as singleton", () => {
			expect(container.register(class Test {}, InjectorType.singleton)).toBe(true);
		});
	});

	describe("get", () => {
		it("returns the value 5", () => {
			container.register("usefullVal", 5)
			expect(container.get("usefullVal")).toBe(5);
		});

		it("returns a singleton value", () => {
			class Test {
				prop: number;
				constructor() {
					this.prop = 5;
				}
			};

			container.register(Test);
			const instance = container.get(Test);
			
			expect(instance.prop).toEqual(5);
			expect(container.get(Test)).toEqual(instance);
		});

		it("should throw when try to get a null target", () => {
			expect(() => container.get(null)).toThrowError(new Error("The key shouldn't be null or undefined"));
		});
	});

	describe("clear", () => {
		it("returns undefined when not instance registered", () => {
			class Test {
				prop: number;
				constructor() {
					this.prop = 5;
				}
			};

			container.register(Test);
			container.clear();
			
			expect(container.get(Test)).not.toBeDefined();
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
				constructor(public dep: string) {}
			};

			container.register("dep", "test");

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
				() => container.factory(null, ["dep"])
			).toThrowError(new Error("The target instance can't be null or undefined"));
		});
	});

	afterEach(() => {
		container.clear();
	})
});