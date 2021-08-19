/** @format */

import { React, CodeBlock, dracula } from "../../../deps.ts";

const QuickStart = (props: any) => {
  return (
    <div className='docContainer'>
      <h1>Quick Start</h1>
      <p>
        <code className='obsidianInline'>obsidian</code> is Deno's first native
        GraphQL caching client and server module. Boasting lightning-fast
        caching and fetching capabilities alongside headlining normalization and
        destructuring strategies,{" "}
        <code className='obsidianInline'>obsidian</code> is equipped to support
        scalable, highly performant applications.
      </p>
      <p>
        Optimized for use in server-side rendered React apps built with Deno,
        full stack integration of{" "}
        <code className='obsidianInline'>obsidian</code> enables many of its
        most powerful features, including optimized caching exchanges between
        client and server and extremely lightweight client-side caching.
      </p>
      <h2>Docker File for Full Demo</h2>
      <p>
        {" "}
        If you would like to see Obsidian in action you can run the Docker Image
        of our Demo server
      </p>
      <h2>Demo Git Repository</h2>
      <p>
        There is also a small demo server availible on git hub if you want to
        see how Obsidian is implemented in a functioning server
      </p>

      <h2>Adding Obsidian Cacheing tool to a GraphQL server</h2>
      <p>
        Obsidian Acts as an extrention to the Oak Router, so implementing
        Obsidian is as easy as importing the Obsidian Router, and Oak Router and
        extending the Oak Router with Obsidian.
      </p>
      <p>
        The Code below will extend the Oak router and will server the /graphql
        endpoint for any querys.
      </p>
      <CodeBlock language='typescript' showLineNumbers={true} style={dracula}>
        {`import { Application, Router } from "https://deno.land/x/oak@v6.0.1/mod.ts";
import { ObsidianRouter, gql } from "https://deno.land/x/obsidian/mod.ts";

const PORT = 8000; 
const app = new Application();

interface ObsRouter extends Router {
    obsidianSchema?: any;
    }
          
const GraphQLRouter = await ObsidianRouter<ObsRouter>({
Router,
typeDefs: types,        // declare imported types object here
resolvers: resolvers,   // declare imported resolvers object here
redisPort: 6379,        //Desired redis port
useCache: true,         //Boolean to toggle all cache functionality
usePlayground: true,    //Boolean to allow for graphQL playground
useQueryCache: true,    //Boolean to toogle full query cache
useRebuildCache: true,  //Boolean to toggle rebuilding from normalized data
customIdentifier: ["id", "__typename"]  
    //customIdentifier is by default set to id + typename and is used to
    //create the unique hash for storing data in the cache
    //this can be set by the user to be different feilds that are expected
    //on the response from graphQL server, but must create a unique hash for
    //proper storage and retrieval from cache 
                  
});

// now we attach the graphql router routes to our app
app.use(GraphQLRouter.routes(), GraphQLRouter.allowedMethods());
          

app.addEventListener("listen", () => {
  console.log(\`listening on localhost:\${PORT}\`);
});

await app.listen({ port: PORT });
          
          `}
      </CodeBlock>
      <br />

      <p>
        After passing your resolvers and types (schema) to the Obsidian Router
        With the usePlayground set to true you can confirm that the router is
        working by going to localhost:3000/graphql and the server will serve the
        graphQL playground.
      </p>

      <h2>Installation</h2>
      <p>In the server:</p>
      <CodeBlock language='typescript' showLineNumbers={true} style={dracula}>
        {
          "import { ObsidianRouter } from 'https://deno.land/x/obsidian/mod.ts';"
        }
      </CodeBlock>
      <br />
      <p>In the app:</p>
      <CodeBlock language='typescript' showLineNumbers={true} style={dracula}>
        {
          "import { ObsidianWrapper } from 'https://deno.land/x/obsidian/clientMod.ts';"
        }
      </CodeBlock>
      <br />
      <h2>Attaching the Router</h2>
      <CodeBlock language='typescript' showLineNumbers={true} style={dracula}>
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
      <h2>Creating the Wrapper</h2>
      <CodeBlock language='tsx' showLineNumbers={true} style={dracula}>
        {
          //App.tsx
          `import { ObsidianWrapper } from 'https://deno.land/x/obsidian/clientMod.ts';
const App = () => {
  return (
    <ObsidianWrapper>
      <MovieApp />
    </ObsidianWrapper>
  );
};`
        }
      </CodeBlock>
      <br />
      <h2>Making a Query</h2>
      <CodeBlock language='tsx' showLineNumbers={true} style={dracula}>
        {`import { useObsidian, BrowserCache } from 'https://deno.land/x/obsidian/clientMod.ts';

const MovieApp = () => {
  const { query, cache, setCache } = useObsidian();
  const [movies, setMovies] = (React as any).useState('');

  const queryStr = \`query { 
      movies {
        id
        title
        releaseYear
        genre
      }
    }
  \`

  return (
    <h1>{movies}</h1>
    <button
      onClick={() => {
        query(queryStr)
        .then(resp => setMovies(resp.data))
        .then(resp => setCache(new BrowserCache(cache.storage)))
      }}
    >Get Movies</button>
  );
};`}
      </CodeBlock>
      <br />
      <h2>Making a Mutation</h2>
      <CodeBlock language='tsx' showLineNumbers={true} style={dracula}>
        {`import { useObsidian, BrowserCache } from 'https://deno.land/x/obsidian/clientMod.ts';

const MovieApp = () => {
  const { mutate, cache, setCache } = useObsidian();
  const [movies, setMovies] = (React as any).useState('');

  const queryStr = \`mutation {
    addMovie(input: {title: "Cruel Intentions", releaseYear: 1999, genre: "DRAMA" }) {
      id
      title
      releaseYear
      genre
    }
  }
  \`;

  return (
    <h1>{movies}</h1>
    <button
      onClick={() => {
        mutate(queryStr)
        .then(resp => setMovies(resp.data))
        .then(resp => setCache(new BrowserCache(cache.storage)))
      }}
    >Add Movie</button>
  );
};`}
      </CodeBlock>
    </div>
  );
};

export default QuickStart;
