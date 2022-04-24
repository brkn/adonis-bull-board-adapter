import {
  AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType,
} from "@bull-board/api/dist/typings/app";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HTTPMethods } from "fastify";

type Params = {
  basePath: string,
  statics: { path: string; route: string },
  routeDef: AppViewRoute,
  viewPath: string;
  errorHandler: (error: Error) => ControllerHandlerReturnType
  bullBoardQueues: BullBoardQueues;
  routes: AppControllerRoute[]
};

type FastifyRouteDef = {
  method: HTTPMethods;
  route: string;
  handler: AppControllerRoute["handler"];
};

export class AdonisAdapter {
  private basePath: string;
  private bullBoardQueues: BullBoardQueues;
  private errorHandler: ((error: Error) => ControllerHandlerReturnType);
  private statics: { path: string; route: string };
  private viewPath: string;
  private entryRoute: { method: HTTPMethods; routes: string[]; filename: string };
  private apiRoutes: Array<FastifyRouteDef>;

  constructor({
    basePath,
    statics,
    routeDef,
    viewPath,
    errorHandler,
    bullBoardQueues,
    routes,
  }: Params) {
    this.basePath = basePath;
    this.statics = statics;
    this.viewPath = viewPath;
    this.errorHandler = errorHandler;
    this.bullBoardQueues = bullBoardQueues;

    const { name } = routeDef.handler();
    this.entryRoute = {
      method: routeDef.method.toUpperCase() as HTTPMethods,
      routes: ([] as string[]).concat(routeDef.route),
      filename: name,
    };

    this.apiRoutes = routes.reduce((result, routeRaw) => {
      const innerRoutes = Array.isArray(routeRaw.route) ? routeRaw.route : [routeRaw.route];
      const methods = Array.isArray(routeRaw.method) ? routeRaw.method : [routeRaw.method];

      innerRoutes.forEach((route) => {
        result.push({
          method: methods.map((method) => method.toUpperCase()) as unknown as HTTPMethods,
          route,
          handler: routeRaw.handler,
        });
      });

      return result;
    }, [] as FastifyRouteDef[]);
  }

  // eslint-disable-next-line class-methods-use-this
  public registerPlugin() {
  }
}
