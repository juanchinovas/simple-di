"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe("decorator", () => {
    let container;
    beforeAll(() => {
        container = (0, __1.getContainer)();
    });
    it("should register the class with transient scope", () => {
        let Test = class Test {
            constructor() {
                this.prop = 5;
            }
        };
        Test = __decorate([
            (0, __1.injectable)(),
            __metadata("design:paramtypes", [])
        ], Test);
        ;
        expect(container.get("Test").prop).not.toStrictEqual(container.get("Test"));
    });
    it("should register the class with key name", () => {
        let Test = class Test {
            constructor() {
                this.prop = 5;
            }
        };
        Test = __decorate([
            (0, __1.injectable)("suppa"),
            __metadata("design:paramtypes", [])
        ], Test);
        ;
        expect(container.get("suppa").prop).not.toStrictEqual(container.get("suppa"));
    });
    it("should register the class with singleton scope", () => {
        let Test = class Test {
            constructor() {
                this.prop = 5;
            }
        };
        Test = __decorate([
            (0, __1.singleton)(),
            __metadata("design:paramtypes", [])
        ], Test);
        ;
        expect(container.get(Test)).toStrictEqual(container.get(Test));
    });
    it("should register the class with dependency", () => {
        let Test = class Test {
            constructor(param) {
                this.param = param;
                this.prop = 5;
            }
        };
        Test = __decorate([
            (0, __1.singleton)("Reference"),
            __param(0, (0, __1.inject)("injected")),
            __metadata("design:paramtypes", [Object])
        ], Test);
        ;
        container.register("injected", { test: "jest" });
        expect(container.get(Test)).toEqual(expect.objectContaining({
            param: { test: "jest" }
        }));
    });
    it("should inject reference on class property", () => {
        let Test = class Test {
            constructor() { }
        };
        __decorate([
            (0, __1.inject)("injected"),
            __metadata("design:type", Number)
        ], Test.prototype, "prop", void 0);
        Test = __decorate([
            (0, __1.singleton)(),
            __metadata("design:paramtypes", [])
        ], Test);
        ;
        container.register("injected", 2);
        expect(container.get(Test)).toEqual(expect.objectContaining({
            prop: 2
        }));
    });
    it("should register the class with dependencies and create it", () => {
        let Test = class Test {
            constructor(param) {
                this.param = param;
                this.prop = 5;
            }
        };
        __decorate([
            (0, __1.inject)("config"),
            __metadata("design:type", Number)
        ], Test.prototype, "prop", void 0);
        Test = __decorate([
            (0, __1.singleton)(),
            __param(0, (0, __1.inject)("injected")),
            __metadata("design:paramtypes", [Object])
        ], Test);
        ;
        container.register("injected", { test: "jest" });
        container.register("config", 5);
        expect(container.get(Test)).toEqual(expect.objectContaining({
            param: { test: "jest" },
            prop: 5
        }));
    });
    it("should register a class when it only use @inject decorator", () => {
        class Test {
            constructor() { }
        }
        __decorate([
            (0, __1.inject)("injected"),
            __metadata("design:type", Number)
        ], Test.prototype, "prop", void 0);
        ;
        container.register("injected", 2);
        expect(container.get(Test)).toEqual(expect.objectContaining({
            prop: 2
        }));
    });
    it("should register a class when it only use @inject decorator", () => {
        let Test = class Test {
            constructor(ok, okTest) {
                this.ok = ok;
                this.okTest = okTest;
            }
        };
        __decorate([
            (0, __1.inject)("injected"),
            __metadata("design:type", Number)
        ], Test.prototype, "prop", void 0);
        __decorate([
            (0, __1.inject)("injected"),
            __metadata("design:type", Number)
        ], Test.prototype, "prop2", void 0);
        Test = __decorate([
            __param(0, (0, __1.inject)("ok")),
            __param(1, (0, __1.inject)("okTest")),
            __metadata("design:paramtypes", [String, String])
        ], Test);
        ;
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
    });
});
