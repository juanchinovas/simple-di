import { getContainer } from "../container";
import { controller, ControllerType, get, post } from "../service/service";

describe('Service', () => {
    describe('controller decorator', () => {
        it('should register a class controller with a api name', () => {
            @controller('api-service')
            class ControllerClass {}

            const serviceRegistered = getContainer().get<Map<string, ControllerType>>('service::controllers::map');
            expect(serviceRegistered.get('api-service')).toEqual(expect.objectContaining({
                controller: ControllerClass,
                options: undefined,
                routes: new Map()
            }));
        });

        it('should register a class controller with a class name', () => {
            @controller()
            class ControllerClass {}

            const serviceRegistered = getContainer().get<Map<string, ControllerType>>('service::controllers::map');
            expect(serviceRegistered.get('ControllerClass')).toEqual(expect.objectContaining({
                controller: ControllerClass,
                options: undefined,
                routes: new Map()
            }));
        });
    });


    it('should register a class controller with a class name', () => {
        @controller('/test-api')
        class ControllerTestApiClass {
            @post('/post')
            postAction() {}
        }

        const serviceRegistered = getContainer().get<Map<string, ControllerType>>('service::controllers::map');
        expect(serviceRegistered.get('/test-api')).toEqual(
            expect.objectContaining({
                controller: ControllerTestApiClass,
                options: undefined,
                routes: new Map ([
                    ["POST /post", {
                        controller: ControllerTestApiClass,
                        fnName: "postAction",
                        method: "POST",
                        options: undefined,
                        path: "/post"
                    }]
                ])
            })
        );
    });

    it('should register a class controller validation', () => {
        @controller('/validation-api', {validator: 'validator'})
        class ControllerTestApiWithValidatorClass {
            @get()
            getAction() {}
        }

        const serviceRegistered = getContainer().get<Map<string, ControllerType>>('service::controllers::map');
        expect(serviceRegistered.get('/validation-api')).toEqual({
                controller: ControllerTestApiWithValidatorClass,
                options: expect.objectContaining({validator: 'validator'}),
                routes: new Map ([
                    ["GET /", expect.objectContaining({
                        controller: ControllerTestApiWithValidatorClass,
                        fnName: "getAction",
                        method: "GET",
                        options: undefined,
                        path: "/"
                    })]
                ])
            });
    });

    it('should register a class controller method with validation and version', () => {
        @controller('/test-v1-api', {version: 'v1'})
        class ControllerTestApiWithV1Class {
            @get('/oh', {validator: 'validator'})
            getAction() {}
        }

        const serviceRegistered = getContainer().get<Map<string, ControllerType>>('service::controllers::map');
        expect(serviceRegistered.get('/test-v1-api')).toEqual({
            controller: ControllerTestApiWithV1Class,
            options: expect.objectContaining({version: 'v1'}),
            routes: new Map ([
                ["GET /oh", expect.objectContaining({
                    controller: ControllerTestApiWithV1Class,
                    fnName: "getAction",
                    method: "GET",
                    options: expect.objectContaining({validator: 'validator'}),
                    path: "/oh"
                })]
            ])
        });
    });

    afterAll(() => {
        getContainer().clean('service::controllers::map');
    });
});