import { defineMetadata, getDefineMetadata, getAllDefineMetadata } from "../common";

describe("common.ts", () => {

    describe("defineMetadata", () => {

        it("should define primitive metadatas in class", () => {
            class MetadataTarget { }
            const _symbol = Symbol("");
            defineMetadata("test_number", 12, MetadataTarget);
            defineMetadata("test_string", "testing", MetadataTarget);
            defineMetadata("test_symbol", _symbol, MetadataTarget);
            defineMetadata("test_undefinen", undefined, MetadataTarget);
            const metadata = getAllDefineMetadata(MetadataTarget);

            expect(metadata).toMatchObject({
                test_number: 12,
                test_string: "testing",
                test_symbol: _symbol,
                test_undefinen: undefined
            })
        });

        it("should define array metadatas in class", () => {
            class MetadataTarget { }
            const _symbol = Symbol("");
            defineMetadata("test", 12, MetadataTarget);
            defineMetadata("test", "testing", MetadataTarget);
            defineMetadata("test", _symbol, MetadataTarget);
            defineMetadata("test", undefined, MetadataTarget);
            const metadata = getAllDefineMetadata(MetadataTarget);

            expect(metadata).toMatchObject({
                test: [12, "testing", _symbol, undefined ]
            });
        });

        it("should define object metadatas in class", () => {
            class MetadataTarget { }
            const _object = {};
            defineMetadata("test", _object, MetadataTarget);
            const metadata = getAllDefineMetadata(MetadataTarget);

            expect(metadata).toMatchObject({
                test: _object
            });
        });

        it("should throw when try to define metadata with not target", () => {
            expect(() => defineMetadata("test", "", null as any)).toThrow("Target should not be null");
        });
    });

    describe("getAllDefineMetadata", () => {
        it("should return all defined metadata in a class", () => {
            class MetadataTarget { }
            const _object = {};
            defineMetadata("test", _object, MetadataTarget);
            const metadata = getAllDefineMetadata(MetadataTarget);

            expect(metadata).toMatchObject({
                test: _object
            });
        });

        it("should return empty object when not metadata defined in a class", () => {
            class MetadataTarget { }
            const metadata = getAllDefineMetadata(MetadataTarget);

            expect(metadata).toMatchObject({});
        });
    });

    describe("getDefineMetadata", () => {
        it("should return an undefined when not metadata was defined", () => {
            class MetadataTarget { }
            const metadata = getDefineMetadata("__metadata__", MetadataTarget);

            expect(metadata).toBeUndefined();
        });

        it("should return the metadata by name", () => {
            class MetadataTarget { }
            defineMetadata("__metadata__", 12,  MetadataTarget)
            const metadata = getDefineMetadata("__metadata__", MetadataTarget);

            expect(metadata).toBe(12);
        });
    });

});