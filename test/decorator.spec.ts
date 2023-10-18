import { getContainer, IContainer, inject, injectable, singleton } from "..";

describe("decorator", () => {
	let container: IContainer;
	beforeAll(() => {
		container = getContainer();
	});

	it("should register the class with transient scope", () => {
		@injectable()
		class Test {
			prop: number;
			constructor() {
				this.prop = 5;
			}
		};

		expect(container.get<Test>("Test").prop).not.toStrictEqual(container.get<Test>("Test"));
	});

	it("should register the class with key name", () => {
		@injectable("suppa")
		class TestKey {
			prop: number;
			constructor() {
				this.prop = 5;
			}
		};

		expect(container.get<TestKey>("suppa").prop).not.toStrictEqual(container.get<TestKey>("suppa"));
	});

	it("should register the class with singleton scope", () => {
		@singleton()
		class Test {
			prop: number;
			constructor() {
				this.prop = 5;
			}
		};

		expect(container.get(Test)).toStrictEqual(container.get(Test));
	});

	it("should register the class with dependency", () => {
		@singleton("Reference")
		class Test {
			prop: number;
			constructor(
				@inject("injected") public param: Record<string, unknown>
			) {
				this.prop = 5;
			}
		};
		container.register("injected", { test: "jest"});

		expect(container.get("Reference")).toEqual(expect.objectContaining({
			param: { test: "jest"}
		}));
	});

	it("should inject reference on class property", () => {
		@singleton()
		class Test {
			@inject("injected")
			prop: number;
			constructor() {}
		};
		container.register("injected", 2);

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2
		}));

	});

	it("should return an class instance by symbol", () => {
		const singletonSymbol = Symbol("Singleton");

		@singleton(singletonSymbol)
		class TestSingle {
			@inject("injected")
			prop: number;
			constructor() {}
		};
		container.register("injected", 2);

		expect(container.get(singletonSymbol)).toEqual(expect.objectContaining({
			prop: 2
		}));

	});

	it("should register the class with dependencies and create it", () => {
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
		container.register("injected", { test: "jest"});
		container.register("config", 6);

		expect(container.get(Test)).toEqual(expect.objectContaining({
			param: { test: "jest"},
			prop: 6
		}));
	});

	it("should register a class when it only use @inject decorator", () => {
		class Test {
			@inject("injected")
			prop: number;
			constructor() {}
		};
		container.register("injected", 2);

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2
		}));
	});

	it("should register a class when it only use @inject decorator multiple constructor params", () => {
		class Test {
			@inject("injected")
			prop: number;
			constructor(
				@inject("injected") public prop2: number,
				@inject("ok") public ok: string,
				@inject("okTest") public okTest: string
			) {}
		};
		container.register("injected", 2);
		container.register("injected", 2);
		container.register("okTest", "yes");
		container.register("ok", "Nope");

		expect(container.get(Test)).toEqual({
			prop: 2,
			prop2: 2,
			okTest: "yes",
			ok: "Nope"
		});
	});

	it("should create a class instance with right constructor parameters when using @inject decorator with different inject key", () => {
		class InjectKey { };

		class Test {
			@inject("injected")
			prop: number;
			constructor(
				@inject("injected5") public prop2: number,
				@inject(InjectKey) public ok: InjectKey,
				public okTest: string
			) {}

			test(@inject('pTest') pTest: string) {}
		};
		container.register("injected", 2);
		container.register("injected5", 25);
		container.register("okTest", "yes");
		container.register(InjectKey);

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: 25,
			okTest: undefined,
			ok: new InjectKey()
		}));
	});

	it("should create a class instance with right constructor parameters by position", () => {
		class Test {
			@inject("injected")
			prop: number;
			constructor(
				public prop2: number,
				@inject("ok") public ok: string,
				public okTest: string
			) {}
		};
		container.register("injected", 2);
		container.register("injected5", 25);
		container.register("okTest", "yes");
		container.register("ok", "Nope");

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: undefined,
			okTest: undefined,
			ok: "Nope"
		}));
	});

	it("should create a class instance with right constructor parameters by position #2", () => {
		class Test {
			@inject("injected")
			prop: number;
			constructor(
				public prop2: number,
				@inject("ok") public ok: string,
				@inject("okTest") public okTest: string
			) {}
		};
		container.register("injected", 2);
		container.register("injected5", 25);
		container.register("okTest", "yes");
		container.register("ok", "Nope");

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: undefined,
			okTest: "yes",
			ok: "Nope"
		}));
	});

	it("should create a class instance with right constructor parameters by position #3", () => {
		class Test {
			@inject("injected")
			prop: number;
			constructor(
				public prop2: number,
				@inject("ok") public ok: string,
				public okTest: string,
				@inject("okTest") public prop3: string
			) {}
		};
		container.register("injected", 2);
		container.register("injected5", 25);
		container.register("okTest", "yes");
		container.register("ok", "Nope");

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: undefined,
			okTest: undefined,
			prop3: "yes",
			ok: "Nope"
		}));
	});

	it("should create a class instance with right constructor parameters by position #3 using symbol", () => {
		const injSymbol =  Symbol("Test");
		class Test {
			@inject(injSymbol)
			prop: number;
			constructor(
				public prop2: number,
				@inject("ok") public ok: string,
				public okTest: string,
				@inject("okTest") public prop3: string
			) {}
		};
		container.register(injSymbol, 2);
		container.register("injected5", 25);
		container.register("okTest", "yes");
		container.register("ok", "Nope");

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: undefined,
			okTest: undefined,
			prop3: "yes",
			ok: "Nope"
		}));
	});
	
	it("should create a class instance with right constructor parameters when using @inject decorator", () => {
		const symbolKey = Symbol();

		class Test {
			@inject("injected")
			prop: number;
			constructor(
				@inject("injected5") public prop2: number,
				@inject(symbolKey) public ok: string,
				public okTest: string
			) {}
		};
		container.register("injected", 2);
		container.register("injected5", 25);
		container.register("okTest", "yes");
		container.register(symbolKey, "Aha");

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: 25,
			okTest: undefined,
			ok: "Aha"
		}));
	});

	afterEach(() => {
		container.clean();
	})
});