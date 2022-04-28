import { RouteContract, RouterContract, RouteHandler } from "@ioc:Adonis/Core/Route";
import {
  AppControllerRoute,
  AppViewRoute,
  BullBoardQueues,
  ControllerHandlerReturnType,
  IServerAdapter,
} from "@bull-board/api/dist/typings/app";
import BullBoardException from "./BullBoardException";

export class AdonisAdapter implements IServerAdapter {
  private basePath = "";
  private bullBoardQueues: BullBoardQueues | undefined;
  private errorHandler:
  | ((error: Error) => ControllerHandlerReturnType)
  | undefined;
  private statics: { path: string; route: string } | undefined;
  private viewPath: string | undefined;
  private entryRoute:
  | { method: string; routes: string[]; filename: string }
  | undefined;
  private apiRoutes: RouteContract[] | undefined;

  constructor(private readonly AdonisRouter: RouterContract) {}

  public setBasePath(path: string): AdonisAdapter {
    this.basePath = path;

    return this;
  }

  public setStaticPath(
    staticsRoute: string,
    staticsPath: string,
  ): AdonisAdapter {
    this.statics = { route: staticsRoute, path: staticsPath };

    return this;
  }

  public setViewsPath(viewPath: string): AdonisAdapter {
    this.viewPath = viewPath;

    return this;
  }

  public setErrorHandler(
    errorHandler: (error: Error) => ControllerHandlerReturnType,
  ) {
    this.errorHandler = errorHandler;

    return this;
  }

  public setApiRoutes(bullBoardRoutes: AppControllerRoute[]): AdonisAdapter {
    this.apiRoutes = bullBoardRoutes
      .map((bullBoardRoute) => {
        const routes = Array.isArray(bullBoardRoute.route)
          ? bullBoardRoute.route
          : [bullBoardRoute.route];
        const methods = Array.isArray(bullBoardRoute.method)
          ? bullBoardRoute.method
          : [bullBoardRoute.method];

        const routeHandler: RouteHandler = async (ctx) => {
          try {
            await bullBoardRoute.handler();
          } catch (error) {
            if (!this.errorHandler) {
              return;
            }

            const {
              status,
              body: errorBody,
            } = this.errorHandler(error as Error);

            ctx.response.status(status || 500).send(errorBody);
          }
        };

        return routes.map((route) => this.AdonisRouter.route(route, methods, routeHandler));
      }).flat(2);

    return this;
  }

  public setEntryRoute(routeDef: AppViewRoute): AdonisAdapter {
    const { name } = routeDef.handler();

    this.entryRoute = {
      method: routeDef.method.toUpperCase(),
      routes: Array.isArray(routeDef.route) ? routeDef.route : [routeDef.route],
      filename: name,
    };

    return this;
  }

  public setQueues(bullBoardQueues: BullBoardQueues): AdonisAdapter {
    this.bullBoardQueues = bullBoardQueues;

    return this;
  }
}
