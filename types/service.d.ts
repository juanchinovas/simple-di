export interface RouteType {
    handler: (...args: any[]) => any;
    options?: RouteOption;
    Type: string;
    controller: new (...args: any[]) => any;
    path: string;
}
export interface ControllerType {
    controller: new (...args: any[]) => any;
    options?: ControllerOption;
    routes: Map<string, RouteType>;
}
export interface RouteOption {
    validator?: string;
}
export interface ControllerOption {
    validator?: string;
    version?: string;
}
export declare function controller(name?: string, options?: ControllerOption): (target: new (...args: any[]) => any) => void;
export declare function get(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function post(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function del(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function put(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function patch(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function head(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function option(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function trace(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
export declare function connect(path?: string, options?: RouteOption): (target: any, _: string, descriptor: PropertyDescriptor) => void;
