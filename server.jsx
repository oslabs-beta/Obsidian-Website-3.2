import { Application, Router } from 'https://deno.land/x/oak@v8.0.0/mod.ts';
import { React, ReactDomServer } from './deps.ts';
import App from './client/app.tsx';
import { staticFileMiddleware } from './staticFileMiddleware.ts';
// import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

var app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

const initialState = {
  obsidianSchema: {
    returnTypes: {
      Country: { kind: 'NamedType', type: 'Country' },
    },
    argTypes: {
      Country: { _id: 'ID' },
    },
    obsidianTypeSchema: {
      Country: {
        _id: { type: 'ID', scalar: true },
        name: { type: 'String', scalar: true },
        capital: { type: 'String', scalar: true },
        population: { type: 'Int', scalar: true },
        flag: { type: 'Flag', scalar: false },
        borders: { type: 'Country', scalar: false },
      },
      Flag: {
        _id: { type: 'ID', scalar: true },
        emoji: { type: 'String', scalar: true },
      },
    },
  },
};

const router = new Router();

router.get('/', handlePage);

const {files, diagnostics } = await Deno.emit('./client/client.tsx', {bundle: 'module'});

const serverrouter = new Router();

serverrouter.get('/static/client.js', (context) => {
  context.response.headers.set('Content-Type', 'text/html');
  context.response.body = files['deno:///bundle.js'];
});

app.use(staticFileMiddleware);
app.use(router.routes());
app.use(serverrouter.routes());
app.use(router.allowedMethods());

await app.listen({ hostname: "localhost", port: 8080 });

export { app };

function handlePage(ctx) {
  try {
    const body = (ReactDomServer).renderToString(<App />);
    ctx.response.body = `<!DOCTYPE html />
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
    <link rel="icon" type="image/png" href="/static/obsidianLogo3.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
    <link href="/static/prism.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <link rel="stylesheet" href="/static/style.css" />
  
    <title>Obsidian</title>
    <script>
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
  </script>
  </head>
  <body >
    <div id="root">${body}</div>

    <script  src="/static/client.js" defer></script>
  </body>
  </html>`;
  } catch (error) {
    console.error(error);
  }
}
