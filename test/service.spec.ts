import { getContainer } from "../container";
import { connect, controller, del, get, head, loadController, loadControllers, option, patch, post, put, trace } from "../service/service";

describe('Service', () => {

    describe('controller decorator', () => {
        it('should register a class controller with a api name', () => {
            @controller('api-service')
            class ControllerClass {}

            expect(loadController('api-service')).toEqual(expect.objectContaining({
                controller: ControllerClass,
                options: undefined,
                routes: new Map()
            }));
        });

        it('should register a class controller with a class name', () => {
            @controller()
            class ControllerClass {}

            expect(loadController('ControllerClass')).toEqual(expect.objectContaining({
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

        expect(loadController('/test-api')).toEqual(
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

        expect(loadController('/validation-api')).toEqual({
                controller: ControllerTestApiWithValidatorClass,
                options: expect.objectContaining({validator: 'validator'}),
                path: '/validation-api',
                routes: new Map ([
                    ["GET /", expect.objectContaining({
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

        expect(loadController('/test-v1-api')).toEqual({
            controller: ControllerTestApiWithV1Class,
            options: expect.objectContaining({version: 'v1'}),
            path: '/test-v1-api',
            routes: new Map ([
                ["GET /oh", expect.objectContaining({
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

        expect(loadController("ControllerTestApiWithClass")).toEqual({
                controller: ControllerTestApiWithClass,
                options: expect.objectContaining({version: 'v1'}),
                path: "/",
                routes: new Map ([
                    ["GET /", expect.objectContaining({
                        fnName: "getAction",
                        method: "GET",
                        options: undefined,
                        path: "/"
                    })],
                    ["POST /", expect.objectContaining({
                        fnName: "postAction",
                        method: "POST",
                        options: undefined,
                        path: "/"
                    })],
                    ["DELETE /", expect.objectContaining({
                        fnName: "delAction",
                        method: "DELETE",
                        options: undefined,
                        path: "/"
                    })],
                    ["PUT /", expect.objectContaining({
                        fnName: "putAction",
                        method: "PUT",
                        options: undefined,
                        path: "/"
                    })],
                    ["PATCH /", expect.objectContaining({
                        fnName: "patchAction",
                        method: "PATCH",
                        options: undefined,
                        path: "/"
                    })],
                    ["HEAD /", expect.objectContaining({
                        fnName: "headAction",
                        method: "HEAD",
                        options: undefined,
                        path: "/"
                    })],
                    ["OPTIONS /", expect.objectContaining({
                        fnName: "optionAction",
                        method: "OPTIONS",
                        options: undefined,
                        path: "/"
                    })],
                    ["CONNECT /", expect.objectContaining({
                        fnName: "connectAction",
                        method: "CONNECT",
                        options: undefined,
                        path: "/"
                    })],
                    ["TRACE /", expect.objectContaining({
                        fnName: "traceAction",
                        method: "TRACE",
                        options: undefined,
                        path: "/"
                    })]
                ])
            });
    });


    it('should load all controllers registered', () => {
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

        expect(loadControllers()).toEqual(expect.arrayContaining([{
            controller: ControllerTestApiWithClass,
            options: expect.objectContaining({version: 'v1'}),
            path: "/",
            routes: new Map ([
                ["GET /", expect.objectContaining({
                    fnName: "getAction",
                    method: "GET",
                    options: undefined,
                    path: "/"
                })],
                ["POST /", expect.objectContaining({
                    fnName: "postAction",
                    method: "POST",
                    options: undefined,
                    path: "/"
                })],
                ["DELETE /", expect.objectContaining({
                    fnName: "delAction",
                    method: "DELETE",
                    options: undefined,
                    path: "/"
                })],
                ["PUT /", expect.objectContaining({
                    fnName: "putAction",
                    method: "PUT",
                    options: undefined,
                    path: "/"
                })],
                ["PATCH /", expect.objectContaining({
                    fnName: "patchAction",
                    method: "PATCH",
                    options: undefined,
                    path: "/"
                })],
                ["HEAD /", expect.objectContaining({
                    fnName: "headAction",
                    method: "HEAD",
                    options: undefined,
                    path: "/"
                })],
                ["OPTIONS /", expect.objectContaining({
                    fnName: "optionAction",
                    method: "OPTIONS",
                    options: undefined,
                    path: "/"
                })],
                ["CONNECT /", expect.objectContaining({
                    fnName: "connectAction",
                    method: "CONNECT",
                    options: undefined,
                    path: "/"
                })],
                ["TRACE /", expect.objectContaining({
                    fnName: "traceAction",
                    method: "TRACE",
                    options: undefined,
                    path: "/"
                })]
            ])
        }]));
    });

    afterAll(() => {
        getContainer().clean();
    });
});