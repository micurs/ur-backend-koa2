import * as Koa from 'koa';
import * as convert from 'koa-convert';
import * as json from 'koa-json';
import * as bodyparse from 'koa-bodyparser';

import { resolve, ActionContext, Routes } from 'universal-router';

import universalRouter from './koa-universal-router';

const myroutes1 = [
  {
    path: '/',
    action:  async ( { next } ) => {
      console.time('request');
      const res = await next();
      console.timeEnd('request');
      return res;
    },
    children: [
      {
        path: '/POST/',
        action:  async (ctx) => Promise.resolve({ method: ctx.req.method, message: ctx.request.body })
      },
      {
        path: '/GET/',
        action:  async (ctx) => Promise.resolve('We can resolve any HTTP methods. try /welcome')
      },
      {
        path: '/GET/welcome',
        action: async (ctx) => Promise.resolve('Welcome universal-router in koa2. Try adding a word to the path..')
      },
      {
        path: '/GET/welcome/:message',
        action: async (ctx) => Promise.resolve(`Welcome "${ctx.params['message']}" to the universal-router in koa2`)
      },
      {
        path: '/POST/welcome/:message',
        action: async (ctx) => Promise.resolve(`Thank you ${ctx.params['message']} !`)
      }]
  }
];

const myroutes2 = [
  {
    path: '/GET/second',
    action:  async (ctx) => Promise.resolve('Got to the second route!')
  }
];

/**
 * Start the server
 *
 * @export
 * @param {number} port
 */
export function start( port: number ) {
  const app: Koa = new Koa();
  app
    .use( bodyparse() )
    .use( convert( json({ pretty: false, param: 'pretty' }) ))
    .use( universalRouter(myroutes1) )
    .use( universalRouter(myroutes2) )
    .use( ( ctx ) => {
      ctx.status = 404;
      ctx.body = `Not found`;
      console.error(`${ctx.status} - ${ctx.body}`);
    })
    .on ('error', (err,ctx) => {
      console.error(`Koa2 Server Error: ${err.message}`);
      ctx.body = err.message;
    })
    .listen( port, () => console.log(`Server listening on port:${port}`) );
}
