import { ClassType } from "./common";
import { IContainer } from "./index";
export declare function getContainer(): IContainer;
export declare function provide<T>(instanceName: string | symbol | ClassType<T>): T;
