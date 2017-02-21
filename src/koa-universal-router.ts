import * as Koa from 'koa';
import { resolve, ActionContext, Routes } from 'universal-router';


export default function universalRouter( routes ) {
  return async function urResolver( ctx, next ) {
    try {
      if ( ctx.path.indexOf(`/${ctx.method}`) !== 0 )
        ctx.path = `/${ctx.method}${ctx.path}`;
      ctx.body = await resolve<Koa.Context, Promise<any> >(routes, ctx );
      console.log(ctx.body);
    }
    catch( err ) {
      // ctx.status = err.statusCode;
      // ctx.body = `${err.statusCode} ${err.message}`;
      // console.error(ctx.body);
      await next();
    }
  }
}
