import * as Koa from 'koa';
import { resolve, ActionContext, Routes } from 'universal-router';

export default function universalRouter( routes ) {
  return async ( ctx, next ) => {
    try {
      if ( ctx.path.indexOf(`/${ctx.method}`) !== 0 ) {
        ctx.path = `/${ctx.method}${ctx.path}`; // Add the HTTP method as root in the path
      }
      ctx.body = await resolve<Koa.Context, Promise<any> >(routes, ctx );
      console.log(ctx.body);
    }
    catch( err ) {
      await next();
    }
  }
}
