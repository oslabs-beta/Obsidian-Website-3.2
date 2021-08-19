/** @format */

import { React, CodeBlock, dracula } from "../../../../deps.ts";

const GettingStarted = (props: any) => {
  return (
    <div className='docContainer'>
      <h1>Getting Started with ObsidianRouter</h1>
      <p>
        We're going to build the backend of our app with{" "}
        <a className='pinkA' href='https://deno.land/x/oak@v6.2.0'>
          Oak
        </a>
        , a middleware framework for your Deno server. ObsidianRouter is an{" "}
        <i>Oak router</i>, so we must build our server with Oak in order to use{" "}
        <code className='obsidianInline'>obsidian</code>.
      </p>
      <h3>Installation</h3>
      <p>
        Thanks to Deno's ECMAScript package importing, installation of Oak and{" "}
        <code className='obsidianInline'>obsidian</code> is incredibly simple.
        Just import the pieces of the modules you need at the top of your
        server, like so:
      </p>
      <CodeBlock language='typescript' showLineNumbers={true} style={dracula}>
        {`// server.tsx
import { Application, Router } from 'https://deno.land/x/oak@v6.0.1/mod.ts';
import { ObsidianRouter, gql } from 'https://deno.land/x/obsidian/mod.ts';`}
      </CodeBlock>
      <br />
      <p className='docAside'>
        <i>NOTE</i> - Throughout these guides, we will be illustrating imports
        directly from a url. It is common practice for Deno apps to utilize a
        dependencies file, usually called{" "}
        <code className='obsidianInline'>deps.ts</code>, where packages are
        imported from their urls and then referenced with local imports
        throughout the app. We recommend this approach, with the key caveat that
        your Oak import statements not be accidentally bundled with your
        client-side code, as the browser is unable to interpret any references
        to Deno. You can easily accomplish this by creating two separate
        dependency files for your server and client code.
      </p>

      <h3>ObsidianRouter Setup</h3>
      <p>
        First, make sure you've imported all necessary schemas, types and
        resolvers. When you have everything you need to create a GraphQL
        endpoint, you can do so using the following code (Note that the router
        should come <i>before</i> your{" "}
        <code className='obsidianInline'>app.listen</code>.) :
      </p>
      <CodeBlock language='tsx' showLineNumbers={true} style={dracula}>
        {`//server.ts
import { Application, Router } from 'https://deno.land/x/oak@v6.0.1/mod.ts';
import { ObsidianRouter, gql } from 'https://deno.land/x/obsidian/mod.ts';
import { resolvers } from './ import from your resolvers file'
import { types } from './ import your schema/types from schema/types file'


interface ObsRouter extends Router {
  obsidianSchema?: any;
}

const GraphQLRouter = await ObsidianRouter<ObsRouter>({
  Router,
  typeDefs: types,
  resolvers: resolvers,   
  redisPort: 6379,        //Desired redis port
  useCache: true,         //Boolean to toggle all cache functionality
  usePlayground: true,    //Boolean to allow for graphQL playground
  useQueryCache: true,    //Boolean to toogle full query cache
  useRebuildCache: true,  //Boolean to toggle rebuilding from normalized data
  customIdentifier: ["id", "__typename"]  
        
});

// attach the graphql routers routes to our app
  app.use(GraphQLRouter.routes(), GraphQLRouter.allowedMethods());


`}
      </CodeBlock>
      <br />
      <p className='docAside'>
        <i>NOTE</i> - If you are building your server in TypeScript, as we are
        here, you will have to extend the Oak Router interface to create the
        ObsidianRouter. By exposing the{" "}
        <code className='obsidianInline'>obsidianSchema</code> property on the
        ObsidianRouter, we open the door to a streamlined caching implementation
        for your client-side code, which we'll explore in{" "}
        <a href='#' onClick={() => props.setDocsPage("ServerSideRendering")}>
          server-side rendering
        </a>
        .
      </p>
      <h3>Spin Up the Server</h3>
      <p>
        It's that easy! Keep in mind that the features we're using are still
        pretty new, so we're going to have to run the server with the --unstable
        flag. The command to start up our example server would look like this:
      </p>
      <p>
        <code className='obsidianInline'>
          deno run --allow-net --unstable server.tsx
        </code>
      </p>
      <h3>GraphQL Playground</h3>
      <p>
        To test our new GraphQL endpoint, head to{" "}
        <a href='localhost:8000/graphql'>localhost:8000/graphql</a> to test your
        queries with GraphQL Playground. To learn more about this tool, check
        out their{" "}
        <a href='https://github.com/graphql/graphql-playground'>GitHub repo</a>.
      </p>
    </div>
  );
};

export default GettingStarted;
