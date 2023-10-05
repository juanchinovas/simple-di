import { getContainer } from "../container";
import { connect, controller, ControllerType, del, get, head, option, patch, post, put, trace } from "../service/service";

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
                options: {},
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

    it('should register a class controller with all http method supported', () => {
        @controller({version: 'v1'})
        class ControllerTestApiWithClass {
            @get()
            getAction() {}
            @post()
            postAction() {}
            @del()
            delAction() {}
            @put()
            putAction() {}
            @patch()
            patchAction() {}
            @head()
            headAction() {}
            @option()
            optionAction() {}
            @connect()
            connectAction() {}
            @trace()
            traceAction() {}
        }

        const serviceRegistered = getContainer().get<Map<string, ControllerType>>('service::controllers::map');

        expect(serviceRegistered.get("ControllerTestApiWithClass")).toEqual({
                controller: ControllerTestApiWithClass,
                options: expect.objectContaining({version: 'v1'}),
                routes: new Map ([
                    ["GET /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "getAction",
                        method: "GET",
                        options: undefined,
                        path: "/"
                    })],
                    ["POST /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "postAction",
                        method: "POST",
                        options: undefined,
                        path: "/"
                    })],
                    ["DELETE /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "delAction",
                        method: "DELETE",
                        options: undefined,
                        path: "/"
                    })],
                    ["PUT /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "putAction",
                        method: "PUT",
                        options: undefined,
                        path: "/"
                    })],
                    ["PATCH /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "patchAction",
                        method: "PATCH",
                        options: undefined,
                        path: "/"
                    })],
                    ["HEAD /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "headAction",
                        method: "HEAD",
                        options: undefined,
                        path: "/"
                    })],
                    ["OPTIONS /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "optionAction",
                        method: "OPTIONS",
                        options: undefined,
                        path: "/"
                    })],
                    ["CONNECT /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "connectAction",
                        method: "CONNECT",
                        options: undefined,
                        path: "/"
                    })],
                    ["TRACE /", expect.objectContaining({
                        controller: ControllerTestApiWithClass,
                        fnName: "traceAction",
                        method: "TRACE",
                        options: undefined,
                        path: "/"
                    })]
                ])
            });
    });

    afterAll(() => {
        getContainer().clean('service::controllers::map');
    });
});