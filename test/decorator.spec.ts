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
		class Test {
			prop: number;
			constructor() {
				this.prop = 5;
			}
		};

		expect(container.get<Test>("suppa").prop).not.toStrictEqual(container.get<Test>("suppa"));
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

		expect(container.get(Test)).toEqual(expect.objectContaining({
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
		container.register("config", 5);

		expect(container.get(Test)).toEqual(expect.objectContaining({
			param: { test: "jest"},
			prop: 5
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

	it("should register a class when it only use @inject decorator", () => {
		class Test {
			@inject("injected")
			prop: number;
			@inject("injected")
			prop2: number;
			constructor(
				@inject("ok") public ok: string,
				@inject("okTest") public okTest: string
			) {}
		};
		container.register("injected", 2);
		container.register("injected", 2);
		container.register("okTest", "yes");
		container.register("ok", "Nope");

		expect(container.get(Test)).toEqual(expect.objectContaining({
			prop: 2,
			prop2: 2,
			ok: "yes",
			okTest: "Nope"
		}));
	});

	afterEach(() => {
		container.clear();
	})
});